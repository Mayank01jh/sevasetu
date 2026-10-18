"use client";

import React, { useState } from "react";
import { useApp, Campaign } from "@/lib/store";
import { ShieldCheck, Heart, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { campaigns, setActiveDonationCampaign } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Nutrition & Education", "Healthcare", "Clean Water"];

  const filteredCampaigns = selectedCategory === "All"
    ? campaigns
    : campaigns.filter(c => c.category === selectedCategory);

  const totalRaised = campaigns.reduce((acc, c) => acc + c.raised_amount, 0);
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donor_count, 0);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <ShieldCheck size={16} /> Verified Ground Impact Network
            </div>
            <h1 className="hero-title">
              Direct Philanthropy with Verified Ground Truth.
            </h1>
            <p className="hero-sub">
              Empowering donors, volunteers, and certified NGOs across India with automated 80G tax exemptions, real-time milestone allocation, and verifiable attendance telemetry.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="#campaigns" className="btn btn-secondary">
                Explore Active Causes <ArrowRight size={16} />
              </a>
              <a href="/verify" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                Verify 80G Bill ID / Certificate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Stat Ribbon */}
      <div className="container">
        <div className="stat-ribbon">
          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div>
              <div className="stat-val">₹{(totalRaised / 100000).toFixed(2)}L</div>
              <div className="stat-lbl">Direct Impact Mobilized</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="stat-val">100%</div>
              <div className="stat-lbl">80G & Form 10BD Verified</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-val">{totalDonors}</div>
              <div className="stat-lbl">Citizen Donors & Patrons</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fef3c7", color: "#b45309" }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div className="stat-val">Zero</div>
              <div className="stat-lbl">Paper Service Inflation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Campaign Directory */}
      <section id="campaigns" className="container" style={{ marginBottom: "64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: "6px" }}>Transparent Causes</span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 800 }}>Active High-Priority Initiatives</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Funds are held in escrow and released strictly against verified field progress milestones.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm"
                style={{
                  background: selectedCategory === cat ? "var(--primary)" : "var(--surface)",
                  color: selectedCategory === cat ? "#fff" : "var(--text-main)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-full)"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="cards-grid">
          {filteredCampaigns.map((camp) => {
            const pct = Math.min(100, Math.round((camp.raised_amount / camp.target_amount) * 100));
            return (
              <div key={camp.id} className="campaign-card">
                <div className="card-header-badge">
                  <span className="badge badge-blue">{camp.category}</span>
                  <span className="badge badge-green">80G Eligible</span>
                </div>

                <div className="card-body">
                  <h3 className="campaign-title">{camp.title}</h3>
                  <div className="campaign-ngo">
                    <ShieldCheck size={16} color="var(--primary)" /> {camp.ngo_name}
                  </div>
                  <p className="campaign-desc">{camp.description}</p>

                  {/* Progress */}
                  <div className="progress-wrap">
                    <div className="progress-header">
                      <span>₹{camp.raised_amount.toLocaleString("en-IN")} raised</span>
                      <span style={{ color: "var(--primary)" }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      <span>Target: ₹{camp.target_amount.toLocaleString("en-IN")}</span>
                      <span>{camp.donor_count} Donors</span>
                    </div>
                  </div>

                  {/* Milestones Breakdown */}
                  <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Statutory Milestone Escrow
                    </div>
                    {camp.milestones.map((m, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={14} color={m.completed ? "var(--accent)" : "var(--text-muted)"} />
                          <span style={{ textDecoration: m.completed ? "none" : "none", color: m.completed ? "var(--text-main)" : "var(--text-muted)" }}>
                            {m.title}
                          </span>
                        </span>
                        <span style={{ fontWeight: 600, color: m.completed ? "var(--accent)" : "var(--text-muted)" }}>
                          {m.completed ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>TAX EXEMPTION</div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent)" }}>50% 80G Rebate</div>
                    </div>
                    <button
                      onClick={() => setActiveDonationCampaign(camp)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Heart size={14} /> Contribute
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
