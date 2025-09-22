import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserLeads.module.css";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const dummyLeads = Array.from({ length: 50 }, (_, i) => ({
  leadId: i + 1,
  firstName: `John${i + 1}`,
  lastName: `Doe${i + 1}`,
  phone: `12345678${i + 1}`,
  dob: `1990-01-${(i % 28) + 1}`,
  email: `john${i + 1}@example.com`,
  lawsuitName: i % 2 === 0 ? "Case A" : "Case B",
  statusName: i % 3 === 0 ? "PENDING" : "BILLABLE",
  nameCreatedBy: "Admin",
  createdAt: new Date().toISOString(),
  isEditing: false,
  newStatus: i % 3 === 0 ? "PENDING" : "BILLABLE",
}));

const dummyLawsuits = [
  { id: 1, lawsuitName: "Case A" },
  { id: 2, lawsuitName: "Case B" },
  { id: 2, lawsuitName: "Case C" },
  { id: 2, lawsuitName: "Case D" },
];

const dummyStatuses = [
  { id: 1, statusName: "PENDING" },
  { id: 2, statusName: "BILLABLE" },
];

export default function AdminLeads() {
  const [showSelect, setShowSelect] = useState(false);
  const [leadType, setLeadType] = useState("");
  const [allLeads, setAllLeads] = useState([]);
  const [leads, setLeads] = useState([]);
  const [lawsuits, setLawsuits] = useState(dummyLawsuits);
  const [statuses, setStatuses] = useState(dummyStatuses);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [selectedLawsuit, setSelectedLawsuit] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);

  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllLeads(dummyLeads);
      setLeads(dummyLeads);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return styles.statusGreen;
      case "BILLABLE":
        return styles.statusDarkgreen;
      default:
        return styles.statusDefault;
    }
  };


  const handleApplyFilters = () => {
    let filtered = [...allLeads];
    if (selectedLawsuit) filtered = filtered.filter(l => l.lawsuitName === selectedLawsuit);
    if (selectedStatus) filtered = filtered.filter(l => l.statusName === selectedStatus);
    if (fromDate) filtered = filtered.filter(l => new Date(l.createdAt) >= new Date(fromDate));
    if (toDate) filtered = filtered.filter(l => new Date(l.createdAt) <= new Date(toDate));
    setLeads(filtered);
    setCurrentPage(1);
  };


  const handleClearFilters = () => {
    setSelectedLawsuit("");
    setSelectedStatus("");
    setFromDate("");
    setToDate("");
    setLeads(allLeads);
    setCurrentPage(1);
  };


  useEffect(() => {
    if (!searchQuery) {
      setLeads(allLeads);
      return;
    }
    const query = searchQuery.toLowerCase();
    const searched = allLeads.filter(l =>
      (l.firstName && l.firstName.toLowerCase().includes(query)) ||
      (l.lastName && l.lastName.toLowerCase().includes(query)) ||
      (l.phone && l.phone.toLowerCase().includes(query)) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      (l.lawsuitName && l.lawsuitName.toLowerCase().includes(query)) ||
      (l.statusName && l.statusName.toLowerCase().includes(query))
    );
    setLeads(searched);
    setCurrentPage(1);
  }, [searchQuery, allLeads]);


  const totalEntries = leads.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentLeads = leads.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  const headers = ["First Name", "Last Name", "Phone", "DOB", "Email", "Lawsuit", "Status", "Created By", "Created At"];
  const rows = leads.map(l => [
    l.firstName, l.lastName, l.phone, l.dob, l.email, l.lawsuitName, l.statusName, l.nameCreatedBy, l.createdAt
  ]);

  const handleCopy = () => {
    const text = [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };
  const handleCSV = () => {
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
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
    headers.forEach(h => printWindow.document.write(`<th>${h}</th>`));
    printWindow.document.write("</tr></thead><tbody>");
    rows.forEach(r => {
      printWindow.document.write("<tr>");
      r.forEach(c => printWindow.document.write(`<td>${c}</td>`));
      printWindow.document.write("</tr>");
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const allSelected = selected.length === leads.length && leads.length > 0;
  const handleSelectAll = () => setSelected(leads.map(l => l.leadId));
  const handleDeselectAll = () => setSelected([]);
  const handleCheckboxChange = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleNext = () => {
    if (!leadType) return;
    navigate(`/leads/${leadType.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className={styles.leadsPage}>
      <div className={styles.topHeader}>
        {!showSelect && (
          <button className={styles.addBtn} onClick={() => setShowSelect(true)}>
            + Add Leads
          </button>
        )}
      </div>

      {!showSelect && (
        <>
          <div className={styles.filterAndApply}>
            {/* Filters */}
            <div className={styles.filtersRow}>
              <div>
                <p>Lawsuit Type</p>
              </div>
              <div className={styles.filterLawsuit}>
                <select
                  value={selectedLawsuit}
                  onChange={(e) => setSelectedLawsuit(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Select Lawsuit</option>
                  {lawsuits.map((ls) => (
                    <option key={ls.id} value={ls.lawsuitName}>
                      {ls.lawsuitName}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Select Status</option>
                  {statuses.map((st) => (
                    <option key={st.id} value={st.statusName}>
                      {st.statusName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Apply */}
            <div className={styles.dateRow}>
              <p>Date and Apply</p>
              <div className={styles.dateRowSelect}>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={styles.dateRange}
                />
                <span> to </span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={styles.dateRange}
                />
              </div>
              <div className={styles.dateRowBtn}>
                <button
                  className={styles.applyBtn}
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
                <button
                  className={styles.clearBtn}
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Export + Search */}
          <div className={styles.exportRow}>
            <div className={styles.exportButtons}>
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
            <div className={styles.searchBox}>
              <label>Search: </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading leads...</p>
          ) : (
            <>
              <div className={styles.tableResponsive}>
                <table className={styles.leadsTable}>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) =>
                            e.target.checked
                              ? handleSelectAll()
                              : handleDeselectAll()
                          }
                        />
                      </th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Phone</th>
                      <th>DOB</th>
                      <th>Email</th>
                      <th>Lawsuit</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Created At</th>
                      <th>Actions</th>
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
                          <span
                            className={`${styles.statusTag} ${getStatusClass(
                              lead.statusName
                            )}`}
                          >
                            {lead.statusName}
                          </span>
                        </td>
                        <td>{lead.nameCreatedBy}</td>
                        <td>{new Date(lead.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() =>
                              navigate(`/leads/view/${lead.leadId}`, {
                                state: { record: lead },
                              })
                            }
                            style={{
                              padding: "8px 16px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                              transition: "all 0.3s ease",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              display: "inline-block",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 6px 20px rgba(102, 126, 234, 0.6)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(102, 126, 234, 0.4)";
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={styles.paginationFooter}>
                <span>
                  Showing {startIndex + 1} to {endIndex} of {totalEntries}{" "}
                  entries
                </span>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={currentPage === page ? styles.active : ""}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    {">>"}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal for Add Leads */}
      {showSelect && (
        <div className={styles.selectLeadType}>
          <h2>Select Lead Type</h2>
          <div className={styles.selectLeadTypeWrap}>
            <select
              value={leadType}
              onChange={(e) => setLeadType(e.target.value)}
              id="selectLead"
            >
              <option value="">Please select application type</option>
              {lawsuits.map((ls) => (
                <option key={ls.id} value={ls.lawsuitName}>
                  {ls.lawsuitName}
                </option>
              ))}
            </select>
            <button onClick={handleNext} disabled={!leadType}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
