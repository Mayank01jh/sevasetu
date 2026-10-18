"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { X, Printer, ShieldCheck, CheckCircle2, Download, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export default function ReceiptModal() {
  const { activeReceipt, setActiveReceipt } = useApp();
  const [printKey, setPrintKey] = useState(0);

  useEffect(() => {
    if (activeReceipt) {
      // Trigger subtle celebration confetti as receipt finishes dispensing
      const timer = setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeReceipt, printKey]);

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleReplay = () => {
    setPrintKey(prev => prev + 1);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
      <div className="modal-card" style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
        {/* Printer Head Slit Bar */}
        <div className="printer-slot-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="printer-led"></div>
            <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontFamily: "monospace", letterSpacing: "1px", fontWeight: 700 }}>
              SEVASETU THERMAL SLIP PRINTER • MODEL 80G-SEC5
            </span>
          </div>
          <button
            onClick={handleReplay}
            title="Replay Slip Printing Animation"
            style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 700 }}
          >
            <RotateCcw size={12} /> Re-Print Slip
          </button>
        </div>

        <div className="modal-header" style={{ borderTop: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={20} color="var(--accent)" />
            <div className="modal-title">Official Section 80G Tax Slip</div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveReceipt(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ background: "#f8fafc", padding: "20px" }}>
          {/* Animated Printer Feed Slip Container */}
          <div key={printKey} className="printer-feed-container">
            {/* Moving Laser Scan Line */}
            <div className="printer-laser-line"></div>

            {/* The Actual Printed Slip */}
            <div className="receipt-slip-animated" style={{ borderRadius: "0 0 12px 12px", padding: "24px", background: "#ffffff" }}>
              {/* Slip Top Header with Logo */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px dashed var(--border)", paddingBottom: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src="/assets/sevasetu-logo.png"
                    alt="SevaSetu Seal"
                    style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
                  />
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary)" }}>SevaSetu Philanthropy Trust</h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Registration No: CIT(EXEMPTION)/DELHI/80G/2023-24/A/10043
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Unique Registration Number (URN): AABTS9943PF20234
                    </div>
                  </div>
                </div>

                {/* Stamped Emerald Seal */}
                <div style={{ textAlign: "right" }}>
                  <div className="verified-stamp-seal">
                    ✓ 80G VERIFIED
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, marginTop: "6px", color: "var(--primary)" }}>
                    {activeReceipt.bill_id}
                  </div>
                </div>
              </div>

              {/* Donor & Project Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem", marginBottom: "20px" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>DONOR NAME</div>
                  <div style={{ fontWeight: 700 }}>{activeReceipt.donor_name}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>DONOR PAN (CBDT RULE 18AB)</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace" }}>{activeReceipt.donor_pan}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>DATE & TIMESTAMP</div>
                  <div style={{ fontWeight: 600 }}>{activeReceipt.timestamp}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>ALLOCATED CAUSE</div>
                  <div style={{ fontWeight: 600 }}>{activeReceipt.campaign_title}</div>
                </div>
              </div>

              {/* Financial Box */}
              <div style={{ background: "var(--primary-light)", padding: "16px", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 700 }}>TOTAL AMOUNT RECEIVED</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary)" }}>
                    ₹{activeReceipt.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700 }}>ELIGIBLE 80G DEDUCTION (50%)</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>
                    ₹{(activeReceipt.amount * 0.5).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5, borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                * This slip is generated by the SevaSetu statutory engine under Section 80G(5)(vi) of the Income Tax Act, 1961. This transaction is queued for direct e-filing in Form 10BD with the Central Board of Direct Taxes (CBDT) for automatic deduction pre-fill on the donor&apos;s AIS.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handlePrint} className="btn btn-outline" style={{ flex: 1 }}>
              <Printer size={16} /> Print Official Receipt
            </button>
            <button onClick={() => setActiveReceipt(null)} className="btn btn-primary" style={{ flex: 1 }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
