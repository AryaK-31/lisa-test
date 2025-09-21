// src/pages/viewforms/NecForm.jsx
import styles from "./FormView.module.css";
import React from "react";

export default function NecForm({ data }) {
  console.log("Response", JSON.stringify(data, null, 2));

  // Extract first NEC claim (if available)
  const necCase = data.necClaims?.[0] || {};

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>NEC Report Details</h2>

      <table className={styles.formTable}>
        <tbody>
          {/* Lead Info */}
          <tr><th>Lead ID</th><td>{data.leadId || "N/A"}</td></tr>
          <tr><th>First Name</th><td>{data.firstName || "N/A"}</td></tr>
          <tr><th>Last Name</th><td>{data.lastName || "N/A"}</td></tr>
          <tr><th>Phone</th><td>{data.phone || "N/A"}</td></tr>
          <tr><th>Date Of Birth</th><td>{data.dob || "N/A"}</td></tr>
          <tr><th>Email</th><td>{data.email || "N/A"}</td></tr>
          <tr><th>Address</th><td>{data.address || "N/A"}</td></tr>
          <tr><th>Notes</th><td>{data.notes || "N/A"}</td></tr>

          {/* NEC Case Info */}
          <tr><th>Child Name</th><td>{necCase.childName || "N/A"}</td></tr>
          <tr><th>Child DOB</th><td>{necCase.childDob || "N/A"}</td></tr>
          <tr><th>Diagnosis Date</th><td>{necCase.diagnosisDate || "N/A"}</td></tr>
          <tr><th>Qualifying Injury</th><td>{necCase.qualifyingInjury || "N/A"}</td></tr>
          <tr><th>Weeks Pregnant at Birth</th><td>{necCase.weeksPregnantAtBirth || "N/A"}</td></tr>
          <tr><th>Given Cow Milk?</th><td>{necCase.givenCowMilk ? "Yes" : "No"}</td></tr>
          <tr><th>Has Attorney?</th><td>{necCase.hasAttorney ? "Yes" : "No"}</td></tr>

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
