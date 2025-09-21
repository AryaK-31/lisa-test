import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FormView.module.css"; // Your CSS module

export default function PFASDetails({ data }) {
  const navigate = useNavigate();

  if (!data) return <p>No PFAS data available</p>;

  // Extract PFAS case details (first case if multiple)
  const pfasCase = data.pfasCases?.[0] || {};

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>PFAS Report Details</h2>

      <table className={styles.formTable}>
        <tbody>
          {/* General Lead Info */}
          <tr><th>First Name</th><td>{data.firstName}</td></tr>
          <tr><th>Last Name</th><td>{data.lastName}</td></tr>
          <tr><th>Phone</th><td>{data.phone}</td></tr>
          <tr><th>Date of Birth</th><td>{data.dob}</td></tr>
          <tr><th>Email</th><td>{data.email}</td></tr>
          <tr><th>Address</th><td>{data.address}</td></tr>
          <tr><th>Notes</th><td>{data.notes}</td></tr>

          {/* PFAS Case Specific */}
          <tr><th>Diagnosis</th><td>{pfasCase.diagnoses?.join(", ") || "N/A"}</td></tr>
          <tr><th>Date Diagnosed</th><td>{pfasCase.dateDiagnosed || "N/A"}</td></tr>
          <tr><th>Symptoms & Stage</th><td>{pfasCase.symptomsAndStage || "N/A"}</td></tr>
          <tr><th>Treatment</th><td>{pfasCase.treatmentReceived || "N/A"}</td></tr>
          <tr><th>Exposed Prior to 1970</th><td>{pfasCase.exposedPriorTo1970 ? "Yes" : "No"}</td></tr>
          <tr><th>Attorney</th><td>{pfasCase.hasAttorney ? "Yes" : "No"}</td></tr>

          {/* Lawsuit Info */}
          <tr><th>Lawsuit</th><td>{data.lawsuitName}</td></tr>
          <tr><th>Status</th><td>{data.statusName}</td></tr>
          <tr><th>Created By</th><td>{data.nameCreatedBy}</td></tr>
          <tr><th>Created At</th><td>{data.createdAt}</td></tr>
        </tbody>
      </table>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back to list
      </button>
    </div>
  );
}
