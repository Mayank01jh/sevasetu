"use client";

import React, { useState } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useApp } from "@/lib/store";
import { Clock, Plus, CheckCircle, Award, Users, RefreshCw } from "lucide-react";

export default function FieldLeadPage() {
  const { volunteerSessions, generateSessionCode, approveVolunteerHours, campaigns } = useApp();
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || "");
  const [sessionTitle, setSessionTitle] = useState("");
  const [lastGenerated, setLastGenerated] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const title = sessionTitle || "Field Relief Mobilization Shift";
    const session = generateSessionCode(selectedCampaignId, title);
    setLastGenerated(session);
    setSessionTitle("");
  };

  return (
    <RoleGuard allowedRoles={["Field Lead", "Platform Admin"]} dashboardName="Field Lead Operations Console">
      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-orange" style={{ marginBottom: "8px" }}>Ground Command</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
            Field Lead Operations & Session Telemetry
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Generate 10-minute expiring session OTP codes to capture on-ground volunteer check-ins and sign off verified service hours.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "32px", alignItems: "flex-start" }}>
          {/* Left: Code Generator */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} color="var(--primary)" /> Generate 10-Min Session OTP
            </h3>

            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label className="form-label">Associate with Active Initiative</label>
                <select
                  className="form-select"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ground Shift Description</label>
                <input
                  type="text"
                  placeholder="e.g. Distribution Camp Sector 4"
                  className="form-input"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
                <Plus size={16} /> Generate Ephemeral Code
              </button>
            </form>

            {/* Newly Generated Code Display */}
            {lastGenerated && (
              <div style={{ marginTop: "24px", padding: "20px", background: "var(--primary-light)", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid #bfdbfe" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>
                  Active On-Ground Session Code
                </div>
                <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "3px", color: "var(--primary)", margin: "8px 0" }}>
                  {lastGenerated.session_code}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Broadcast this code to volunteers present at your physical checkpoint. Code expires in 10 minutes.
                </div>
              </div>
            )}
          </div>

          {/* Right: Active Sessions & Volunteer Sign-off */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={20} color="var(--accent)" /> Live Attendance Roster & Sign-Off
            </h3>

            {volunteerSessions.map((s) => (
              <div key={s.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "16px", background: "var(--surface-alt)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{s.title}</h4>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Code: <code style={{ fontWeight: 700, color: "var(--primary)" }}>{s.session_code}</code> • Lead: {s.field_lead}
                    </div>
                  </div>
                  <span className="badge badge-green">Live</span>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                    CHECKED IN VOLUNTEERS ({s.volunteers_checked_in.length})
                  </div>

                  {s.volunteers_checked_in.length === 0 ? (
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No volunteers checked in yet. Share the code with your on-site team.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {s.volunteers_checked_in.map((v, i) => (
                        <div key={i} style={{ background: "#fff", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{v.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Arrival: {v.checked_in_at} • Status: <strong style={{ color: v.status === "Signed Off" ? "var(--accent)" : "var(--warning)" }}>{v.status}</strong>
                            </div>
                          </div>

                          {v.status !== "Signed Off" ? (
                            <button
                              onClick={() => approveVolunteerHours(s.id, v.name, 4.5)}
                              className="btn btn-secondary btn-sm"
                            >
                              <Award size={14} /> Approve 4.5h & Issue Cert
                            </button>
                          ) : (
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle size={14} /> Hours Certified
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
