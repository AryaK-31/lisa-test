import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./DepoProveraForm.css"; 
import api from "../api";


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
    useStart: "",
    nhlDiagnosis: "",
    diagnosisDate: "",
    treatment: "",
    treatmentDetails: "",
    hospitalName: "",
    hospitalAddress: "",
    doctorName: "",
  });

  // सामान्य inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // checkbox multiple
  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.roundupType, value]
        : prev.roundupType.filter((v) => v !== value);
      return { ...prev, roundupType: updated };
    });
  }

  // phone
  function handlePhone(value) {
    setFormData((prev) => ({ ...prev, phone: value }));
  }

  // submit
  async function handleSubmit(e) {
    e.preventDefault();

   const payload = {
  lead: {
    notes: formData.notes,
  },
  customer: {
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    email: formData.email,
    dob: formData.dob,
    address: formData.address,
  },
  roundup: {
    typeUsed: formData.typeUsed,             // e.g., "Concentrate"
    useStarted: formData.useStart,           // will be "MM-YYYY" format if serialized
    duration: formData.duration,
    diagnosedNHL: !!formData.nhlDiagnosis,   // ensure boolean
    diagnosisDate: formData.diagnosisDate,
    receivedTreatment: !!formData.treatment, // ensure boolean
    treatmentDetails: formData.treatmentDetails,
    hospitalName: formData.hospitalName,
    hospitalAddress: formData.hospitalAddress,
    doctorDetails: formData.doctorName,
    roundupTypeEnum: formData.roundupTypeEnum, // single enum string
    roundupType: formData.roundupType,         // array (if you want to keep multiple types from UI)
  },
};

    try {
        console.log("Payload to be sent:", JSON.stringify(payload, null, 2));
      await api.post("/user/roundups", payload);
      alert("Roundup claim submitted successfully!");

      // reset form
      setFormData({
      phone: "",
firstName: "",
lastName: "",
dob: "", // yyyy-mm-dd
email: "",
address: "",


// Lead
notes: "",


// Roundup usage & health
duration: "", // e.g., "2 years"
roundupType: [], // array for UI (checkbox/multi-select)
roundupTypeEnum: "", // single enum to send (e.g., PRE_MIX, CONCENTRATE)
typeUsed: "", // text like "Concentrate"
useStart: "", // month input: yyyy-mm (will serialize to MM-YYYY)
nhlDiagnosis: false,
diagnosisDate: "", // yyyy-mm-dd (optional, required if nhlDiagnosis=true)
treatment: false,
treatmentDetails: "",
hospitalName: "",
hospitalAddress: "",
doctorName: "",
      });
    } catch (err) {
      console.error("Error submitting Roundup claim:", err);
      alert("Failed to submit Roundup claim.");
    }
  }

  return (
    <div className="page-content">
      <div className="form-wrapper">
        <h2>Create Roundup</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          {/* Phone */}
          <div className="form-group">
            <label>
              Phone <span className="required">*</span>
            </label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhone}
              inputStyle={{ width: "100%" }}
            />
          </div>

          {/* First Name */}
          <div className="form-group">
            <label>
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label>
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>
              Date of Birth <span className="required">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes"
            ></textarea>
          </div>

          {/* Roundup Duration */}
          <div className="form-group">
            <label>
              How long did you use RoundUp (MUST BE MORE THAN 1 YEAR)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
            />
          </div>

          {/* Roundup Type */}
          <div className="form-group">
            <label>What type of Roundup was used?</label>
            <div>
              {["Concentrate or pre-Mix", "Pre mix (with water or other)", "Both"].map(
                (item) => (
                  <div key={item}>
                    <label>
                      <input
                        type="checkbox"
                        value={item}
                        checked={formData.roundupType.includes(item)}
                        onChange={handleCheckboxChange}
                      />{" "}
                      {item}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Use Start Date */}
          <div className="form-group">
            <label>When was the use started (Month and Year)?</label>
            <input
              type="month"
              name="useStart"
              value={formData.useStart}
              onChange={handleChange}
            />
          </div>

          {/* NHL Diagnosis */}
          <div className="form-group">
            <label>
              Were you (or your loved one) diagnosed with Non-Hodgkin's
              Lymphoma?
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="nhlDiagnosis"
                  value="yes"
                  checked={formData.nhlDiagnosis === "yes"}
                  onChange={handleChange}
                />{" "}
                Yes
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="nhlDiagnosis"
                  value="no"
                  checked={formData.nhlDiagnosis === "no"}
                  onChange={handleChange}
                />{" "}
                No
              </label>
            </div>
          </div>

          {/* Diagnosis Date */}
          <div className="form-group">
            <label>
              When were you (or your loved one) diagnosed with Non-Hodgkin's
              Lymphoma?
            </label>
            <input
              type="text"
              name="diagnosisDate"
              value={formData.diagnosisDate}
              onChange={handleChange}
              placeholder="Enter diagnosis date"
            />
          </div>

          {/* Treatment Received */}
          <div className="form-group">
            <label>Have you received any treatment for the NHL diagnosis?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="treatment"
                  value="yes"
                  checked={formData.treatment === "yes"}
                  onChange={handleChange}
                />{" "}
                Yes
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="treatment"
                  value="no"
                  checked={formData.treatment === "no"}
                  onChange={handleChange}
                />{" "}
                No
              </label>
            </div>
          </div>
<div className="form-group">
  <label>Type Used (free text)</label>
  <input
    type="text"
    name="typeUsed"
    value={formData.typeUsed}
    onChange={handleChange}
    placeholder="Enter type used (e.g., Concentrate)"
  />
</div>
<div className="form-group">
  <label>
    Select Roundup Type (Enum) <span className="required">*</span>
  </label>
  <div>
    {["PRE_MIX", "CONCENTRATE", "READY_TO_USE"].map((type) => (
      <label key={type} style={{ marginRight: "15px" }}>
        <input
          type="checkbox"
          name="roundupTypeEnum"
          value={type}
          checked={formData.roundupTypeEnum === type}
          onChange={(e) =>
            setFormData({
              ...formData,
              roundupTypeEnum: e.target.checked ? type : "",
            })
          }
        />
        {type.replace("_", " ")}
      </label>
    ))}
  </div>
</div>
          {/* Treatment Details */}
          <div className="form-group">
            <label>
              What treatment have you received? Chemo, Radiation, Both? List
              below
            </label>
            <input
              type="text"
              name="treatmentDetails"
              value={formData.treatmentDetails}
              onChange={handleChange}
              placeholder="Enter treatment details"
            />
          </div>

          {/* Hospital Name */}
          <div className="form-group">
            <label>Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Enter hospital name"
            />
          </div>

          {/* Hospital Address */}
          <div className="form-group">
            <label>Hospital Address</label>
            <input
              type="text"
              name="hospitalAddress"
              value={formData.hospitalAddress}
              onChange={handleChange}
              placeholder="Enter hospital address"
            />
          </div>

          {/* Doctor Name */}
          <div className="form-group">
            <label>Doctor Name and Designation</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor name and designation"
            />
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
