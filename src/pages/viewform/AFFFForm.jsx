import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FormView.module.css"; // ✅ CSS Module import

export default function AfffForm({ data }) {
  const navigate = useNavigate();

  console.log("Response Data:", data);

  if (!data) return <p>No data available</p>;

  // Extract the first AFFF case if exists
  const afffCase = data.afffExposureClaims?.[0] || {};

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>AFFF Case Details</h2>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to List
      </button>

      <table className={styles.formTable}>
        <tbody>
          {/* General Info */}
          <tr><th>Lead ID</th><td>{data.leadId || "N/A"}</td></tr>
          <tr><th>First Name</th><td>{data.firstName || "N/A"}</td></tr>
          <tr><th>Last Name</th><td>{data.lastName || "N/A"}</td></tr>
          <tr><th>Phone</th><td>{data.phone || "N/A"}</td></tr>
          <tr><th>Date Of Birth</th><td>{data.dob || "N/A"}</td></tr>
          <tr><th>Address</th><td>{data.address || "N/A"}</td></tr>
          <tr><th>Email</th><td>{data.email || "N/A"}</td></tr>
          <tr><th>Notes</th><td>{data.notes || "N/A"}</td></tr>

          {/* Lawsuit Info */}
          <tr><th>Lawsuit ID</th><td>{data.lawsuitId || "N/A"}</td></tr>
          <tr><th>Lawsuit Name</th><td>{data.lawsuitName || "N/A"}</td></tr>
          <tr><th>Status</th><td>{data.statusName || "N/A"}</td></tr>
          <tr><th>Created By</th><td>{data.nameCreatedBy || "N/A"}</td></tr>
          <tr><th>Created At</th><td>{data.createdAt || "N/A"}</td></tr>

          {/* AFFF-Specific (nested object) */}
          <tr><th>Claim for Loved One?</th><td>{afffCase.claimForLovedOne ? "Yes" : "No"}</td></tr>
          <tr><th>Exposed After 1980?</th><td>{afffCase.exposedToAfffAfter1980 ? "Yes" : "No"}</td></tr>
          <tr><th>Diagnosed Conditions</th><td>{afffCase.diagnosedConditions?.join(", ") || "N/A"}</td></tr>
          <tr><th>Exposure Methods</th><td>{afffCase.exposureMethods?.join(", ") || "N/A"}</td></tr>
          <tr><th>Contract With Lawyer</th><td>{afffCase.contractWithLawyer ? "Yes" : "No"}</td></tr>
          <tr><th>Convicted Of Felony</th><td>{afffCase.convictedOfFelony ? "Yes" : "No"}</td></tr>
          <tr><th>Exposure Location</th><td>{afffCase.exposureLocation || "N/A"}</td></tr>
          <tr><th>Exposure Times</th><td>{afffCase.exposureTimes || "N/A"}</td></tr>
          <tr><th>Diagnosed By</th><td>{afffCase.diagnosedBy || "N/A"}</td></tr>
          <tr><th>First Awareness Date</th><td>{afffCase.firstAwarenessDate || "N/A"}</td></tr>
        </tbody>
      </table>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to List
      </button>
    </div>
  );
}
