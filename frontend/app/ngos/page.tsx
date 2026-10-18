"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, FileText, Search, ExternalLink, Award } from "lucide-react";

export default function NgoDirectoryPage() {
  const [search, setSearch] = useState("");

  const ngos = [
    {
      id: "ngo-101",
      name: "Akshaya Seva Trust",
      darpan_id: "MH/2018/0192842",
      pan: "AAATA4412K",
      reg_12a: "CIT(E)/MUM/12A/2019-20/1029",
      reg_80g: "CIT(E)/MUM/80G/2021-22/8821",
      city: "Pune & Mumbai, Maharashtra",
      focus: "Child Nutrition, Rural Literacy & Women Self-Help Groups",
      transparency_score: 98,
      verified_since: "2019",
      audited_fy: "FY 2024-25"
    },
    {
      id: "ngo-102",
      name: "Arogya Seva Foundation",
      darpan_id: "UK/2016/0091823",
      pan: "BBBTB9912L",
      reg_12a: "CIT(E)/DEL/12A/2017-18/4431",
      reg_80g: "CIT(E)/DEL/80G/2020-21/1190",
      city: "Dehradun & Chamoli, Uttarakhand",
      focus: "High-Altitude Tele-Medicine, Mobile Diagnostic Vans & Emergency Relief",
      transparency_score: 96,
      verified_since: "2017",
      audited_fy: "FY 2024-25"
    },
    {
      id: "ngo-103",
      name: "Jal Jeevan Sahayog",
      darpan_id: "OD/2020/0231940",
      pan: "CCCTC1182M",
      reg_12a: "CIT(E)/KOL/12A/2021-22/7712",
      reg_80g: "CIT(E)/KOL/80G/2022-23/3391",
      city: "Puri & Balasore, Odisha",
      focus: "Groundwater Arsenic Remediation & School RO Filtration Plants",
      transparency_score: 95,
      verified_since: "2020",
      audited_fy: "FY 2024-25"
    }
  ];

  const filteredNgos = ngos.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.darpan_id.toLowerCase().includes(search.toLowerCase()) ||
    n.focus.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="badge badge-blue" style={{ marginBottom: "8px" }}>Statutory Governance</span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
          Verified Non-Governmental Organizations (NGOs)
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "800px" }}>
          Every organization on SevaSetu undergoes 4-tier statutory vetting: NITI Aayog DARPAN verification, Income Tax Section 12A/80G validation, MCA filings check, and mandatory annual audit filings.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: "relative", maxWidth: "480px", marginBottom: "32px" }}>
        <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search by NGO name, DARPAN ID, or cause..."
          className="form-input"
          style={{ paddingLeft: "42px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* NGO Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
        {filteredNgos.map((ngo) => (
          <div key={ngo.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>{ngo.name}</h3>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>{ngo.city}</div>
              </div>
              <div style={{ background: "var(--accent-light)", color: "var(--accent)", padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} /> {ngo.transparency_score}% Score
              </div>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px", flex: 1 }}>
              {ngo.focus}
            </p>

            {/* Statutory Details Box */}
            <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>DARPAN ID:</span>
                <div style={{ fontWeight: 600 }}>{ngo.darpan_id}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>PAN:</span>
                <div style={{ fontWeight: 600, fontFamily: "monospace" }}>{ngo.pan}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>12A ORDER:</span>
                <div style={{ fontWeight: 600, fontSize: "0.72rem" }}>{ngo.reg_12a}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>80G URN:</span>
                <div style={{ fontWeight: 600, fontSize: "0.72rem" }}>{ngo.reg_80g}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-muted)" }}>
                Audited: <strong>{ngo.audited_fy}</strong>
              </span>
              <a href="/" className="btn btn-primary btn-sm">
                View Causes
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
