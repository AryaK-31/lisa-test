import React from "react";
import styles from "./FormView.module.css";

export default function Lds({ data }) {
  if (!data) return <div>No report data available</div>;
 

  // Grab the first abuse report (if available)
  const abuseReport = data.ldsAbuseReports?.[0] || {};

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>LDS Report Details</h2>

      <table className={styles.formTable}>
        <tbody>
          {/* General Info */}
          <tr><th>First Name</th><td>{data.firstName}</td></tr>
          <tr><th>Last Name</th><td>{data.lastName}</td></tr>
          <tr><th>Phone</th><td>{data.phone}</td></tr>
          <tr><th>Date of Birth</th><td>{data.dob}</td></tr>
          <tr><th>Email</th><td>{data.email}</td></tr>
          <tr><th>Notes</th><td>{data.notes}</td></tr>

          {/* Abuse Report Details */}
          <tr><th>Were you or someone abused?</th><td>{abuseReport.wasAbused ? "Yes" : "No"}</td></tr>
          <tr><th>Type of Abuse</th><td>{abuseReport.typeOfAbuse || "N/A"}</td></tr>
          <tr><th>Date of Abuse</th><td>{abuseReport.dateOfAbuse || "N/A"}</td></tr>
          <tr><th>Who was involved?</th><td>{abuseReport.involvedPersonDetails || "N/A"}</td></tr>
          <tr><th>Incident Types</th><td>{abuseReport.incidentTypes?.join(", ") || "N/A"}</td></tr>
          <tr><th>Incident Outcomes</th><td>{abuseReport.incidentOutcomes?.join(", ") || "N/A"}</td></tr>
          <tr><th>Abuse Locations</th><td>{abuseReport.abuseLocations?.join(", ") || "N/A"}</td></tr>
          <tr><th>Abuse Context</th><td>{abuseReport.abuseContext || "N/A"}</td></tr>
          <tr><th>Trusted URL</th><td>{abuseReport.trustedUrl || "N/A"}</td></tr>
          <tr><th>Reported to Church?</th><td>{abuseReport.toldSomeoneInChurch ? "Yes" : "No"}</td></tr>
          <tr><th>Spoken to Therapist?</th><td>{abuseReport.spokeToTherapist ? "Yes" : "No"}</td></tr>
           <tr><th>trustedUrl</th><td>{abuseReport.trustedUrl || "N/A"}</td></tr>

        </tbody>
      </table>
    </div>
  );
}
