import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./LeadsForm.module.css"; 
import api from "../utils/api"; // ✅ Ensure this path is correct

export default function PFASForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    notes: "",
    diagnosis: [],
    diagnosed: "",
    symptoms: "",
    treatment: "",
    pfasExposure: "",
    attorney: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedDiagnosis = checked
          ? [...prevData.diagnosis, value]
          : prevData.diagnosis.filter((d) => d !== value);
        return { ...prevData, diagnosis: updatedDiagnosis };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      lead: {
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
      },
      pfasCase: {
        dateDiagnosed: formData.diagnosed,
        diagnoses: formData.diagnosis.map((d) =>
          d.toUpperCase().replace(/\s+/g, "_")
        ),
        symptomsAndStage: formData.symptoms,
        treatmentReceived: formData.treatment,
        exposedPriorTo1970: formData.pfasExposure === "Yes",
        hasAttorney: formData.attorney === "Yes",
      },
    };

    try {
      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));
      await api.post("/user/pfas-claims", payload);
      alert("Form submitted successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        email: "",
        address: "",
        notes: "",
        diagnosis: [],
        diagnosed: "",
        symptoms: "",
        treatment: "",
        pfasExposure: "",
        attorney: "",
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.formPage}>
      <h2>Create PFAS Lead</h2>

      <form className={styles.afffForm} onSubmit={handleSubmit}>
        {/* === Row 1 === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
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
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Phone <span className="required">*</span>
            </label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              containerClass={styles.phoneInput}
              inputClass={styles.phoneInput}
            />
          </div>
        </div>

        {/* === Row 2 === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
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

        {/* === Notes === */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter notes"
          ></textarea>
        </div>

        {/* === Diagnosis === */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Diagnosis</label>
          <div className={styles.checkboxGrid}>
            {[
              "Kidney Cancer",
              "Testicular Cancer",
              "Ulcerative Colitis",
              "Liver Cancer",
            ].map((condition) => (
              <label key={condition}>
                <input
                  type="checkbox"
                  name="diagnosis"
                  value={condition}
                  checked={formData.diagnosis.includes(condition)}
                  onChange={handleChange}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>

        {/* === Date Diagnosed + Symptoms + Treatment === */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date Diagnosed</label>
            <input
              type="date"
              name="diagnosed"
              value={formData.diagnosed}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Symptoms and Stage</label>
            <input
              type="text"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe symptoms and stage"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Treatment Received</label>
            <input
              type="text"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment details"
            />
          </div>
        </div>

        {/* === PFAS Exposure === */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Were you only exposed to PFAS prior to 1970?</label>
          <div className={styles.radioInline}>
            <label>
              <input
                type="radio"
                name="pfasExposure"
                value="Yes"
                checked={formData.pfasExposure === "Yes"}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="pfasExposure"
                value="No"
                checked={formData.pfasExposure === "No"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* === Attorney === */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Do you currently have an attorney for PFAS Case?</label>
          <div className={styles.radioInline}>
            <label>
              <input
                type="radio"
                name="attorney"
                value="Yes"
                checked={formData.attorney === "Yes"}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="attorney"
                value="No"
                checked={formData.attorney === "No"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* === Submit Button === */}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
