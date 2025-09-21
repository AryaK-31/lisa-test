import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FormView.module.css";

export default function DepoForm({ data }) {
  const navigate = useNavigate();

  if (!data) return <p>No data available</p>;

  // Extract depo case details (if available)
  const depoCase = data.depoProveraCases && data.depoProveraCases.length > 0
    ? data.depoProveraCases[0]
    : null;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Depo Provera Case Details</h2>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to List
      </button>

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

          {/* Depo Provera Specific */}
          {depoCase && (
            <>
              <tr>
                <th>How long did you use Depo-Provera?</th>
                <td>{depoCase.depoProveraUsageDuration || "N/A"}</td>
              </tr>
              <tr>
                <th>How often did you take a shot?</th>
                <td>{depoCase.shotFrequency || "N/A"}</td>
              </tr>
              <tr>
                <th>What year was brand drug used?</th>
                <td>{depoCase.brandDrugYearUsed || "N/A"}</td>
              </tr>
              <tr>
                <th>What Illness were you diagnosed with?</th>
                <td>{depoCase.diagnosedIllness || "N/A"}</td>
              </tr>
              <tr>
                <th>What were your Symptoms?</th>
                <td>{depoCase.symptoms || "N/A"}</td>
              </tr>
              <tr>
                <th>Doctor who diagnosed you</th>
                <td>{depoCase.doctorDiagnosed || "N/A"}</td>
              </tr>
            </>
          )}

          {/* Lawsuit Info */}
          <tr><th>Lawsuit</th><td>{data.lawsuitName || "N/A"}</td></tr>
          <tr><th>Status</th><td>{data.statusName || "N/A"}</td></tr>
          <tr><th>Created By</th><td>{data.nameCreatedBy || "N/A"}</td></tr>
          <tr><th>Created At</th><td>{data.createdAt || "N/A"}</td></tr>
        </tbody>
      </table>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to List
      </button>
    </div>
  );
}
