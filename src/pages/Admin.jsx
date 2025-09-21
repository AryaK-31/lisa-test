import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Checkmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 24 24"
    width="24px"
    height="24px"
  >
    <path d="M20.285,6.709l-11.43,11.43l-5.143-5.143l1.428-1.428l3.715,3.715l10.002-10.002L20.285,6.709z" />
  </svg>
);

const STATUS_CONFIG = {
  TOTAL: { label: "Total", color: "#D0F0F7" },
  PENDING: { label: "PENDING", color: "#FFF9C4" },
  REJECTED: { label: "REJECTED", color: "#F8BBD0" },
  FELONY: { label: "FELONY", color: "#FFCDD2" },
  BILLABLE: { label: "BILLABLE", color: "#DCEDC8" },
  PAID: { label: "PAID", color: "#B2EBF2" },
  DUPLICATE: { label: "DUPLICATE", color: "#D1C4E9" },
  VERIFIED: { label: "VERIFIED", color: "#BBDEFB" },
  SENT_TO_CLIENT: { label: "SENT TO CLIENT", color: "#B3E5FC" },
  BACKGROUND_CHECK: { label: "Background Check", color: "#E1BEE7" },
  SIGNED_UNDER_QC: { label: "Signed - Under QC", color: "#FFE0B2" },
  NOT_RESPONDING_TO_CLIENT: { label: "Not Responding to Client", color: "#FFECB3" },
  REJECTED_BY_CLIENT: { label: "Rejected By Client", color: "#FFCDD2" },
  DEAD_LEAD: { label: "Dead Lead", color: "#B2DFDB" },
  WORKING: { label: "Working", color: "#FFF59D" },
  CALL_BACK: { label: "Call Back", color: "#C8E6C9" },
  ATTEMPT_1_VM: { label: "Attempt -1 VM", color: "#FFF9C4" },
  ATTEMPT_2_VM: { label: "Attempt -2 VM", color: "#FFFDE7" },
  ATTEMPT_3_VM: { label: "Attempt -3 VM", color: "#FFF8E1" },
  ATTEMPT_4_VM: { label: "Attempt -4 VM", color: "#FFECB3" },
  ATTEMPT_5_VM: { label: "Attempt -5 VM", color: "#FFE082" },
  CALL_BACK_REQUEST: { label: "Call Back Request", color: "#FFD54F" },
  WAITING_ON_ID: { label: "Waiting on ID", color: "#FFF176" },
  SENT_TO_OTHER_BUYER: { label: "Sent to other buyer", color: "#DCEDC8" },
  REACHED_DAILY_CAP: { label: "Reached Daily Cap", color: "#BBDEFB" },
  ID_VERIFICATION_FAILED: { label: "ID Verification Failed", color: "#FFE082" },
  BACK_TO_SOURCE_NO_ANSWER: { label: "Back to Source - No Answer", color: "#FFCDD2" },
  READY_TF: { label: "Ready TF", color: "#FFF9C4" },
  CAMPAIGN_PAUSED: { label: "Campaign Paused", color: "#C5E1A5" },
  CHARGEBACK: { label: "Chargeback", color: "#E1BEE7" },
  DUPLICATE_WITH_CLIENT: { label: "Duplicate With Client", color: "#F3E5F5" },
  NOT_ACCEPTABLE_ZIP: { label: "Not Acceptable Zip", color: "#FFCDD2" },
  TPCA_LINK_MISSING: { label: "TPCA link Missing", color: "#EF9A9A" },
  SUB_UNSUCCESSFUL_CPQ: { label: "Sub Unsuccessful CPQ", color: "#DCEDC8" },
  SUB_UNSUCCESSFUL_LL: { label: "Sub Unsuccessful LL", color: "#E1BEE7" },
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date("2025-08-01"));
  const [endDate, setEndDate] = useState(new Date("2025-08-31"));
  const [counts, setCounts] = useState({});
  const [chartData, setChartData] = useState([]);
  const [rawChartData, setRawChartData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // fetch counts + chart data
  const fetchInitialData = async () => {
    try {
      console.log("Fetching status counts...");
      const res = await api.get("/leads/status-counts");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.statusCounts || [];

      const formattedData = data.map((item) => ({
        date: item.date,
        Total: item.count,
      }));

      setChartData(formattedData);
      setRawChartData(formattedData);

      if (Array.isArray(data)) {
        const obj = {};
        let total = 0;

        data.forEach((item) => {
          obj[item.status] = item.count;
          total += item.count;
        });

        obj["TOTAL"] = total;
        setCounts(obj);

        console.log("Counts object:", obj);
      } else {
        setCounts({});
      }
    } catch (error) {
      console.error("API error:", error);
      setCounts({});
      alert("Failed to load status counts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [location.key]);

  const ranges = {
    "Last 7 Days": [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
    "Last 30 Days": [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    "This Month": [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ],
    "Last Month": [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    ],
    "This Year": [
      new Date(new Date().getFullYear(), 0, 1),
      new Date(new Date().getFullYear(), 11, 31),
    ],
  };

  const applyRange = (key) => {
    if (ranges[key]) {
      setStartDate(ranges[key][0]);
      setEndDate(ranges[key][1]);
      setIsOpen(false);
    } else if (key === "Custom Range") {
      setIsOpen(true);
    }
  };

  const handleApply = async () => {
    try {
      const res = await api.get("/leads/daily-status-count", {
        params: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      });

      console.log(JSON.stringify(res.data));
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.statusCounts || [];

      const formattedData = data.map((item) => ({
        date: item.date,
        Total: item.count,
      }));

      setChartData(formattedData);
      setRawChartData(formattedData);

      if (Array.isArray(data)) {
        const obj = {};
        let total = 0;

        data.forEach((item) => {
          obj[item.status] = item.count;
          total += item.count;
        });

        obj["TOTAL"] = total;
        setCounts(obj);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      alert("Failed to load filtered data. Please try again later.");
    }
  };

  // ✅ Updated Clear functionality
  const handleClear = async () => {
    try {
      // reset to default dates
      setStartDate(new Date("2025-08-01"));
      setEndDate(new Date("2025-08-31"));

      // refetch initial data
      await fetchInitialData();

      // close dropdown
      setIsOpen(false);
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset dashboard data. Please try again later.");
    }
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="dashboard wrapper" style={{ display: "flex", flexDirection: "column" }}>

      <div className={styles.welcomeDiv}>
        <p className={styles.welcome}>Welcome Sample Name</p>
        <h2 className={styles.heading}>Dashboard</h2>
      </div>

      <div className={styles.dashboard}>
        {/* ✅ Cards grid */}
        <div className={styles.grid}>
          {["TOTAL", ...Object.keys(STATUS_CONFIG).filter((k) => k !== "TOTAL")].map(
            (status) => {
              const config = STATUS_CONFIG[status];
              return (
                <div
                  key={status}
                  className={styles.card}
                  style={{ backgroundColor: config.color, position: "relative" }}
                >
                  <div className={styles.checkmark}>
                    <Checkmark />
                  </div>
                  <span className={styles.value}>{counts[status] || 0}</span>
                  <span className={styles.label}>{config.label}</span>
                </div>
              );
            }
          )}
        </div>

        {/* ✅ Filter Section (row layout) */}
        <div
          className={styles.filterSection}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* Date Range Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.dateDropdownBtn}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
              <span
                style={{
                  marginLeft: 8,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid black",
                }}
              ></span>
            </button>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  left: 0,
                  width: "220px",
                  background: "#fff",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  zIndex: 1000,
                  padding: "10px",
                }}
              >
                {Object.keys(ranges).map((key) => (
                  <div
                    key={key}
                    onClick={() => applyRange(key)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      marginBottom: "4px",
                      background: startDate.getTime() === ranges[key][0].getTime() &&
                        endDate.getTime() === ranges[key][1].getTime()
                        ? "#007bff"
                        : "transparent",
                      color: startDate.getTime() === ranges[key][0].getTime() &&
                        endDate.getTime() === ranges[key][1].getTime()
                        ? "white"
                        : "black",
                    }}
                  >
                    {key}
                  </div>
                ))}

                <div
                  onClick={() => applyRange("Custom Range")}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    color: isOpen ? "#007bff" : "black",
                  }}
                >
                  Custom Range
                </div>

                {isOpen && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={endDate}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Start Date"
                      inline />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="End Date"
                      inline />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ✅ Buttons side by side */}
          <button className={styles.applyBtn} onClick={handleApply}>
            Apply
          </button>
          <button className={styles.clearBtn} onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* ✅ Chart Section */}
        <div className={styles.chartSection}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#00ACC1"
                strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div></div>
  );
};

export default Dashboard;
