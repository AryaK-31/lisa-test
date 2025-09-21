import React, { useState } from "react";
import "./AFFFForm.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../api"; // axios instance

export default function AFFFForm() {
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    address: "",
    notes: "",
    claimForLovedOne: null,
    exposedToAfffAfter1980: null,
    diagnosedConditions: [],
    exposureMethods: [],
    contractWithLawyer: null,
    convictedOfFelony: null,
    exposureLocation: "",
    exposureTimes: "",
    diagnosedBy: "",
    firstAwarenessDate: "",
    diagnosisDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => {
      const current = prev[name];
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const validateRequiredRadios = () => {
    const missing =
      formData.claimForLovedOne === null ||
      formData.exposedToAfffAfter1980 === null ||
      formData.contractWithLawyer === null ||
      formData.convictedOfFelony === null;
    return !missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRequiredRadios()) {
      alert("Please answer all Yes/No questions.");
      return;
    }

    const payload = {
      notes: formData.notes || null,
      statusId: 1,       // TODO: make dynamic if needed
      createdById: 1,    // TODO: replace with logged-in user id
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: phone || null,       // E.164 format below
        email: formData.email,
        dob: formData.dob,
        address: formData.address || null,
      },
      claimForLovedOne: formData.claimForLovedOne,
      exposedToAfffAfter1980: formData.exposedToAfffAfter1980,
      diagnosedConditions: formData.diagnosedConditions,
      exposureMethods: formData.exposureMethods,
      contractWithLawyer: formData.contractWithLawyer,
      convictedOfFelony: formData.convictedOfFelony,
      exposureLocation: formData.exposureLocation || null,
      exposureTimes:
        formData.exposureTimes === "" ? null : Number(formData.exposureTimes),
      diagnosedBy: formData.diagnosedBy || null,
      firstAwarenessDate: formData.firstAwarenessDate || null,
      diagnosisDate: formData.diagnosisDate || null,
    };

    try {
      console.log("payload"+JSON.stringify(payload, null, 2));
      const res = await api.post("/user/afff-exposures", payload);
      // If your axios interceptor unwraps to data, this will still log safely.
      console.log("POST /leads/afff response:", res);
      alert("AFFF lead created successfully!");
    } catch (error) {
      console.error("Error saving AFFF lead:", error?.response?.data || error);
      alert("Failed to create lead");
    }
  };

  return (
    <div className="form-page">
      <h2>Create AFFF Lead</h2>
      <form className="afff-form" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <PhoneInput
              country="us"
              value={phone?.replace(/^\+/, "")}
              onChange={(v) => setPhone("+" + v)}  // ensure E.164
              inputClass="phone-input"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-row">
          <div className="form-group">
            <label>Date Of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
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
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-group full">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {/* Claim Question */}
        <div className="form-row">
          <div className="form-group">
            <label>Is this claim for you or a loved one? *</label>
            <div>
              <input
                type="radio"
                name="claimForLovedOne"
                checked={formData.claimForLovedOne === true}
                onChange={() =>
                  setFormData((p) => ({ ...p, claimForLovedOne: true }))
                }
              />{" "}
              Yes
              <input
                type="radio"
                name="claimForLovedOne"
                checked={formData.claimForLovedOne === false}
                onChange={() =>
                  setFormData((p) => ({ ...p, claimForLovedOne: false }))
                }
              />{" "}
              No
            </div>
          </div>
          <div className="form-group">
            <label>Have you or a loved one been exposed to AFFF after 1980?</label>
            <div>
              <input
                type="radio"
                name="exposedToAfffAfter1980"
                checked={formData.exposedToAfffAfter1980 === true}
                onChange={() =>
                  setFormData((p) => ({ ...p, exposedToAfffAfter1980: true }))
                }
              />{" "}
              Yes
              <input
                type="radio"
                name="exposedToAfffAfter1980"
                checked={formData.exposedToAfffAfter1980 === false}
                onChange={() =>
                  setFormData((p) => ({ ...p, exposedToAfffAfter1980: false }))
                }
              />{" "}
              No
            </div>
          </div>
        </div>

        {/* Diagnosed Conditions */}
        <div className="form-group full">
          <label>Diagnosed Conditions (select one or more)</label>
          <div className="radio-list">
            {[
              "KIDNEY_CANCER",
              "TESTICULAR_CANCER",
              "THYROID_CANCER",
              "THYROID_DISEASE",
              "ULCERATIVE_COLITIS",
              "LIVER_CANCER",
            ].map((cond) => (
              <label key={cond} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={formData.diagnosedConditions.includes(cond)}
                  onChange={() => handleArrayChange("diagnosedConditions", cond)}
                />{" "}
                {cond.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div>

        {/* Diagnosis Date */}
        <div className="form-group">
          <label>Diagnosis Date</label>
          <input
            type="date"
            name="diagnosisDate"
            value={formData.diagnosisDate}
            onChange={handleChange}
          />
        </div>

        {/* Exposure Methods */}
        <div className="form-group full">
          <label>Exposure Methods (select one or more)</label>
          <div className="radio-list">
            {[
              "EMERGENCY_RESPONDER",
              "MILITARY_BASE",
              "CIVILIAN_FIREFIGHTER",
              "MILITARY_FIREFIGHTER",
              "AIRPORT_WORKER",
              "OIL_RIG_WORKER",
              "INDUSTRIAL_WORKER",
              "CHEMICAL_PLANT_WORKER",
              "OTHER",
            ].map((method) => (
              <label key={method} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={formData.exposureMethods.includes(method)}
                  onChange={() => handleArrayChange("exposureMethods", method)}
                />{" "}
                {method.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div>

        {/* More Questions */}
        <div className="form-row">
          <div className="form-group">
            <label>Are you currently in contract with a lawyer on this claim?</label>
            <div>
              <input
                type="radio"
                name="contractWithLawyer"
                checked={formData.contractWithLawyer === true}
                onChange={() =>
                  setFormData((p) => ({ ...p, contractWithLawyer: true }))
                }
              />{" "}
              Yes
              <input
                type="radio"
                name="contractWithLawyer"
                checked={formData.contractWithLawyer === false}
                onChange={() =>
                  setFormData((p) => ({ ...p, contractWithLawyer: false }))
                }
              />{" "}
              No
            </div>
          </div>

          <div className="form-group">
            <label>Have you ever been convicted of a felony?</label>
            <div>
              <input
                type="radio"
                name="convictedOfFelony"
                checked={formData.convictedOfFelony === true}
                onChange={() =>
                  setFormData((p) => ({ ...p, convictedOfFelony: true }))
                }
              />{" "}
              Yes
              <input
                type="radio"
                name="convictedOfFelony"
                checked={formData.convictedOfFelony === false}
                onChange={() =>
                  setFormData((p) => ({ ...p, convictedOfFelony: false }))
                }
              />{" "}
              No
            </div>
          </div>
        </div>

        {/* Exposure Info */}
        <div className="form-row">
          <div className="form-group">
            <label>How many times were you exposed?</label>
            <input
              type="number"
              name="exposureTimes"
              value={formData.exposureTimes}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>When diagnosed, and by whom?</label>
            <input
              type="text"
              name="diagnosedBy"
              value={formData.diagnosedBy}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Where and when did this exposure occur?</label>
            <input
              type="text"
              name="exposureLocation"
              value={formData.exposureLocation}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>When did you first become aware of the health issue?</label>
            <input
              type="date"
              name="firstAwarenessDate"
              value={formData.firstAwarenessDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}
