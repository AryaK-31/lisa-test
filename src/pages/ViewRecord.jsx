// src/pages/ViewRecord.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api";
import NecForm from "./viewform/NecForm";
import AfffForm from "./viewform/AFFFForm";
import  RoundupForm  from "./viewform/RoundupForm";
import TalcumForm from "./viewform/TalcumForm";
import LdsForm from "./viewform/LdsForm";
import DepoForm from "./viewform/DepoForm";
import PfasForm from "./viewform/PfasForm";
// DepoForm pn add karaycha ase
 
export default function ViewRecord() {
  const { id } = useParams();
  const location = useLocation();
 
console.log("Location State:", location.state);
  // If navigated via state, use it; otherwise fetch from backend
  const [record, setRecord] = useState(location.state?.record || null);
  const [loading, setLoading] = useState(!record);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    // Already have record from state or no id provided
   
 
    const fetchRecord = async () => {
      try {
        setLoading(true);
        console.log("Params ID:", id);
        const res = await api.get(`/leads/${id}`);
        console.log("Params ID:", res.data);
        setRecord(res.data);
      } catch (err) {
        console.error("Error fetching record:", err);
        setError("Failed to fetch record");
      } finally {
        setLoading(false);
      }
    };
 
    fetchRecord();
  }, []);
 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!record) return <p>No record found</p>;
 
  switch (record.lawsuitName) {
    case "NEC":
      return <NecForm data={record} />;
    case "AFFF":
      return <AfffForm data={record} />;
    case "ROUNDUP":
      return <RoundupForm data={record} />;
     case "DEPO_PROVERA":
      return <DepoForm data={record} />;
          case "TALCUM":
      return <TalcumForm data={record} />;
       case "LDS":
      return <LdsForm data={record} />;
       case "PFAS":
      return <PfasForm data={record} />;
 

    default:
      return <p>No form found for this lawsuit</p>;
  }
}