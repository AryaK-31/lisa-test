// src/pages/viewform/RoundupForm.jsx
import React from "react";
import styles from "./FormView.module.css";

export default function RoundupForm({ data }) {
  if (!data) return <p>No data available</p>;
  console.log("Response", JSON.stringify(data, null, 2));

  // If backend returns multiple roundup cases later, you can map them here
  const roundupCase = data.roundups?.[0] || {};

  return (
    <div className={styles.formContainer}>
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-blue-600 underline"
      >
        ← Back to list
      </button>

      <h2 className={styles.formTitle}>
        Roundup Lawsuit Record
      </h2>

      <table className={styles.formTable}>
        <tbody>
          {/* General Info */}
          <tr><td>Lead ID</td><td className="p-2 border">{data.leadId}</td></tr>
          <tr><td>First Name</td><td className="p-2 border">{data.firstName || "N/A"}</td></tr>
          <tr><td>Last Name</td><td className="p-2 border">{data.lastName || "N/A"}</td></tr>
          <tr><td>Phone</td><td className="p-2 border">{data.phone || "N/A"}</td></tr>
          <tr><td>Date Of Birth</td><td className="p-2 border">{data.dob || "N/A"}</td></tr>
          <tr><td>Address</td><td className="p-2 border">{data.address || "N/A"}</td></tr>
          <tr><td>Email</td><td className="p-2 border">{data.email || "N/A"}</td></tr>
          <tr><td>Notes</td><td className="p-2 border">{data.notes || "N/A"}</td></tr>

          {/* Roundup Specific */}
          <tr><td>Type Used</td><td className="p-2 border">{roundupCase.typeUsed || "N/A"}</td></tr>
          <tr><td>Exposure Duration</td><td className="p-2 border">{roundupCase.duration || "N/A"}</td></tr>
          <tr><td>Roundup Type</td><td className="p-2 border">{roundupCase.roundupTypeEnum || "N/A"}</td></tr>
          <tr><td>Start Date</td><td className="p-2 border">{roundupCase.useStarted || "N/A"}</td></tr>
          <tr><td>Diagnosed with NHL?</td><td className="p-2 border">{roundupCase.diagnosedNHL ? "Yes" : "No"}</td></tr>
          <tr><td>Treatment Received</td><td className="p-2 border">{roundupCase.receivedTreatment ? "Yes" : "No"}</td></tr>
          <tr><td>Treatment Details</td><td className="p-2 border">{roundupCase.treatmentDetails || "N/A"}</td></tr>
          <tr><td>Hospital Name</td><td className="p-2 border">{roundupCase.hospitalName || "N/A"}</td></tr>
          <tr><td>Hospital Address</td><td className="p-2 border">{roundupCase.hospitalAddress || "N/A"}</td></tr>
          <tr><td>Doctor Details</td><td className="p-2 border">{roundupCase.doctorDetails || "N/A"}</td></tr>

          {/* Other Info */}
          <tr><td>Lawsuit</td><td className="p-2 border">{data.lawsuitName || "N/A"}</td></tr>
          <tr><td>Status</td><td className="p-2 border">{data.statusName || "N/A"}</td></tr>
          <tr><td>Created By</td><td className="p-2 border">{data.nameCreatedBy || "N/A"}</td></tr>
          <tr><td>Created At</td><td className="p-2 border">{data.createdAt || "N/A"}</td></tr>
        </tbody>
      </table>

      <button
        onClick={() => window.history.back()}
        className="mt-4 text-blue-600 underline"
      >
        ← Back to list
      </button>
    </div>
  );
}
