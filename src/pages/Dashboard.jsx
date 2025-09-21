import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";
import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  console.log("DASHBOARD LOADED v7");             // marker in Console
  document.title = "Dashboard v7";                // marker in tab title
  const name = localStorage.getItem("name") || "User";   // 👈 show Welcome <name>
  const [collapsed, setCollapsed] = useState(false);     // 👈 hide/show toggle

  // collapse/expand the left sidebar by toggling a class on <body>
  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-collapsed");
  };



  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="screen">
      <div className="card">
        <div style={{ background: '#ffef99', padding: '8px', marginBottom: '8px' }}>
          TEMP: If you can see this, new bundle is loaded.
        </div>

        <button
          type="button"
          className={styles.hamburger}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>
        {/* --- Page heading with the user’s name --- */}
        <div className="pageHeading">
          <h2>Welcome {name}!</h2>
        </div>

        {/* --- Section bar with toggle --- */}
        <div className={styles.sectionBar}>
          <h3>Dashboard</h3>
          <button
            className="toggleBtn"
            onClick={() => setCollapsed(c => !c)}
            aria-expanded={!collapsed}
          >
            {collapsed ? "Show" : "Hide"}
          </button>
        </div>
        {!collapsed && (
          <div className="row">
            <button onClick={() => navigate("/admin")}>Go to Admin</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}

      </div>
    </div>
  );
}
