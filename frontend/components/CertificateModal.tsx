"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { X, Award, Printer, CheckCircle, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function CertificateModal() {
  const { activeCertificate, setActiveCertificate } = useApp();
  const [certKey, setCertKey] = useState(0);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    if (activeCertificate) {
      setGenerating(true);
      const timer = setTimeout(() => {
        setGenerating(false);
        try {
          confetti({
            particleCount: 70,
            spread: 65,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [activeCertificate, certKey]);

  if (!activeCertificate) return null;

  const handleReplay = () => {
    setCertKey(prev => prev + 1);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
      <div className="modal-card" style={{ maxWidth: "660px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={20} color="var(--primary)" />
            <div className="modal-title">Verified Volunteer Certificate</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleReplay}
              title="Replay Certificate Generation"
              className="btn btn-sm btn-outline"
              style={{ padding: "4px 8px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <RotateCcw size={12} /> Regenerate
            </button>
            <button className="modal-close-btn" onClick={() => setActiveCertificate(null)}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ background: "#f8fafc", padding: "24px" }}>
          {generating ? (
            /* Phase 1: Generation Loader */
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                border: "4px solid var(--primary-light)",
                borderTopColor: "var(--primary)",
                margin: "0 auto 20px",
                animation: "spin 0.8s linear infinite"
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)", marginBottom: "6px" }}>
                Generating Verified Service Certificate...
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Cryptographically sealing OTP session telemetry & hours sign-off
              </p>
            </div>
          ) : (
            /* Phase 2: Unrolling 3D Certificate */
            <div key={certKey} className="certificate-animated-card">
              <div style={{
                background: "#ffffff",
                border: "8px double #cbd5e1",
                padding: "36px 28px",
                textAlign: "center",
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 16px 36px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Background Watermark Stamp */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0.04,
                  pointerEvents: "none"
                }}>
                  <img
                    src="/assets/sevasetu-logo.png"
                    alt="watermark"
                    style={{ width: "320px", height: "320px", objectFit: "contain" }}
                  />
                </div>

                {/* Top Brand Logo */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <img
                    src="/assets/sevasetu-logo.png"
                    alt="SevaSetu Seal"
                    style={{ width: "54px", height: "54px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 4px 10px rgba(15, 76, 129, 0.2)" }}
                  />
                </div>

                <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "2.5px", color: "var(--primary)", fontWeight: 800 }}>
                  SEVASETU VERIFIED IMPACT NETWORK
                </div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "10px 0 6px", color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                  Certificate of Community Service
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  This official document certifies that
                </p>

                {/* Volunteer Name Line */}
                <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--primary)", margin: "12px 0 10px", borderBottom: "2px solid var(--secondary)", display: "inline-block", padding: "0 24px 4px" }}>
                  {activeCertificate.volunteer_name}
                </div>

                <p style={{ fontSize: "0.92rem", color: "var(--text-main)", maxWidth: "480px", margin: "0 auto 20px", lineHeight: 1.6 }}>
                  has successfully completed <strong>{activeCertificate.hours} hours</strong> of verified ground service for the initiative <br />
                  <em style={{ color: "var(--primary)", fontWeight: 600 }}>&ldquo;{activeCertificate.event}&rdquo;</em>.
                </p>

                {/* Animated Gold Seal & Signature Footer */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "12px", marginTop: "28px", borderTop: "1px solid var(--border)", paddingTop: "18px", alignItems: "center", textAlign: "left", fontSize: "0.8rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{activeCertificate.issued_by}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Field Operations Lead</div>

                    {/* Animated SVG Signature */}
                    <div style={{ marginTop: "4px" }}>
                      <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
                        <path
                          className="signature-svg-line"
                          d="M10 24 Q 25 5, 40 20 T 70 12 T 95 22 T 115 14"
                          stroke="#0f4c81"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Golden Dropped Seal */}
                  <div style={{ textAlign: "center" }}>
                    <div className="cert-gold-emblem" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
                        boxShadow: "0 4px 12px rgba(217, 119, 6, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        border: "2px solid #fef3c7"
                      }}>
                        <ShieldCheck size={26} />
                      </div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#b45309", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        GOLD SEAL
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "var(--primary)" }}>{activeCertificate.certificate_id}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Issued: {activeCertificate.date}</div>
                    <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.7rem", marginTop: "4px" }}>
                      ✓ Telemetry Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
