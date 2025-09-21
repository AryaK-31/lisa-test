import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./DepoProveraForm.css";
import api from "../api"; // Axios instance

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
    } else if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform formData into backend-expected structure
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
    <div className="form-wrapper">
      <h2>Create PFAS</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
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

        {/* Phone */}
        <div className="form-group">
          <label>
            Phone <span className="required">*</span>
          </label>
          <PhoneInput
            country={"us"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
          />
        </div>

        {/* Date Of Birth */}
        <div className="form-group">
          <label>
            Date Of Birth <span className="required">*</span>
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

        {/* Diagnosis */}
        <div className="form-group">
          <label>Diagnosis</label>
          <div className="checkbox-group">
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
                />{" "}
                {condition}
              </label>
            ))}
          </div>
        </div>

        {/* Date Diagnosed */}
        <div className="form-group">
          <label>Date Diagnosed</label>
          <input
            type="date"
            name="diagnosed"
            value={formData.diagnosed}
            onChange={handleChange}
          />
        </div>

        {/* Symptoms */}
        <div className="form-group">
          <label>
            What were your symptoms and stage for the ailment you received?
          </label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
          />
        </div>

        {/* Treatment */}
        <div className="form-group">
          <label>What treatment did you receive?</label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
          />
        </div>

        {/* PFAS Exposure */}
        <div className="form-group">
          <label>Were you only exposed to PFAS prior to 1970?</label>
          <div>
            <label>
              <input
                type="radio"
                name="pfasExposure"
                value="Yes"
                checked={formData.pfasExposure === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="pfasExposure"
                value="No"
                checked={formData.pfasExposure === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        {/* Attorney */}
        <div className="form-group">
          <label>Do you currently have an attorney for PFAS Case?</label>
          <div>
            <label>
              <input
                type="radio"
                name="attorney"
                value="Yes"
                checked={formData.attorney === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="attorney"
                value="No"
                checked={formData.attorney === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
