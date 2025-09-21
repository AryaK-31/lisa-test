import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./DepoProveraForm.css";
import api from "../api";

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

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle phone separately
  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      lead: {
        notes: formData.notes,
      },
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
      console.log("Outgoing payload (stringified):\n", JSON.stringify(payload, null, 2));
      const response = await api.post("/user/depo-provera", payload);

      console.log("Server Response:\n", JSON.stringify(response.data, null, 2));

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
    <div className="form-wrapper">
      <h2>Create Depo Provera</h2>

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
            required
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
            required
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
            required
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
            required
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

        {/* How long used */}
        <div className="form-group">
          <label>
            How long did you use Depo-Provera? 
            <small> (1 year minimum brand usage, off market in 2005)</small>
          </label>
          <input
            type="text"
            name="usageDuration"
            value={formData.usageDuration}
            onChange={handleChange}
            placeholder="e.g. 2 years"
          />
        </div>

        {/* How often shot */}
        <div className="form-group">
          <label>
            How often did you take a shot? 
            <small> (one every 3 months, 1 year minimum)</small>
          </label>
          <input
            type="text"
            name="shotFrequency"
            value={formData.shotFrequency}
            onChange={handleChange}
            placeholder="e.g. Every 3 months"
          />
        </div>

        {/* What year brand drug used */}
        <div className="form-group">
          <label>What year was brand drug used?</label>
          <input
            type="text"
            name="brandYear"
            value={formData.brandYear}
            onChange={handleChange}
            placeholder="Enter year"
          />
        </div>

        {/* Illness diagnosed */}
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
          <label>Who is the doctor that diagnosed you?</label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            placeholder="Enter doctor's name"
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
  );
}
