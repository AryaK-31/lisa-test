import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./LeadsForm.module.css";
import api from "../utils/api"; // ✅ Ensure correct API path

export default function NECForm() {
  const [formData, setFormData] = useState({
    injury: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    notes: "",
    address: "",
    childName: "",
    childDob: "",
    diagnoseDate: "",
    weeksBirth: "",
    cowMilk: "",
    attorney: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      leadRequest: {
        notes: formData.notes,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          dob: formData.dob,
          address: formData.address,
        },
      },
      qualifyingInjury: formData.injury,
      childName: formData.childName,
      childDob: formData.childDob,
      diagnosisDate: formData.diagnoseDate,
      weeksPregnantAtBirth: formData.weeksBirth,
      givenCowMilk: formData.cowMilk === "yes",
      hasAttorney: formData.attorney === "yes",
    };

    try {
      console.log("Payload:", JSON.stringify(payload, null, 2));
      await api.post("/user/nec-claims", payload);
      alert("NEC Form submitted successfully!");

      // Reset form
      setFormData({
        injury: "",
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        email: "",
        notes: "",
        address: "",
        childName: "",
        childDob: "",
        diagnoseDate: "",
        weeksBirth: "",
        cowMilk: "",
        attorney: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.formPage}>
      <h2>Create NEC Lead</h2>

      <form className={styles.afffForm} onSubmit={handleSubmit}>
        {/* Qualifying Injuries */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Qualifying Injuries:</label>
          <div className={styles.radioInline}>
            <label>
              <input
                type="radio"
                name="injury"
                value="NECROTIZING_ENTEROCOLITIS"
                checked={formData.injury === "NECROTIZING_ENTEROCOLITIS"}
                onChange={handleChange}
              />
              Necrotizing Enterocolitis
            </label>
            <label>
              <input
                type="radio"
                name="injury"
                value="SHORT_BOWEL_SYNDROME"
                checked={formData.injury === "SHORT_BOWEL_SYNDROME"}
                onChange={handleChange}
              />
              Short Bowel Syndrome (result of surgery due to an infection)
            </label>
            <label>
              <input
                type="radio"
                name="injury"
                value="GASTROINTESTINAL_INJURY"
                checked={formData.injury === "GASTROINTESTINAL_INJURY"}
                onChange={handleChange}
              />
              Gastrointestinal Injury (surgery performed and intestines removed)
            </label>
          </div>
        </div>

        {/* Row 1 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone *</label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              containerClass={styles.phoneInput}
              inputClass={styles.phoneInput}
            />
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
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Child Name</label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Child DOB</label>
            <input
              type="date"
              name="childDob"
              value={formData.childDob}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Diagnose Date</label>
            <input
              type="date"
              name="diagnoseDate"
              value={formData.diagnoseDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Weeks at Birth</label>
            <input
              type="number"
              name="weeksBirth"
              min="23"
              max="36"
              value={formData.weeksBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Radio Group 1 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>
            Infant must have been given cow's milk formula or fortifier prior to diagnosis:
          </label>
          <div className={styles.radioInline}>
            <label>
              <input
                type="radio"
                name="cowMilk"
                value="yes"
                checked={formData.cowMilk === "yes"}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="cowMilk"
                value="no"
                checked={formData.cowMilk === "no"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Radio Group 2 */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Does the claimant currently have an attorney?</label>
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
