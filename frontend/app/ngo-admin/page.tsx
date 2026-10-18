"use client";

import React, { useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useApp } from "@/lib/store";
import { Building2, Download, CheckCircle2, ShieldCheck, DollarSign, FileSpreadsheet } from "lucide-react";

export default function NgoAdminPage() {
  const { campaigns, donations, currentUser } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Form 10BD CSV generator
  const exportForm10BD = () => {
    const headers = [
      "Sl_No",
      "URN_Registration_Number",
      "Section_Code",
      "Unique_Identification_Number_PAN",
      "ID_Code",
      "Donor_Name",
      "Address",
      "Donation_Type",
      "Mode_of_Receipt",
      "Amount_INR",
      "Bill_ID"
    ];

    const rows = donations.map((d, index) => [
      index + 1,
      "AABTS9943PF20234",
      "Section 80G(5)(vi)",
      d.donor_pan,
      "PAN",
      `"${d.donor_name}"`,
      `"Registered Address on File"`,
      "Corpus / General",
      "Electronic Banking / UPI",
      d.amount,
      d.bill_id
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Form_10BD_Export_FY2024_25_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <RoleGuard allowedRoles={["NGO Admin", "Platform Admin"]} dashboardName="NGO Governance Portal">
      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-blue" style={{ marginBottom: "8px" }}>Statutory Governance</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
            NGO Administrative Governance & Milestone Escrow
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Oversee project fund allocations, report completed field milestones to release escrow tranches, and generate CBDT Form 10BD return filings.
          </p>
        </div>

        {/* Top Action Bar */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", boxShadow: "var(--shadow-sm)", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Statutory Organization</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>{currentUser?.org || "Akshaya Seva Trust"}</div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={exportForm10BD} className="btn btn-primary btn-sm">
              <FileSpreadsheet size={16} /> Export Form 10BD (CBDT Schedule)
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid #bbf7d0", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "24px", fontSize: "0.88rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={18} /> Form 10BD CSV generated and downloaded successfully according to CBDT Rule 18AB specifications.
          </div>
        )}

        {/* Milestone & Escrow Tracking */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>
            Milestone Escrow Tranche Allocations
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {campaigns.map((camp) => (
              <div key={camp.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "20px", background: "var(--surface-alt)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{camp.title}</h4>
                  <span className="badge badge-green">Escrow Managed</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>FUNDS RAISED</div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>₹{camp.raised_amount.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>TARGET GOAL</div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>₹{camp.target_amount.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>REGISTERED DONORS</div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{camp.donor_count}</div>
                  </div>
                </div>

                <div style={{ background: "#fff", padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                    TRANCHE DISBURSEMENT STATUS
                  </div>
                  {camp.milestones.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: idx < camp.milestones.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.85rem" }}>
                      <span>{m.title}</span>
                      <span className={m.completed ? "badge badge-green" : "badge badge-orange"} style={{ fontSize: "0.7rem" }}>
                        {m.completed ? "Verified & Disbursed" : "Pending Field Lead Inspection"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
