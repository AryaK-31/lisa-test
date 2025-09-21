import React, { useState } from "react";
import api from "../api"; // your Axios instance
import "./TalcumForm.css";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload to match backend expectations
    const payload = {
      notes: formData.notes,
      statusId: 1,       // set as needed
      createdById: 1,    // set as needed (current user/admin ID)
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
      // Attorney field: if 'yes', send true or name? 
      // Backend example shows a string like a name, but you have yes/no radio.
      // If backend requires string, consider changing form input to text.
      // For now, send boolean true/false:
      attorney: formData.attorney === "yes",
    };

    try {
    
      await api.post("/user/talcum-leads", payload);
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
    <div className="form-page">
      <h2>Create Talcum</h2>
      <form className="talcum-form" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form-group">
          <label>
            First Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Last Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Phone <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="XXX-XXX-XXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Row 2 */}
        <div className="form-group">
          <label>
            Date Of Birth <span className="required">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Row 3 */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="2"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Start - End Year of Talcum Usage</label>
          <input
            type="text"
            name="usageYears"
            value={formData.usageYears}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>

        {/* Row 4 */}
        <div className="form-group">
          <label>Year of Dx</label>
          <input
            type="text"
            name="yearOfDiagnosis"
            value={formData.yearOfDiagnosis}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Name of Dr who Diagnosed you</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
          />
        </div>

        {/* Row 5 */}
        <div className="form-group">
          <label>Treatment</label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Attorney ?</label>
          <div className="radio-group">
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

        {/* Submit Button */}
        <div className="form-group full-width">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
