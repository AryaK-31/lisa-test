

import React, { useState } from "react";
import styles from "./LeadsForm.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../utils/api.js";

export default function LDSForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    notes: "",
    wasAbused: "",
    abuseTypes: [],
    abuseDate: "",
    whoInvolved: "",
    abuseOutcomes: [],
    abuseLocations: [],
    abuseContext: "",
    abuseTypeDescription: "",
    trustedUrl: "",
    largerEvent: "",
    toldSomeoneInChurch: "",
    spokeToTherapist: "",
  });

  // Handlers
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleRadioChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e, field) {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
  }

  function handlePhone(value) {
    setFormData((prev) => ({ ...prev, phone: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
      },
      notes: formData.notes,
      dateOfAbuse: formData.abuseDate,
      wasAbused: formData.wasAbused === "yes",
      incidentTypes: formData.abuseTypes,
      incidentOutcomes: formData.abuseOutcomes,
      abuseLocations: formData.abuseLocations,
      involvedPersonDetails: formData.whoInvolved,
      abuseContext: formData.abuseContext,
      typeOfAbuse: formData.abuseTypeDescription,
      toldSomeoneInChurch: formData.toldSomeoneInChurch === "yes",
      spokeToTherapist: formData.spokeToTherapist === "yes",
      trustedUrl: formData.trustedUrl,
    };

    try {
      console.log("Payload:", JSON.stringify(payload, null, 2));
      await api.post("/user/lds-abuse-reports", payload);
      alert("LDS Claim submitted successfully!");
    } catch (err) {
      console.error("Error submitting LDS claim:", err);
      alert("Failed to submit LDS Claim.");
    }
  }

  return (
    <div className={styles.formPage}>
      <h2>Create LDS</h2>
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
          </div>

          <div className={styles.formGroup}>
            <label>Phone *</label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhone}
              inputClass={styles.phoneInput}
              placeholder="XXX-XXX-XXXX"
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
            placeholder="Enter any notes here"
          />
        </div>

        {/* Were you abused */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Were you or someone you know abused?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="wasAbused"
                  value="yes"
                  checked={formData.wasAbused === "yes"}
                  onChange={handleRadioChange}
                />{" "}
                Yes
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="wasAbused"
                  value="no"
                  checked={formData.wasAbused === "no"}
                  onChange={handleRadioChange}
                />{" "}
                No
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Type of LDS-related incident</label>
            <div className={styles.checkboxList}>
              {[
                { label: "Physical abuse or assault", value: "PHYSICAL_ABUSE" },
                { label: "Sexual abuse or misconduct", value: "SEXUAL_ABUSE" },
                { label: "Emotional abuse", value: "EMOTIONAL_ABUSE" },
                { label: "Verbal abuse", value: "VERBAL_ABUSE" },
                { label: "Other", value: "OTHER" },
              ].map((item) => (
                <label key={item.value}>
                  <input
                    type="checkbox"
                    value={item.value}
                    checked={formData.abuseTypes.includes(item.value)}
                    onChange={(e) => handleCheckboxChange(e, "abuseTypes")}
                  />{" "}
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>When did the abuse occur?</label>
            <input
              type="date"
              name="abuseDate"
              value={formData.abuseDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Who Involved */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Who was involved in the incident?</label>
          <textarea
            name="whoInvolved"
            value={formData.whoInvolved}
            onChange={handleChange}
            placeholder="Describe who was involved"
          />
        </div>

        {/* Abuse Outcomes */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>What were the outcomes of the incident?</label>
          <div className={styles.checkboxList}>
            {[
              { label: "Physical harm or injury", value: "PHYSICAL_HARM_OR_INJURY" },
              { label: "Psychological or emotional distress", value: "PSYCHOLOGICAL_OR_EMOTIONAL_DISTRESS" },
              { label: "Threats or intimidation", value: "THREATS_OR_INTIMIDATION" },
              { label: "Manipulation or control over personal decisions", value: "MANIPULATION_OR_CONTROL_OVER_PERSONAL_DECISIONS" },
              { label: "Inappropriate touching or sexual contact", value: "INAPPROPRIATE_TOUCHING_OR_SEXUAL_CONTACT" },
              { label: "Other outcome", value: "OTHER_HARM" },
            ].map((item) => (
              <label key={item.value}>
                <input
                  type="checkbox"
                  value={item.value}
                  checked={formData.abuseOutcomes.includes(item.value)}
                  onChange={(e) => handleCheckboxChange(e, "abuseOutcomes")}
                />{" "}
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Abuse Locations */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Where did the abuse occur?</label>
          <div className={styles.checkboxList}>
            {[
              { label: "At an LDS event", value: "AT_AN_LDS" },
              { label: "LDS Church building", value: "LDS_CHURCH_BUILDING" },
              { label: "LDS-sponsored activity/mission/trip", value: "LDS_SPONSORED" },
              { label: "Other location", value: "OTHER" },
            ].map((item) => (
              <label key={item.value}>
                <input
                  type="checkbox"
                  value={item.value}
                  checked={formData.abuseLocations.includes(item.value)}
                  onChange={(e) => handleCheckboxChange(e, "abuseLocations")}
                />{" "}
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Abuse Context */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Context of the abuse (e.g., during prayer meeting)</label>
          <textarea
            name="abuseContext"
            value={formData.abuseContext}
            onChange={handleChange}
            placeholder="Provide details about the context"
          />
        </div>

        {/* Type + URL */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>What type of abuse occurred?</label>
            <textarea
              name="abuseTypeDescription"
              value={formData.abuseTypeDescription}
              onChange={handleChange}
              placeholder="Describe the type of abuse"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Trusted URL</label>
            <input
              type="text"
              name="trustedUrl"
              value={formData.trustedUrl}
              onChange={handleChange}
              placeholder="Enter trusted reference URL"
            />
          </div>
        </div>

        {/* Larger Event */}
        <div className={`${styles.formGroup} ${styles.full}`}>
          <label>Was the abuse part of a larger event?</label>
          <textarea
            name="largerEvent"
            value={formData.largerEvent}
            onChange={handleChange}
            placeholder="Explain if this was part of a bigger event"
          />
        </div>

        {/* Church reporting */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Did you ever tell anyone in the Church?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="toldSomeoneInChurch"
                  value="yes"
                  checked={formData.toldSomeoneInChurch === "yes"}
                  onChange={handleRadioChange}
                />{" "}
                Yes
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="toldSomeoneInChurch"
                  value="no"
                  checked={formData.toldSomeoneInChurch === "no"}
                  onChange={handleRadioChange}
                />{" "}
                No
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Have you spoken to a therapist about this?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="spokeToTherapist"
                  value="yes"
                  checked={formData.spokeToTherapist === "yes"}
                  onChange={handleRadioChange}
                />{" "}
                Yes
              </label>
              <label style={{ marginLeft: "15px" }}>
                <input
                  type="radio"
                  name="spokeToTherapist"
                  value="no"
                  checked={formData.spokeToTherapist === "no"}
                  onChange={handleRadioChange}
                />{" "}
                No
              </label>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
