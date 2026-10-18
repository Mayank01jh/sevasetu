"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { FileCheck, Download, Printer, ShieldCheck, ArrowRight, Eye, Calculator } from "lucide-react";

export default function TaxVaultPage() {
  const { donations, setActiveReceipt, currentUser } = useApp();
  const [calcDonation, setCalcDonation] = useState(50000);
  const [taxSlab, setTaxSlab] = useState(0.30); // 30% slab default

  const totalDonated = donations.reduce((acc, d) => acc + d.amount, 0);
  const totalDeduction = totalDonated * 0.5;

  // 80G tax benefit calculation
  const calculatedSavings = calcDonation * 0.5 * taxSlab * 1.04; // including 4% cess

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: "36px" }}>
        <span className="badge badge-green" style={{ marginBottom: "8px" }}>Income Tax Compliance</span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
          Donor 80G Tax Vault & Form 10BD Records
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "800px" }}>
          All contributions processed through SevaSetu automatically qualify for 50% tax deductions under Section 80G(5)(vi) of the Income Tax Act. Download official stamped receipts or sync your PAN for Form 10BD auto-filing.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "36px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL PHILANTHROPIC CONTRIBUTIONS</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
            ₹{totalDonated.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Across {donations.length} verified projects
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700 }}>SECTION 80G ELIGIBLE DEDUCTION</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", marginTop: "4px" }}>
            ₹{totalDeduction.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Qualifying deduction for FY 2024-25 (AY 2025-26)
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>CBDT FORM 10BD STATUS</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={24} /> Transmitted
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Pre-fills automatically in Donor AIS / 26AS
          </div>
        </div>
      </div>

      {/* Tax Calculator & Receipts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "32px", alignItems: "flex-start" }}>
        {/* Left: Receipts Table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Official Stamped Tax Invoices</h3>
            <span className="badge badge-blue">Cryptographically Verified</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {donations.map((d) => (
              <div
                key={d.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--surface-alt)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 800, color: "var(--primary)" }}>{d.bill_id}</span>
                    <span className="badge badge-green" style={{ fontSize: "0.68rem" }}>80G Active</span>
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, marginTop: "4px" }}>{d.campaign_title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Donor: {d.donor_name} • PAN: {d.donor_pan} • {d.timestamp}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>₹{d.amount.toLocaleString("en-IN")}</div>
                  <button
                    onClick={() => setActiveReceipt(d)}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "6px" }}
                  >
                    <Eye size={14} /> View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Section 80G Savings Calculator */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Calculator size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>80G Net Savings Calculator</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Planned Donation Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              value={calcDonation}
              onChange={(e) => setCalcDonation(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Highest Income Tax Slab</label>
            <select
              className="form-select"
              value={taxSlab}
              onChange={(e) => setTaxSlab(Number(e.target.value))}
            >
              <option value={0.30}>30% Slab (Income above ₹15L)</option>
              <option value={0.20}>20% Slab (Income ₹10L - ₹15L)</option>
              <option value={0.10}>10% Slab (Income ₹7L - ₹10L)</option>
              <option value={0.05}>5% Slab (Income ₹3L - ₹7L)</option>
            </select>
          </div>

          <div style={{ background: "var(--primary-light)", padding: "16px", borderRadius: "var(--radius-sm)", marginTop: "20px" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>CALCULATED DIRECT TAX SAVING</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)", margin: "4px 0" }}>
              ₹{Math.round(calculatedSavings).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Includes 50% statutory deduction under Sec 80G(5)(vi) plus applicable 4% Health & Education Cess. Effective cost of donating ₹{calcDonation.toLocaleString("en-IN")} is only <strong>₹{Math.round(calcDonation - calculatedSavings).toLocaleString("en-IN")}</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
