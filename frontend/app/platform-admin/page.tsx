"use client";

import React, { useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useApp } from "@/lib/store";
import { ShieldAlert, Database, Server, CheckCircle2, Lock, Cpu, Activity } from "lucide-react";

export default function PlatformAdminPage() {
  const { campaigns, donations, volunteerSessions } = useApp();

  return (
    <RoleGuard allowedRoles={["Platform Admin"]} dashboardName="Platform Headquarters & System Audit">
      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-blue" style={{ marginBottom: "8px" }}>Platform Admin Only</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
            Platform Headquarters, Dual-DB & Statutory Audit
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Real-time infrastructure health, MongoDB telemetry records, Supabase statutory relational store, and global compliance ledger.
          </p>
        </div>

        {/* Dual Database Status Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* MongoDB Atlas Box */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Database size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>MongoDB Atlas Engine</h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Document & Event Telemetry Store</div>
                </div>
              </div>
              <span className="badge badge-green">Operational</span>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Stores high-throughput telemetry, 10-minute ephemeral OTP check-ins, campaign milestones, and unstructured ground audit trails.
            </div>

            <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Active Sessions:</span>
                <div style={{ fontWeight: 700 }}>{volunteerSessions.length} Live</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Campaign Docs:</span>
                <div style={{ fontWeight: 700 }}>{campaigns.length} Documents</div>
              </div>
            </div>
          </div>

          {/* Supabase Box */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Server size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Supabase (PostgreSQL)</h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Statutory Financial & Tax Ledger</div>
                </div>
              </div>
              <span className="badge badge-green">Operational</span>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Houses ACID-compliant 80G tax records, Form 10BD unique serial keys, NGO statutory registration numbers, and financial reconciliations.
            </div>

            <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>80G Receipts:</span>
                <div style={{ fontWeight: 700 }}>{donations.length} Form 10BD Keys</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>RLS Status:</span>
                <div style={{ fontWeight: 700, color: "var(--accent)" }}>Strict RLS Enforced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Compliance Audit Log */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={20} color="var(--primary)" /> Immutable Statutory Audit Trail
            </h3>
            <span className="badge badge-blue">Real-Time Sync</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>Form 10BD Serial Generation Batch 2026-A</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target: CBDT E-Filing Gateway • Trigger: Automated Reconciliation Engine</div>
              </div>
              <span className="badge badge-green">Reconciled</span>
            </div>

            <div style={{ padding: "12px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>DARPAN ID Validity Refresh</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target: NITI Aayog NGO-Darpan Portal API • Result: 100% active standing</div>
              </div>
              <span className="badge badge-green">Verified</span>
            </div>

            <div style={{ padding: "12px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>Telemetry OTP Invalidation Job</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target: Expired volunteer shifts older than 10 minutes • Result: 0 stale OTPs remaining</div>
              </div>
              <span className="badge badge-blue">Clean</span>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
