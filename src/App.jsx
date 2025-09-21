import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Leads from "./pages/Leads";

// Forms
import DepoProveraForm from "./forms/DepoProveraForm";
import RoundupForm from "./forms/RoundupForm";
import PFASForm from "./forms/PFASForm";
import NECForm from "./forms/NECForm";
import AFFFForm from "./forms/AFFFForm";
import LDSForm from "./forms/LDSForm";
import TalcumForm from "./forms/TalcumForm";

// Pages
import ViewHistory from "./pages/ViewHistory";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ViewRecord from "./pages/ViewRecord";
import PasswordResetFlow from "./pages/PasswordResetFlow";
import CreateUser from "./pages/CreateUser";
import UserList from "./pages/UserList";
import AdminLeads from "./pages/AdminLeads";
import PasswordReset from "./pages/PasswordReset";
import EditPage from "./pages/EditPage";

export default function App() {
  // 👇 normalize role
  const rawRole = localStorage.getItem("role") || "";

  const role = rawRole.replace("ROLE_", "").toUpperCase();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          // <PrivateRoute>
          <Layout />
          // </PrivateRoute>
        }
      >
        {/* Common Routes (USER & ADMIN) */}
        <Route path="admin" element={<Admin />} /> 
        <Route path="leads" element={<Leads />} />
        <Route path="leads/view/:id" element={<ViewRecord />} />
        <Route path="change-password" element={<PasswordResetFlow />} />
        <Route path="viewhistory/:id" element={<ViewHistory />} />

        {/* Forms (accessible to everyone) */}
        <Route path="leads/depo-provera" element={<DepoProveraForm />} />
        <Route path="leads/depo_provera" element={<DepoProveraForm />} />
        <Route path="leads/roundup" element={<RoundupForm />} />
        <Route path="leads/pfas" element={<PFASForm />} />
        <Route path="leads/nec" element={<NECForm />} />
        <Route path="leads/afff" element={<AFFFForm />} />
        <Route path="leads/lds" element={<LDSForm />} />
        <Route path="leads/talcum" element={<TalcumForm />} />

        {/* Admin-only Routes */}
        {role === "ADMIN" && (
          <>
            <Route path="create-user" element={<CreateUser />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="admin-leads" element={<AdminLeads />} />
            <Route path="edituser/:id" element={<EditPage />} />
          </>
        )}
      </Route>
    </Routes>
  );
}
