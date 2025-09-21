import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./LeadsForm.module.css";
import api from "../utils/api.js";

export default function DepoProveraForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    notes: "",
    usageDuration: "",
    shotFrequency: "",
    brandYear: "",
    illness: "",
    symptoms: "",
    doctor: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      lead: { notes: formData.notes },
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dob: formData.dob,
        email: formData.email,
        address: formData.address,
      },
      depoProvera: {
        notes: formData.notes,
        depoProveraUsageDuration: formData.usageDuration,
        shotFrequency: formData.shotFrequency,
        brandDrugYearUsed: formData.brandYear,
        diagnosedIllness: formData.illness,
        symptoms: formData.symptoms,
        doctorDiagnosed: formData.doctor,
      },
    };

    try {
      console.log("Payload:\n", JSON.stringify(payload, null, 2));
      const response = await api.post("/user/depo-provera", payload);
      console.log("Server Response:\n", response.data);

      if (response.status === 200 || response.status === 201) {
        alert("Form submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          dob: "",
          email: "",
          address: "",
          notes: "",
          usageDuration: "",
          shotFrequency: "",
          brandYear: "",
          illness: "",
          symptoms: "",
          doctor: "",
        });
      } else {
        alert("Error: Something went wrong while submitting");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <div className={styles.formPage}>
      <h2>Create Depo Provera Lead</h2>

      <form className={styles.afffForm} onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name <span className="required">*</span></label>
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
            <label>Last Name <span className="required">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone <span className="required">*</span></label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputClass={styles.phoneInput}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date Of Birth <span className="required">*</span></label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email <span className="required">*</span></label>
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
          ></textarea>
        </div>

        {/* Usage Duration */}
        <div className={styles.formGroup}>
          <label>How long did you use Depo-Provera?</label>
          <input
            type="text"
            name="usageDuration"
            value={formData.usageDuration}
            onChange={handleChange}
            placeholder="e.g. 2 years"
          />
        </div>

        {/* Shot Frequency */}
        <div className={styles.formGroup}>
          <label>How often did you take a shot?</label>
          <input
            type="text"
            name="shotFrequency"
            value={formData.shotFrequency}
            onChange={handleChange}
            placeholder="e.g. Every 3 months"
          />
        </div>

        {/* Brand Year */}
        <div className={styles.formGroup}>
          <label>What year was brand drug used?</label>
          <input
            type="text"
            name="brandYear"
            value={formData.brandYear}
            onChange={handleChange}
            placeholder="Enter year"
          />
        </div>

        {/* Illness */}
        <div className={styles.formGroup}>
          <label>What illness were you diagnosed with?</label>
          <input
            type="text"
            name="illness"
            value={formData.illness}
            onChange={handleChange}
            placeholder="Enter illness"
          />
        </div>

        {/* Symptoms */}
        <div className={styles.formGroup}>
          <label>What were your Symptoms?</label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Enter symptoms"
          />
        </div>

        {/* Doctor */}
        <div className={styles.formGroup}>
          <label>Who is the doctor that diagnosed you?</label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            placeholder="Enter doctor's name"
          />
        </div>

        {/* Centered Submit Button */}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
