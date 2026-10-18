import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <img
                src="/assets/sevasetu-logo.png"
                alt="SevaSetu Logo"
                style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
              />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>SevaSetu Platform</h3>
            </div>
            <p>
              India's first statutory-first bridge empowering genuine philanthropy with automated 80G tax certificates, instant Form 10BD income tax filing queues, and verified volunteer telemetry.
            </p>
            <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--primary-light)", padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
              <ShieldCheck size={14} /> Ministry of Finance Section 80G & 12A Compliant
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><Link href="/">Active Causes</Link></li>
              <li><Link href="/ngos">Verified NGO Directory</Link></li>
              <li><Link href="/volunteer">Volunteer Attendance Hub</Link></li>
              <li><Link href="/vault">80G Tax Vault & Receipts</Link></li>
              <li><Link href="/verify">Public QR Authenticator</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Statutory & Compliance</h4>
            <ul>
              <li><a href="#80g">Section 80G(5)(vi) Rules</a></li>
              <li><a href="#10bd">CBDT Form 10BD Schedule</a></li>
              <li><a href="#fcra">FCRA Public Transparency</a></li>
              <li><a href="#darpan">NITI Aayog Darpan Sync</a></li>
              <li><a href="#privacy">Donor Data Protection</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SevaSetu Security Vault</h4>
            <p style={{ fontSize: "0.85rem", marginBottom: "12px" }}>
              Every donation generates a cryptographically signed Bill ID. Volunteer hours are logged via ephemeral OTP verification to eradicate paper-forged service hours.
            </p>
            <div style={{ padding: "10px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: "0.78rem" }}>
              <strong>MongoDB + Supabase Dual-Engine:</strong>
              <div style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                Relational ledger in Supabase for audit compliance; distributed telemetry in MongoDB.
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SevaSetu Foundation. Dedicated to genuine community impact with zero leakages.</p>
        </div>
      </div>
    </footer>
  );
}
