"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { X, Heart, ShieldCheck, IndianRupee, FileCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function DonationModal() {
  const { activeDonationCampaign, setActiveDonationCampaign, addDonation, currentUser } = useApp();
  const [amount, setAmount] = useState<number>(5000);
  const [donorName, setDonorName] = useState<string>(currentUser?.name || "Sunita Patel");
  const [donorPan, setDonorPan] = useState<string>("ABCDE1234F");
  const [needTaxReceipt, setNeedTaxReceipt] = useState<boolean>(true);

  if (!activeDonationCampaign) return null;

  const presetAmounts = [1000, 2500, 5000, 10000, 25000];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    addDonation({
      campaignId: activeDonationCampaign.id,
      amount: amount,
      donorName: donorName,
      donorPan: donorPan
    });

    setActiveDonationCampaign(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveDonationCampaign(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/assets/sevasetu-logo.png"
              alt="SevaSetu Logo"
              style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }}
            />
            <div className="modal-title">Support Verified Campaign</div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveDonationCampaign(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary)" }}>{activeDonationCampaign.title}</h4>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Recipient NGO: <strong>{activeDonationCampaign.ngo_name}</strong>
            </div>
          </div>

          <form onSubmit={handleDonate}>
            <div className="form-group">
              <label className="form-label">Select Contribution Amount (INR)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "8px" }}>
                {presetAmounts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className="btn btn-sm"
                    style={{
                      background: amount === p ? "var(--primary)" : "var(--surface-alt)",
                      color: amount === p ? "#fff" : "var(--text-main)",
                      border: "1px solid var(--border)",
                      fontWeight: 700
                    }}
                  >
                    ₹{p.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "10px", fontWeight: 700, color: "var(--text-muted)" }}>₹</span>
                <input
                  type="number"
                  min="100"
                  required
                  className="form-input"
                  style={{ paddingLeft: "30px" }}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            {/* 80G Tax Calculation Badge */}
            <div style={{ background: "var(--accent-light)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid #c8e6c9", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem" }}>
                <ShieldCheck size={18} /> Section 80G Tax Exemption (50% Deduction)
              </div>
              <div style={{ fontSize: "0.82rem", color: "#1b5e20", marginTop: "4px" }}>
                Eligible tax deduction on this donation: <strong>₹{(amount * 0.5).toLocaleString("en-IN")}</strong>. An instant signed Bill ID receipt and Form 10BD income tax reference will be issued upon transaction.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Donor Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Donor Permanent Account Number (PAN)</label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="e.g. ABCDE1234F"
                className="form-input"
                style={{ textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}
                value={donorPan}
                onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
              />
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Required under Rule 18AB for CBDT Form 10BD statutory reporting.
              </span>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: "100%", padding: "12px", marginTop: "12px" }}>
              Complete Contribution of ₹{amount.toLocaleString("en-IN")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
