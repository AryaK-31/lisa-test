import React from "react";
import styles from "./FormView.module.css"; // Import CSS module

export default function TalcumForm({ data }) {
  if (!data) return <p>No data available</p>;

  const talcumCase =
    data.talcumLeads && data.talcumLeads.length > 0
      ? data.talcumLeads[0]
      : null;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Talcum Report Details</h2>

      <table className={styles.formTable}>
        <tbody>
          {/* General Info */}
          <tr><th>ID</th><td>{data.leadId || "N/A"}</td></tr>
          <tr><th>First Name</th><td>{data.firstName || "N/A"}</td></tr>
          <tr><th>Last Name</th><td>{data.lastName || "N/A"}</td></tr>
          <tr><th>Phone</th><td>{data.phone || "N/A"}</td></tr>
          <tr><th>Date Of Birth</th><td>{data.dob || "N/A"}</td></tr>
          <tr><th>Email</th><td>{data.email || "N/A"}</td></tr>
          <tr><th>Address</th><td>{data.address || "N/A"}</td></tr>
          <tr><th>Notes</th><td>{data.notes || "N/A"}</td></tr>

          {/* Talcum Case Specific */}
          {talcumCase ? (
            <>
              <tr><th>Start - End Year of Talcum Usage</th><td>{talcumCase.startEndYear || "N/A"}</td></tr>
              <tr><th>Diagnosis</th><td>{talcumCase.diagnosis || "N/A"}</td></tr>
              <tr><th>Year of Dx</th><td>{talcumCase.yearOfDiagnosis || "N/A"}</td></tr>
              <tr><th>Name of Dr who Diagnosed you</th><td>{talcumCase.doctorName || "N/A"}</td></tr>
              <tr><th>Hospital Name</th><td>{talcumCase.hospitalName || "N/A"}</td></tr>
              <tr><th>Treatment</th><td>{talcumCase.treatment || "N/A"}</td></tr>
              <tr><th>Attorney ?</th><td>{talcumCase.attorneyInvolved ? "Yes" : "No"}</td></tr>
            </>
          ) : (
            <tr><td colSpan="2">No Talcum case details available</td></tr>
          )}

          {/* Lawsuit Info */}
          <tr><th>Lawsuit</th><td>{data.lawsuitName || "N/A"}</td></tr>
          <tr><th>Status</th><td>{data.statusName || "N/A"}</td></tr>
          <tr><th>Created By</th><td>{data.nameCreatedBy || "N/A"}</td></tr>
          <tr><th>Created At</th><td>{data.createdAt || "N/A"}</td></tr>
        </tbody>
      </table>

      <button className={styles.backBtn} onClick={() => window.history.back()}>
        Back to list
      </button>
    </div>
  );
}
