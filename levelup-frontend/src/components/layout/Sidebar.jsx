// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { id: "overview", label: "Challenges", icon: "📌" },
    { id: "microtasks", label: "Microtasks", icon: "⚡" },
    { id: "my-challenges", label: "My challenges", icon: "🎒" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-mini">LU</div>
          {!collapsed && <span className="logo-text">Level Up</span>}
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <button
            key={l.id}
            className="sidebar-link"
            onClick={() => navigate(`/dashboard?tab=${l.id}`)}
          >
            <span className="icon">{l.icon}</span>
            {!collapsed && l.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{user.fullName[0]}</div>
        {!collapsed && (
          <div className="user-meta">
            <div className="user-name">{user.fullName}</div>
            <div className="user-role">{user.role}</div>

            <button className="logout-btn" onClick={logout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
