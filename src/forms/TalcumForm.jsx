import React, { useState } from "react";
import styles from "./LeadsForm.module.css";
import api from "../utils/api";

export default function TalcumForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    notes: "",
    usageYears: "",
    diagnosis: "",
    yearOfDiagnosis: "",
    doctorName: "",
    hospitalName: "",
    treatment: "",
    attorney: "", // "yes" or "no"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      notes: formData.notes,
      statusId: 1,
      createdById: 1,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
      },
      startEndYearOfTalcumUsage: formData.usageYears,
      diagnosis: formData.diagnosis,
      yearOfDx: formData.yearOfDiagnosis,
      nameOfDrWhoDiagnosedYou: formData.doctorName,
      hospitalName: formData.hospitalName,
      treatment: formData.treatment,
      attorney: formData.attorney === "yes",
    };

    try {
      // await api.post("/user/talcum-leads", payload);
      console.log("Submitted Payload:", payload);
      alert("Form submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        email: "",
        address: "",
        notes: "",
        usageYears: "",
        diagnosis: "",
        yearOfDiagnosis: "",
        doctorName: "",
        hospitalName: "",
        treatment: "",
        attorney: "",
      });
    } catch (error) {
      console.error("Submission failed:", error.response?.data || error.message);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className={styles.formPage}>
      <h2>Create Talcum</h2>
      <form className={styles.afffForm} onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="XXX-XXX-XXXX"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date Of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* Row 3 - Notes */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Notes</label>
          <textarea
            rows="2"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter additional notes"
          />
        </div>

        {/* Row 4 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Start - End Year of Talcum Usage</label>
            <input
              type="text"
              name="usageYears"
              value={formData.usageYears}
              onChange={handleChange}
              placeholder="e.g., 2005 - 2015"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Year of Diagnosis</label>
            <input
              type="text"
              name="yearOfDiagnosis"
              value={formData.yearOfDiagnosis}
              onChange={handleChange}
              placeholder="e.g., 2018"
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Name of Doctor Who Diagnosed You</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor's name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Enter hospital name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Treatment</label>
            <input
              type="text"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment details"
            />
          </div>
        </div>

        {/* Row 6 - Attorney */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Do you currently have an attorney?</label>
            <div className={styles.radioInline}>
              <label>
                <input
                  type="radio"
                  name="attorney"
                  value="yes"
                  checked={formData.attorney === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="attorney"
                  value="no"
                  checked={formData.attorney === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
