"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, UserRole } from "@/lib/store";
import { ShieldCheck, HeartHandshake, FileText, CheckCircle, Lock, User, LogOut, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, setShowAuthModal, login } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand */}
        <Link href="/" className="brand-link">
          <img
            src="/assets/sevasetu-logo.png"
            alt="SevaSetu Logo"
            className="brand-logo-img"
            onError={(e) => {
              // fallback if not yet copied to public
              (e.currentTarget as HTMLImageElement).src = "/sevasetu-logo.png";
            }}
          />
          <div className="brand-text">
            <h1>SevaSetu</h1>
            <span>Verified Impact & Transparency</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <Link href="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            Causes
          </Link>
          <Link href="/ngos" className={`nav-item ${isActive("/ngos") ? "active" : ""}`}>
            Verified NGOs
          </Link>
          <Link href="/volunteer" className={`nav-item ${isActive("/volunteer") ? "active" : ""}`}>
            Volunteer Hub
          </Link>
          <Link href="/vault" className={`nav-item ${isActive("/vault") ? "active" : ""}`}>
            Tax Vault (80G)
          </Link>
          <Link href="/verify" className={`nav-item ${isActive("/verify") ? "active" : ""}`}>
            Verify QR
          </Link>

          {/* Conditional Protected Dashboards - Hidden from guests! */}
          {currentUser && (currentUser.role === "Field Lead" || currentUser.role === "Platform Admin") && (
            <Link href="/field-lead" className={`nav-item ${isActive("/field-lead") ? "active" : ""}`}>
              <span className="nav-role-badge">Lead</span> Field Ops
            </Link>
          )}

          {currentUser && (currentUser.role === "NGO Admin" || currentUser.role === "Platform Admin") && (
            <Link href="/ngo-admin" className={`nav-item ${isActive("/ngo-admin") ? "active" : ""}`}>
              <span className="nav-role-badge">NGO</span> Governance
            </Link>
          )}

          {currentUser && currentUser.role === "Platform Admin" && (
            <Link href="/platform-admin" className={`nav-item ${isActive("/platform-admin") ? "active" : ""}`}>
              <span className="nav-role-badge" style={{ background: "#fee2e2", color: "#991b1b" }}>Admin</span> Platform
            </Link>
          )}
        </nav>

        {/* User Account / Auth Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-outline btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem"
                }}>
                  {currentUser.name[0]}
                </div>
                <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{currentUser.name.split(" ")[0]}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--secondary)", fontWeight: 600 }}>{currentUser.role}</div>
                </div>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: "8px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-xl)",
                    width: "240px",
                    zIndex: 1100,
                    overflow: "hidden"
                  }}
                >
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{currentUser.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{currentUser.email}</div>
                    <span className="badge badge-blue" style={{ marginTop: "6px" }}>{currentUser.role}</span>
                  </div>

                  <div style={{ padding: "8px" }}>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--danger)",
                        cursor: "pointer",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                        fontWeight: 600
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-outline btn-sm"
              >
                <Lock size={14} /> Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
