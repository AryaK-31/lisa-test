import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLeads.module.css";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api";

export default function AdminLeads() {
  const [showSelect, setShowSelect] = useState(false);
  const [allLeads, setAllLeads] = useState([]);
  const [leads, setLeads] = useState([]);
  const [lawsuits, setLawsuits] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filters
  const [selectedLawsuit, setSelectedLawsuit] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);

  // History popup
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await api.get("/leads");
        const array =
          Array.isArray(response.data) ? response.data :
          Array.isArray(response.data?.content) ? response.data.content :
          [];

        const leadsWithEdit = array.map((l) => ({
          ...l,
          isEditing: false,
          newStatus: l.statusName,
        }));
        setAllLeads(leadsWithEdit);
        setLeads(leadsWithEdit);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Fetch Lawsuits
  useEffect(() => {
    const fetchLawsuits = async () => {
      try {
        const response = await api.get("/admin/law-suits");
        setLawsuits(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching lawsuits:", error);
      }
    };
    fetchLawsuits();
  }, []);

  // Fetch Statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await api.get("/admin/status");
        setStatuses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  // Save status change
  const handleSaveStatus = async (leadId, newStatus) => {
    try {
      const lead = leads.find((l) => l.leadId === leadId);
      await api.post(`/admin/status-history/${leadId}`, {
        fromStatus: lead.statusName,
        toStatus: newStatus,
        notes: "Status updated by admin",
        updatedBy: "ADMIN",
        dateTime: new Date().toISOString(),
        firstName: lead.firstName,
      });

      alert("Status updated successfully!");
      setLeads((prev) =>
        prev.map((l) =>
          l.leadId === leadId
            ? { ...l, statusName: newStatus, newStatus, isEditing: false }
            : l
        )
      );
      setAllLeads((prev) =>
        prev.map((l) =>
          l.leadId === leadId
            ? { ...l, statusName: newStatus, newStatus, isEditing: false }
            : l
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Apply Filters
  const handleApplyFilters = () => {
    let filtered = [...allLeads];
    if (selectedLawsuit) {
      filtered = filtered.filter((lead) => lead.lawsuitName === selectedLawsuit);
    }
    if (selectedStatus) {
      filtered = filtered.filter((lead) => lead.statusName === selectedStatus);
    }
    if (fromDate) {
      filtered = filtered.filter(
        (lead) => new Date(lead.createdAt) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (lead) => new Date(lead.createdAt) <= new Date(toDate)
      );
    }
    setLeads(filtered);
    setCurrentPage(1);
  };

  // Independent Search
  useEffect(() => {
    if (!searchQuery) {
      setLeads(allLeads);
      return;
    }
    const query = searchQuery.toLowerCase();
    const searched = allLeads.filter((lead) => {
      return (
        (lead.firstName && lead.firstName.toLowerCase().includes(query)) ||
        (lead.lastName && lead.lastName.toLowerCase().includes(query)) ||
        (lead.phone && String(lead.phone).toLowerCase().includes(query)) ||
        (lead.dob && String(lead.dob).toLowerCase().includes(query)) ||
        (lead.email && lead.email.toLowerCase().includes(query)) ||
        (lead.lawsuitName && lead.lawsuitName.toLowerCase().includes(query)) ||
        (lead.statusName && lead.statusName.toLowerCase().includes(query)) ||
        (lead.nameCreatedBy &&
          lead.nameCreatedBy.toLowerCase().includes(query)) ||
        (lead.createdAt && String(lead.createdAt).toLowerCase().includes(query))
      );
    });

    setLeads(searched);
    setCurrentPage(1);
  }, [searchQuery, allLeads]);

  const handleClearFilters = () => {
    setSelectedLawsuit("");
    setSelectedStatus("");
    setFromDate("");
    setToDate("");
    setLeads(allLeads);
    setCurrentPage(1);
  };

  // Status color mapping
  const getStatusClass = (status) => {
    switch (status) {
      case "ATTEMPT_1_VM":
        return styles["status-blue"];
      case "ATTEMPT_2_VM":
        return styles["status-red"];
      case "ATTEMPT_3_VM":
        return styles["status-green"];
      case "ATTEMPT_4_VM":
        return styles["status-yellow"];
      case "BILLABLE":
        return styles["status-darkgreen"];
      case "PAID":
        return styles["status-red"];
      case "PENDING":
        return styles["status-green"];
      case "WAITING_ON_ID":
      case "DUPLICATE_WITH_CLIENT":
        return styles["status-orange"];
      default:
        return styles["status-default"];
    }
  };

  // Pagination
  const totalEntries = leads.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentLeads = leads.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Export helpers
  const headers = [
    "First Name",
    "Last Name",
    "Phone",
    "DOB",
    "Email",
    "Lawsuit",
    "Status",
    "Created By",
    "Created At",
  ];

  const rows = leads.map((lead) => [
    lead.firstName,
    lead.lastName,
    lead.phone,
    lead.dob,
    lead.email,
    lead.lawsuitName,
    lead.statusName,
    lead.nameCreatedBy,
    lead.createdAt,
  ]);

  const handleCopy = () => {
    const text = [headers.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleCSV = () => {
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads.csv";
    link.click();
  };

  const handleExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "leads.xlsx");
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { head: [headers], body: rows });
    doc.save("leads.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Leads</title></head><body>");
    printWindow.document.write("<table border='1'><thead><tr>");
    headers.forEach((h) => printWindow.document.write(`<th>${h}</th>`));
    printWindow.document.write("</tr></thead><tbody>");
    rows.forEach((r) => {
      printWindow.document.write("<tr>");
      r.forEach((c) => printWindow.document.write(`<td>${c}</td>`));
      printWindow.document.write("</tr>");
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // Selection
  const allSelected = selected.length === leads.length && leads.length > 0;

  const handleSelectAll = () => {
    const allIds = leads.map((lead) => lead.leadId);
    setSelected(allIds);
  };

  const handleDeselectAll = () => setSelected([]);

  const handleCheckboxChange = (leadId) => {
    setSelected((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  // History
  const handleOpenHistory = async (leadId) => {
    try {
      setHistoryLoading(true);
      const res = await api.get(`/status-history/${leadId}`);
      setHistoryData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setHistoryLoading(false);
      setShowHistory(true);
    }
  };

  return (
    <div className={styles["leads-page"]}>
      {/* Filters */}
      <div className={styles["filters-row"]}>
        <select
          className={styles["filter-select"]}
          value={selectedLawsuit}
          onChange={(e) => setSelectedLawsuit(e.target.value)}
        >
          <option value="">Select Lawsuit</option>
          {lawsuits.map((ls) => (
            <option key={ls.id} value={ls.lawsuitName}>
              {ls.lawsuitName}
            </option>
          ))}
        </select>

        <select
          className={styles["filter-select"]}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Select Final Status</option>
          {statuses.map((st) => (
            <option key={st.id} value={st.statusName}>
              {st.statusName}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className={styles["date-row"]}>
        <input
          type="date"
          className={styles["date-range"]}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <span> to </span>
        <input
          type="date"
          className={styles["date-range"]}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button className={styles["apply-btn"]} onClick={handleApplyFilters}>
          Apply
        </button>
        <button className={styles["clear-btn"]} onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      {/* Export + Search */}
      <div className={styles["export-row"]}>
        <div className={styles["export-buttons"]}>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span> Entries</span>
          <button onClick={handleSelectAll}>Select all</button>
          <button onClick={handleDeselectAll}>Deselect all</button>
          <button onClick={handleCopy}>Copy</button>
          <button onClick={handleCSV}>CSV</button>
          <button onClick={handleExcel}>Excel</button>
          <button onClick={handlePDF}>PDF</button>
          <button onClick={handlePrint}>Print</button>
        </div>

        <div className={styles["search-box"]}>
          <label>Search: </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <>
          <table className={styles["leads-table"]}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) =>
                      e.target.checked ? handleSelectAll() : handleDeselectAll()
                    }
                  />
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Date Of Birth</th>
                <th>Email</th>
                <th>Lawsuit</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Created At</th>
                <th className={styles["actions-col"]}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.leadId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(lead.leadId)}
                      onChange={() => handleCheckboxChange(lead.leadId)}
                    />
                  </td>
                  <td>{lead.firstName}</td>
                  <td>{lead.lastName}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.dob}</td>
                  <td>{lead.email}</td>
                  <td>{lead.lawsuitName}</td>
                  <td>
                    {lead.isEditing ? (
                      <select
                        value={lead.newStatus || lead.statusName || ""}
                        onChange={(e) =>
                          setLeads((prev) =>
                            prev.map((l) =>
                              l.leadId === lead.leadId
                                ? { ...l, newStatus: e.target.value }
                                : l
                            )
                          )
                        }
                      >
                        {statuses.map((st) => (
                          <option key={st.id} value={st.statusName}>
                            {st.statusName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`${styles["status-tag"]} ${getStatusClass(
                          lead.statusName || lead.newStatus || "N/A"
                        )}`}
                      >
                        {lead.statusName || lead.newStatus || "N/A"}
                      </span>
                    )}
                  </td>
                  <td>{lead.nameCreatedBy}</td>
                  <td>{lead.createdAt}</td>
                  <td className={styles["actions-cell"]}>
                    <button
                      className={styles["view-btn"]}
                      onClick={() =>
                        navigate(`/leads/view/${lead.leadId}`, {
                          state: { record: lead },
                        })
                      }
                    >
                      View
                    </button>
                    <button
                      className={styles["history-btn"]}
                      onClick={() => handleOpenHistory(lead.leadId)}
                    >
                      View History
                    </button>
                    {lead.isEditing ? (
                      <button
                        className={styles["save-btn"]}
                        onClick={() =>
                          handleSaveStatus(lead.leadId, lead.newStatus)
                        }
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className={styles["edit-btn"]}
                        onClick={() =>
                          setLeads((prev) =>
                            prev.map((l) =>
                              l.leadId === lead.leadId
                                ? { ...l, isEditing: true }
                                : l
                            )
                          )
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles["pagination-footer"]}>
            <span>
              Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
            </span>
            <div className={styles["pagination-controls"]}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={currentPage === i + 1 ? styles.active : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
{/* History Modal */}
      {showHistory && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal"]}>
            <h2>Status History</h2>
            {historyLoading ? (
              <p>Loading history...</p>
            ) : historyData.length === 0 ? (
              <p>No history available</p>
            ) : (
              <table className={styles["history-table"]}>
                <thead>
                  <tr>
                    <th>From Status</th>
                    <th>To Status</th>
                    <th>Updated By</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
         <tbody>
  {historyData.map((h, idx) => (
    <tr key={idx}>
      <td className={styles[h.fromStatus] || ""}>
        {h.fromStatus}
      </td>
      <td className={styles[h.toStatus] || ""}>
        {h.toStatus}
      </td>
      <td>{h.updatedBy}</td>
      <td>{h.dateTime}</td>
      <td>{h.notes}</td>
    </tr>
  ))}
</tbody>
              </table>
            )}
            <button
              className={styles["close-btn"]}
              onClick={() => setShowHistory(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
    