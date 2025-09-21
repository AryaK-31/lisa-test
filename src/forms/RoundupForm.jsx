import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./LeadsForm.module.css";
import api from "../utils/api";

export default function RoundupForm() {
  const [formData, setFormData] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    address: "",
    notes: "",
    duration: "",
    roundupType: [],
    roundupTypeEnum: "",
    typeUsed: "",
    useStart: "",
    nhlDiagnosis: "",
    diagnosisDate: "",
    treatment: "",
    treatmentDetails: "",
    hospitalName: "",
    hospitalAddress: "",
    doctorName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.roundupType, value]
        : prev.roundupType.filter((v) => v !== value);
      return { ...prev, roundupType: updated };
    });
  };

  const handlePhone = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      lead: { notes: formData.notes },
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
      },
      roundup: {
        typeUsed: formData.typeUsed,
        useStarted: formData.useStart,
        duration: formData.duration,
        diagnosedNHL: formData.nhlDiagnosis === "yes",
        diagnosisDate: formData.diagnosisDate,
        receivedTreatment: formData.treatment === "yes",
        treatmentDetails: formData.treatmentDetails,
        hospitalName: formData.hospitalName,
        hospitalAddress: formData.hospitalAddress,
        doctorDetails: formData.doctorName,
        roundupTypeEnum: formData.roundupTypeEnum,
        roundupType: formData.roundupType,
      },
    };

    try {
      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));
      const response = await api.post("/user/roundups", payload);
      console.log("Server Response:\n", response.data);
      alert("Roundup claim submitted successfully!");
      setFormData({
        phone: "",
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        address: "",
        notes: "",
        duration: "",
        roundupType: [],
        roundupTypeEnum: "",
        typeUsed: "",
        useStart: "",
        nhlDiagnosis: "",
        diagnosisDate: "",
        treatment: "",
        treatmentDetails: "",
        hospitalName: "",
        hospitalAddress: "",
        doctorName: "",
      });
    } catch (err) {
      console.error("Error submitting Roundup claim:", err);
      alert("Failed to submit Roundup claim.");
    }
  };

  return (
    <div className={styles.formPage}>
      <h2>Create Roundup Lead</h2>
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
              placeholder="Enter first name"
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
              placeholder="Enter last name"
              required
            />
             <div className={styles.formGroup}>
            <label>Phone *</label>
            <PhoneInput
              country="us"
              value={formData.phone}
              onChange={handlePhone}
              inputClass={styles.phoneInput}
            />
          </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date of Birth *</label>
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
              placeholder="Enter email"
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
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Notes */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter notes"
          />
        </div>

        {/* Duration & Start */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Duration of Use *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Use Start (Month & Year)</label>
            <input
              type="month"
              name="useStart"
              value={formData.useStart}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Roundup Type */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Roundup Type Used</label>
            <div className={styles.checkboxGrid}>
              {["Concentrate", "Pre-mix", "Both"].map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.roundupType.includes(item)}
                    onChange={handleCheckboxChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* NHL Diagnosis */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Diagnosed with Non-Hodgkin's Lymphoma?</label>
            <div className={styles.radioInline}>
              {["yes", "no"].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name="nhlDiagnosis"
                    value={val}
                    checked={formData.nhlDiagnosis === val}
                    onChange={handleChange}
                  />
                  {val.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis Date */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date of Diagnosis</label>
            <input
              type="text"
              name="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={handleChange}
              placeholder="Enter diagnosis date"
            />
          </div>
        </div>

        {/* Treatment */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Received Treatment?</label>
            <div className={styles.radioInline}>
              {["yes", "no"].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name="treatment"
                    value={val}
                    checked={formData.treatment === val}
                    onChange={handleChange}
                  />
                  {val.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Other Fields */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Type Used</label>
            <input
              type="text"
              name="typeUsed"
              value={formData.typeUsed}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Treatment Details</label>
            <input
              type="text"
              name="treatmentDetails"
              value={formData.treatmentDetails}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Hospital Address</label>
            <input
              type="text"
              name="hospitalAddress"
              value={formData.hospitalAddress}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Doctor Name & Designation</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Enum */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Roundup Type (Enum) *</label>
            <div className={styles.radioInline}>
              {["PRE_MIX", "CONCENTRATE", "READY_TO_USE"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="roundupTypeEnum"
                    value={type}
                    checked={formData.roundupTypeEnum === type}
                    onChange={handleChange}
                  />
                  {type.replace("_", " ")}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
