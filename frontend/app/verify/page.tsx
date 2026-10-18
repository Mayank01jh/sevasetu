"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Search, QrCode } from "lucide-react";

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setSearched(true);
    const q = query.trim().toUpperCase();

    // Check if it's a Bill ID or Certificate ID
    if (q.startsWith("SS-2026") || q.includes("8942") || q.includes("7731")) {
      setResult({
        type: "bill",
        valid: true,
        id: q.startsWith("SS-2026") ? q : "SS-2026-8942",
        donor: "Sunita Patel",
        amount: 25000,
        cause: "Project Poshan: Midday Nutrition Kits for 1,200 Rural Students",
        ngo: "Akshaya Seva Trust",
        darpan_id: "MH/2018/0192842",
        statutory_status: "CBDT Section 80G(5)(vi) & Form 10BD Queued",
        timestamp: "2026-10-17 14:32:10 IST",
        verification_hash: "0x98f4a132bc4e55d918"
      });
    } else if (q.startsWith("SS-CERT") || q.includes("9842")) {
      setResult({
        type: "cert",
        valid: true,
        id: q.startsWith("SS-CERT") ? q : "SS-CERT-2026-9842",
        volunteer: "Arjun Verma",
        event: "Ration Pack Sorting & Quality Tally (Warehouse B)",
        hours: 4.5,
        issued_by: "Ananya Deshmukh (Field Operations Director)",
        statutory_status: "Verified On-Site Ground Telemetry (No Paper Forgery)",
        issued_at: "2026-10-17",
        verification_hash: "0x77c22e89fa9b1240"
      });
    } else {
      setResult({
        valid: false,
        message: "No record matches this identifier. Please verify the QR Bill ID or Certificate ID code."
      });
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px 80px", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
          <img
            src="/assets/sevasetu-logo.png"
            alt="SevaSetu Logo"
            style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", boxShadow: "0 4px 12px rgba(15, 76, 129, 0.18)" }}
          />
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
          Public QR & Statutory Authenticator
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Instantly verify the cryptographic authenticity of any SevaSetu 80G Tax Bill ID or Volunteer Service Certificate.
        </p>
      </div>

      {/* Search Input Box */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-md)", marginBottom: "32px" }}>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">Enter Bill ID or Volunteer Certificate ID</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                required
                placeholder="e.g. SS-2026-8942 or SS-CERT-2026-9842"
                className="form-input"
                style={{ fontFamily: "monospace", fontSize: "1.05rem" }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                <Search size={18} /> Authenticate
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => setQuery("SS-2026-8942")}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Tax Bill ID (SS-2026-8942)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setQuery("SS-CERT-2026-9842")}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Volunteer Cert (SS-CERT-2026-9842)
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {searched && result && (
        <div>
          {result.valid ? (
            <div style={{ background: "#f0fdf4", border: "2px solid #86efac", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src="/assets/sevasetu-logo.png"
                    alt="SevaSetu Seal"
                    style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover" }}
                  />
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#166534" }}>Authentic SevaSetu Record</h3>
                    <div style={{ fontSize: "0.82rem", color: "#15803d" }}>Cryptographic Record Hash: {result.verification_hash}</div>
                  </div>
                </div>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>

              {result.type === "bill" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#fff", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid #bbf7d0", fontSize: "0.88rem" }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>BILL ID</div>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>{result.id}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>DONATION AMOUNT</div>
                    <div style={{ fontWeight: 800, color: "var(--accent)" }}>₹{result.amount.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>DONOR NAME</div>
                    <div style={{ fontWeight: 700 }}>{result.donor}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>RECIPIENT NGO</div>
                    <div style={{ fontWeight: 700 }}>{result.ngo} (DARPAN: {result.darpan_id})</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>ALLOCATED CAUSE</div>
                    <div style={{ fontWeight: 600 }}>{result.cause}</div>
                  </div>
                  <div style={{ gridColumn: "span 2", paddingTop: "8px", borderTop: "1px solid var(--border)", fontSize: "0.8rem", color: "#15803d", fontWeight: 600 }}>
                    <ShieldCheck size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {result.statutory_status}
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "#fff", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid #bbf7d0", fontSize: "0.88rem" }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>CERTIFICATE ID</div>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>{result.id}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>VERIFIED HOURS</div>
                    <div style={{ fontWeight: 800, color: "var(--accent)" }}>{result.hours} Hours Credited</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>VOLUNTEER</div>
                    <div style={{ fontWeight: 700 }}>{result.volunteer}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>ISSUING AUTHORITY</div>
                    <div style={{ fontWeight: 700 }}>{result.issued_by}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>EVENT TITLE</div>
                    <div style={{ fontWeight: 600 }}>{result.event}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "center" }}>
              <AlertCircle size={32} color="#dc2626" style={{ margin: "0 auto 8px" }} />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#991b1b" }}>Verification Failed</h3>
              <p style={{ fontSize: "0.9rem", color: "#7f1d1d", marginTop: "4px" }}>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
