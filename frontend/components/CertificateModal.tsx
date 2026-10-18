"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { X, Award, Printer, CheckCircle } from "lucide-react";

export default function CertificateModal() {
  const { activeCertificate, setActiveCertificate } = useApp();

  if (!activeCertificate) return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
      <div className="modal-card" style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={20} color="var(--primary)" />
            <div className="modal-title">Verified Volunteer Certificate</div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveCertificate(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Certificate Design */}
          <div style={{
            background: "#fff",
            border: "8px double #cbd5e1",
            padding: "36px 24px",
            textAlign: "center",
            borderRadius: "var(--radius-sm)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <img
                src="/assets/sevasetu-logo.png"
                alt="SevaSetu Seal"
                style={{ width: "54px", height: "54px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 4px 10px rgba(15, 76, 129, 0.2)" }}
              />
            </div>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--primary)", fontWeight: 800 }}>
              SEVASETU VERIFIED IMPACT NETWORK
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "12px 0 8px", color: "var(--text-main)" }}>
              Certificate of Community Service
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              This certifies that
            </p>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", margin: "12px 0", borderBottom: "2px solid var(--secondary)", display: "inline-block", padding: "0 20px 4px" }}>
              {activeCertificate.volunteer_name}
            </div>
            <p style={{ fontSize: "0.92rem", color: "var(--text-main)", maxWidth: "480px", margin: "0 auto 20px" }}>
              has successfully completed <strong>{activeCertificate.hours} hours</strong> of verified ground service for the initiative <em>&quot;{activeCertificate.event}&quot;</em>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "16px", fontSize: "0.82rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{activeCertificate.issued_by}</div>
                <div style={{ color: "var(--text-muted)" }}>Field Operations Director</div>
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>ID: {activeCertificate.certificate_id}</div>
                <div style={{ color: "var(--text-muted)" }}>Issued: {activeCertificate.date}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={() => window.print()} className="btn btn-outline" style={{ flex: 1 }}>
              <Printer size={16} /> Print Certificate
            </button>
            <button onClick={() => setActiveCertificate(null)} className="btn btn-primary" style={{ flex: 1 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
