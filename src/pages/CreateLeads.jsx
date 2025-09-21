import { useState } from "react";
import DepoProveraForm from "../forms/DepoProveraForm";

export default function CreateLeads() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      {/* सुरुवातीला Add Lead बटण दिसेल */}
      {!showForm && (
        <button
          style={{ background: "green", color: "white", padding: "10px", borderRadius: "5px" }}
          onClick={() => setShowForm(true)}   // ✅ क्लिक केल्यावर state बदल
        >
          + Add Lead
        </button>
      )}

      {/* showForm true झाला की form दिसेल */}
      {showForm && (
        <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "20px", borderRadius: "8px" }}>
          <h2>Create Lead - Depo Provera</h2>
          <DepoProveraForm />
          <button
            style={{ marginTop: "10px", background: "red", color: "white", padding: "8px", borderRadius: "5px" }}
            onClick={() => setShowForm(false)}   // ✅ cancel/close करण्यासाठी
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
