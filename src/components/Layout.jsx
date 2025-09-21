import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import "./Layout.css";

export default function Layout() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="layout">
      <Sidebar active={active} setActive={setActive} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
