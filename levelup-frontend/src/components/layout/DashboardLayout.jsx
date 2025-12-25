// src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import "./DashboardLayout.css";
import "./Sidebar.css";
import "./Header.css";

export default function DashboardLayout({
  user,
  isStudent,
  canCreate,
  activeView,
  setActiveView,
  onLogout,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navItem = (key, label, { disabled = false } = {}) => {
    const isActive = activeView === key;

    return (
      <button
        key={key}
        type="button"
        className="sidebar-link"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setActiveView(key);
        }}
        style={
          disabled
            ? { opacity: 0.4, cursor: "default" }
            : isActive
            ? {
                background: "rgba(79,70,229,0.14)",
                borderColor: "rgba(129,140,248,0.9)",
                boxShadow: "0 0 0 1px rgba(79,70,229,0.4)",
              }
            : undefined
        }
      >
        <span
          className="icon"
          style={{ fontSize: 10, opacity: 0.7, marginRight: collapsed ? 0 : 4 }}
        >
          •
        </span>
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div className="dash-root">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-mini">LU</div>
            {!collapsed && <div className="logo-text">Level Up</div>}
          </div>

          <button
            type="button"
            className="collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItem("overview", "Challenges overview")}
          {navItem("profile", "Profile", { disabled: !isStudent })}
          {navItem("my-challenges", "My challenges", { disabled: !isStudent })}
          {navItem("create-challenge", "Create challenge", {
            disabled: !canCreate,
          })}
          {navItem("create-microtask", "Create microtask", {
            disabled: !canCreate,
          })}
          {navItem("microtasks", "Microtasks")}
          {navItem("rating", "Leaderboard", { disabled: true })}
          {navItem("portfolio", "Portfolio", { disabled: true })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">
            {user.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="user-meta">
              <div className="user-name">{user.full_name}</div>
              <div className="user-role">{user.role}</div>
              <button
                type="button"
                className="logout-btn"
                onClick={onLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-header">
          <div className="header-title">Level Up Your Career</div>
          <div className="user-greeting">
            {user.role === "student"
              ? "Ready to level up today?"
              : "Ready to launch new challenges?"}
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
