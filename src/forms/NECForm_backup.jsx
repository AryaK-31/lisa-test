import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./NECForm.css";
import api from "../api"; // Axios instance

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

  // generic handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // phone handler
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

   const payload = {
  // Lead info
  leadRequest: {
    "notes":formData.notes,
   customer:{ firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    email: formData.email,
    dob: formData.dob,
    address: formData.address,
  }
  },

  // NecClaim info
  qualifyingInjury: formData.injury, // should map to InjuryType enum in backend
  childName: formData.childName,
  childDob: formData.childDob,
  diagnosisDate: formData.diagnoseDate,
  weeksPregnantAtBirth: formData.weeksBirth,
  givenCowMilk: formData.cowMilk === "yes",
  hasAttorney: formData.attorney === "yes",

  // Optional metadata (if applicable in your DB)
  leadId: formData.leadId || null,
  notes: formData.notes,
  statusId: formData.statusId || null,
  lawsuitId: formData.lawsuitId || null,
  createdById: formData.createdById || null,
};


    try {
      console.log("Payload:", JSON.stringify(payload, null, 2));
      await api.post("/user/nec-claims", payload);
      alert("NEC Form submitted successfully!");

      // reset
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
    <div className="nec-page">
      <div className="nec-card">
        <h2 className="nec-title">Create NEC</h2>

        <form className="nec-form" onSubmit={handleSubmit}>
          {/* Qualifying Injuries */}
          <div className="nec-full">
            <label className="nec-label">Qualifying Injuries:</label>
            <div className="radio-block">
              <label className="radio-row">
                <input
                  type="radio"
                  name="injury"
                  value="NECROTIZING_ENTEROCOLITIS"
                  checked={formData.injury === "NECROTIZING_ENTEROCOLITIS"}
                  onChange={handleChange}
                />
                <span className="radio-text">Necrotizing Enterocolitis</span>
              </label>

              <label className="radio-row">
                <input
                  type="radio"
                  name="injury"
                  value="SHORT_BOWEL_SYNDROME"
                  checked={formData.injury === "SHORT_BOWEL_SYNDROME"}
                  onChange={handleChange}
                />
                <span className="radio-text">
                  Short Bowel Syndrome (diagnosis must have been a RESULT of surgery required due to an infection)
                </span>
              </label>

              <label className="radio-row">
                <input
                  type="radio"
                  name="injury"
                  value="GASTROINTESTINAL_INJURY"
                  checked={formData.injury === "GASTROINTESTINAL_INJURY"}
                  onChange={handleChange}
                />
                <span className="radio-text">
                  Gastrointestinal Injury (Intestinal infection was the reason surgery was performed, (b) Some or any intestines were removed during surgery)
                </span>
              </label>
            </div>
          </div>

          {/* Row 1 */}
          <div className="nec-col">
            <label className="nec-label">First Name <span className="required">*</span></label>
            <input className="nec-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Last Name <span className="required">*</span></label>
            <input className="nec-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Phone <span className="required">*</span></label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%" }}
            />
          </div>

          {/* Row 2 */}
          <div className="nec-col">
            <label className="nec-label">Date Of Birth <span className="required">*</span></label>
            <input className="nec-input" type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Email <span className="required">*</span></label>
            <input className="nec-input" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Notes</label>
            <textarea className="nec-textarea" name="notes" rows="3" value={formData.notes} onChange={handleChange}></textarea>
          </div>

          {/* Row 3 */}
          <div className="nec-col">
            <label className="nec-label">Address</label>
            <input className="nec-input" type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Child Name</label>
            <input className="nec-input" type="text" name="childName" value={formData.childName} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">Child DOB</label>
            <input className="nec-input" type="date" name="childDob" value={formData.childDob} onChange={handleChange} />
          </div>

          {/* Row 4 */}
          <div className="nec-col">
            <label className="nec-label">Diagnose Date</label>
            <input className="nec-input" type="date" name="diagnoseDate" value={formData.diagnoseDate} onChange={handleChange} />
          </div>

          <div className="nec-col">
            <label className="nec-label">How many weeks when gave birth?</label>
            <input className="nec-input" type="number" name="weeksBirth" value={formData.weeksBirth} onChange={handleChange} min="23" max="36" />
          </div>

          <div className="nec-col"></div>

          {/* Radio Questions */}
          <div className="nec-full">
            <p className="nec-label small">
              Injured party (infant) must have been given cow's milk formula or cow's milk fortifier prior to diagnosis.
            </p>
            <div className="radio-inline">
              <label>
                <input type="radio" name="cowMilk" value="yes" checked={formData.cowMilk === "yes"} onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="cowMilk" value="no" checked={formData.cowMilk === "no"} onChange={handleChange} /> No
              </label>
            </div>
          </div>

          <div className="nec-full">
            <p className="nec-label small">Does the claimant currently have an attorney for this?</p>
            <div className="radio-inline">
              <label>
                <input type="radio" name="attorney" value="yes" checked={formData.attorney === "yes"} onChange={handleChange} /> Yes
              </label>
              <label>
                <input type="radio" name="attorney" value="no" checked={formData.attorney === "no"} onChange={handleChange} /> No
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="nec-full submit-row">
            <button className="nec-submit" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
