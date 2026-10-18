"use client";

import React from "react";
import { useApp, UserRole } from "@/lib/store";
import { ShieldAlert, Lock, ArrowRight } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  dashboardName: string;
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, dashboardName, children }: RoleGuardProps) {
  const { currentUser, setShowAuthModal, login } = useApp();

  // If not logged in
  if (!currentUser) {
    return (
      <div className="container" style={{ padding: "80px 24px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "520px", width: "100%", background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "36px", textAlign: "center", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-main)" }}>
            Authentication Required
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "24px", lineHeight: 1.6 }}>
            The <strong>{dashboardName}</strong> is restricted under role-based governance. Please sign in with an authorized account ({allowedRoles.join(" or ")}).
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Sign In to Continue <ArrowRight size={16} />
            </button>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "8px" }}>
              Quick logins available in modal for demo testing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If logged in but role not allowed
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="container" style={{ padding: "80px 24px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "520px", width: "100%", background: "#fff", border: "1px solid #fed7aa", borderRadius: "var(--radius-lg)", padding: "36px", textAlign: "center", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#ffedd5", color: "#c2410c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-main)" }}>
            Access Restricted
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "24px", lineHeight: 1.6 }}>
            You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}). This dashboard is reserved for <strong>{allowedRoles.join(", ")}</strong>.
          </p>

          <button
            onClick={() => {
              // Switch role easily
              login(allowedRoles[0]);
            }}
            className="btn btn-secondary"
            style={{ width: "100%" }}
          >
            Switch to {allowedRoles[0]} Account
          </button>
        </div>
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
}
