"use client";

import React, { useState } from "react";
import { useApp, UserRole } from "@/lib/store";
import { X, Lock, Shield, CheckCircle, UserCheck } from "lucide-react";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useApp();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Donor");
  const [fullName, setFullName] = useState("");

  if (!showAuthModal) return null;

  const handleQuickLogin = (selectedRole: UserRole, demoEmail: string) => {
    login(selectedRole, demoEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, email || `${role.toLowerCase()}@sevasetu.org`, fullName || `${role} User`);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/assets/sevasetu-logo.png"
              alt="SevaSetu Logo"
              style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }}
            />
            <div className="modal-title">{activeTab === "login" ? "Sign In to SevaSetu" : "Register Profile"}</div>
          </div>
          <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Demo Logins Banner */}
          <div style={{ background: "var(--primary-light)", padding: "12px", borderRadius: "var(--radius-md)", marginBottom: "20px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <UserCheck size={16} /> 1-Click Role Login (Demo Credentials)
            </div>
            <div className="quick-fill-grid">
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => handleQuickLogin("Platform Admin", "admin@sevasetu.org")}
              >
                Platform Admin
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => handleQuickLogin("NGO Admin", "ngo@akshayaseva.org")}
              >
                NGO Admin
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => handleQuickLogin("Field Lead", "lead@sevasetu.org")}
              >
                Field Lead
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => handleQuickLogin("Volunteer", "volunteer@sevasetu.org")}
              >
                Volunteer
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => handleQuickLogin("Donor", "donor@sevasetu.org")}
              >
                Donor
              </button>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
              Saved in <code style={{ fontWeight: 600 }}>CREDENTIALS.md</code> for offline review
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {activeTab === "register" && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Radhika Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@domain.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Account Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="Donor">Donor (Tax Exemption 80G Vault)</option>
                <option value="Volunteer">Volunteer (QR Attendance & Certificate)</option>
                <option value="Field Lead">Field Lead (OTP Session Generator & Verification)</option>
                <option value="NGO Admin">NGO Admin (Project & Milestone Governance)</option>
                <option value="Platform Admin">Platform Admin (Global Audit & Compliance)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }}>
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem" }}>
            {activeTab === "login" ? (
              <span>
                Need an account?{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}
                  onClick={() => setActiveTab("register")}
                >
                  Register Here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}
                  onClick={() => setActiveTab("login")}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
