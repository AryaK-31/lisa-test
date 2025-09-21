// Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "../utils/auth.jsx";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaSignOutAlt,
  FaKey,
  FaClipboardList,
  FaUserTie,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import styles from "./Sidebar.module.css";

export default function Sidebar({ setActive, active }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = (menu) => {
    setActive(menu);
    if (menu === "Logout") {
      clearAuth();
      navigate("/");
      setMobileOpen(false);
      return;
    }

    const routes = {
      Dashboard: "/admin",
      Leads: "/leads",
      "Change Password": "/change-password",
      "Create User": "/create-user",
      "User List": "/user-list",
      "Admin Leads": "/admin-leads",
    };

    if (routes[menu]) navigate(routes[menu]);
    setMobileOpen(false);
  };

  const menuItems =
    role === "ADMIN"
      ? [
        { label: "Dashboard", icon: <FaTachometerAlt className={styles.icon} /> },
        { label: "Create User", icon: <FaUserPlus className={styles.icon} /> },
        { label: "User List", icon: <FaUsers className={styles.icon} /> },
        { label: "Admin Leads", icon: <FaUserTie className={styles.icon} /> },
        { label: "Change Password", icon: <FaKey className={styles.icon} /> },
        { label: "Logout", icon: <FaSignOutAlt className={styles.icon} /> },
      ]
      : [
        { label: "Dashboard", icon: <FaTachometerAlt className={styles.icon} /> },
        { label: "Leads", icon: <FaClipboardList className={styles.icon} /> },
        { label: "Change Password", icon: <FaKey className={styles.icon} /> },
        { label: "Logout", icon: <FaSignOutAlt className={styles.icon} /> },
      ];

  return (
    <>
      {/* Hamburger visible only on mobile */}
      {!mobileOpen && (
        <div className={styles.mobileHeader}>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
          <div>
            <img className={styles.hamburgerLogo} src="../../public/image.png" alt="" />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
        {/* Close button only on mobile */}
        <div className={styles.mobileClose}>
          <div className="btn-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <FaTimes size={24} />
          </div>
        </div>

        {role === "ADMIN" ? (
          <h2 className={styles.logo}>Admin</h2>
        ) : (
          <div
            className={styles.brand}
            onClick={() => {
              navigate("/admin");
              setMobileOpen(false);
            }}
            role="button"
            tabIndex={0}
          >
            <img
              src="/public/image.png"
              alt="Legal Intake Services of America"
              className={styles.brandLogo}
            />
          </div>
        )}

        <ul className={styles.menuList}>
          {menuItems.map(({ label, icon }) => (
            <li
              key={label}
              className={`${styles.menuItem} ${location.pathname === `/${label.toLowerCase().replace(/ /g, "-")}`
                ? styles.active
                : ""
                }`}
              onClick={() => handleMenuClick(label)}
            >
              {icon} <span className={styles.menuLabel}>{label}</span>
            </li>
          ))}
        </ul>

      </aside>

      {/* Overlay */}
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </>
  );
}
