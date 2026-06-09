import React, { useState, useEffect } from "react";
import { getDoctors } from "../services/doctorService";

// ─── Static Data ───────────────────────────────────────────────
const doctors = [
  {
    id: "DOC001",
    name: "Dr. Priya Sharma",
    initials: "DP",
    color: "#6366F1",
    specialization: "Small Animals",
    experience: 8,
    regNo: "VCI/MH/2016/4521",
    state: "Maharashtra",
    fees: 500,
    status: "Active",
    emergency: true,
    degrees: [
      { degree: "BVSc & AH", year: "2016" },
      { degree: "MVSc", year: "2018" },
    ],
    specializations: ["Small Animals", "Exotic"],
    avgDuration: 20,
    languages: ["English", "Hindi", "Marathi"],
    certValidity: "2026-12-31",
    reminderDays: 30,
    phone: "+91 98201 11234",
    email: "priya.sharma@vetclinic.com",
  },
  {
    id: "DOC002",
    name: "Dr. Arjun Nair",
    initials: "AN",
    color: "#06B6D4",
    specialization: "Surgery",
    experience: 12,
    regNo: "VCI/KL/2012/7834",
    state: "Kerala",
    fees: 800,
    status: "Active",
    emergency: true,
    degrees: [
      { degree: "BVSc", year: "2012" },
      { degree: "MVSc", year: "2014" },
    ],
    specializations: ["Surgery", "Oncology"],
    avgDuration: 30,
    languages: ["English", "Malayalam", "Hindi"],
    certValidity: "2027-06-30",
    reminderDays: 45,
    phone: "+91 94470 22345",
    email: "arjun.nair@vetclinic.com",
  },
  {
    id: "DOC003",
    name: "Dr. Kavitha Rao",
    initials: "KR",
    color: "#EC4899",
    specialization: "Dermatology",
    experience: 6,
    regNo: "VCI/KA/2018/2341",
    state: "Karnataka",
    fees: 600,
    status: "Active",
    emergency: false,
    degrees: [{ degree: "BVSc & AH", year: "2018" }],
    specializations: ["Dermatology", "Small Animals"],
    avgDuration: 25,
    languages: ["English", "Kannada", "Hindi"],
    certValidity: "2025-03-31",
    reminderDays: 30,
    phone: "+91 80123 33456",
    email: "kavitha.rao@vetclinic.com",
  },
  {
    id: "DOC004",
    name: "Dr. Sanjay Patel",
    initials: "SP",
    color: "#F97316",
    specialization: "Oncology",
    experience: 15,
    regNo: "VCI/GJ/2009/9012",
    state: "Gujarat",
    fees: 1000,
    status: "Active",
    emergency: false,
    degrees: [
      { degree: "BVSc", year: "2009" },
      { degree: "MVSc", year: "2011" },
      { degree: "PhD (Vet)", year: "2015" },
    ],
    specializations: ["Oncology", "Surgery", "Avian"],
    avgDuration: 40,
    languages: ["English", "Hindi", "Gujarati"],
    certValidity: "2028-09-30",
    reminderDays: 60,
    phone: "+91 79456 44567",
    email: "sanjay.patel@vetclinic.com",
  },
];

const states = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Kerala",
  "West Bengal",
  "Telangana",
  "Uttar Pradesh",
];
const specializations = [
  "Small Animals",
  "Large Animals",
  "Exotic",
  "Avian",
  "Surgery",
  "Dermatology",
  "Oncology",
  "Ophthalmology",
  "Other",
];
const degreeTypes = ["BVSc", "BVSc & AH", "MVSc", "PhD (Vet)", "Diploma"];
const languages = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Kannada",
  "Telugu",
  "Bengali",
  "Gujarati",
];

const STEPS = [
  { id: 1, label: "Qualifications", sub: "Degrees, specialization" },
  { id: 2, label: "Vet Council Reg.", sub: "Reg no, certificate" },
  { id: 3, label: "Practice Settings", sub: "Fees, emergency, docs" },
];

// ─── Shared Styles ─────────────────────────────────────────────
const inputBase = {
  width: "100%",
  boxSizing: "border-box",
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: "11px 14px",
  fontSize: 14,
  color: "#111827",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  outline: "none",
};
const lbl = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#6B7280",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
};
const sectionHead = {
  fontSize: 11,
  fontWeight: 700,
  color: "#9CA3AF",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 16,
};
const btnPrimary = {
  background: "linear-gradient(135deg,#E8630A,#c4500a)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "11px 24px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 6,
};
const btnGhost = {
  background: "transparent",
  color: "#6B7280",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  padding: "11px 24px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "Plus Jakarta Sans, sans-serif",
};

// ─── View Profile Full-Screen ──────────────────────────────────
function ViewProfile({ doctor: d, onClose }) {
  const validityDate = new Date(d.certValidity);
  const today = new Date();
  const daysLeft = Math.ceil((validityDate - today) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= d.reminderDays;
}


function StatBox({ label, value, color }) {
  return (
    <div
      style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px" }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#9CA3AF",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color,
          fontFamily: "Syne, sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}


// ─── Modal Overlay ─────────────────────────────────────────────
function ModalOverlay({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F3F4F6",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onClose}
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              color: "#6B7280",
            }}
          >
            ←
          </button>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Doctor Profile
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Full details for {d.name}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9CA3AF",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Scrollable Body */}
      <div style={{ flex: 1, overflowY: "auto", background: "#F9FAFB" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Hero Card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: `${d.color}18`,
                border: `3px solid ${d.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: d.color,
                flexShrink: 0,
              }}
            >
              {d.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#111827",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {d.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "rgba(34,197,94,0.12)",
                    color: "#22C55E",
                  }}
                >
                  {d.status}
                </span>
                {d.emergency && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "rgba(239,68,68,0.1)",
                      color: "#EF4444",
                    }}
                  >
                    🚨 Emergency
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                {d.id} · {d.specializations.join(", ")}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 13, color: "#374151" }}>
                  📱 {d.phone}
                </span>
                <span style={{ fontSize: 13, color: "#374151" }}>
                  ✉️ {d.email}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#E8630A",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                ₹{d.fees}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                per consultation
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                {d.avgDuration} min avg
              </div>
            </div>
          </div>

          {/* Two-column grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            {/* Qualifications */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 24px",
              }}
            >
              <p style={sectionHead}>Qualifications</p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {d.degrees.map((deg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: "#F9FAFB",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${d.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      🎓
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {deg.degree}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                        Passed {deg.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Experience
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#111827",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {d.experience}{" "}
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}
                  >
                    years
                  </span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 24px",
              }}
            >
              <p style={sectionHead}>Specializations</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {d.specializations.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "7px 14px",
                      background: `${d.color}12`,
                      border: `1px solid ${d.color}30`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: d.color,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  Prescription Languages
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {d.languages.map((l) => (
                    <span
                      key={l}
                      style={{
                        padding: "5px 12px",
                        background: "#F3F4F6",
                        borderRadius: 6,
                        fontSize: 12,
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vet Council Registration */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 24px",
              }}
            >
              <p style={sectionHead}>Vet Council Registration</p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <InfoRow icon="🪪" label="Registration No." value={d.regNo} />
                <InfoRow icon="📍" label="State Vet Council" value={d.state} />
                <div
                  style={{
                    padding: "12px 14px",
                    background: isExpiringSoon
                      ? "rgba(239,68,68,0.06)"
                      : "rgba(34,197,94,0.06)",
                    border: `1px solid ${isExpiringSoon ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 4,
                    }}
                  >
                    Certificate Validity
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isExpiringSoon ? "#EF4444" : "#22C55E",
                    }}
                  >
                    {validityDate.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isExpiringSoon ? "#EF4444" : "#6B7280",
                      marginTop: 3,
                    }}
                  >
                    {daysLeft > 0 ? `${daysLeft} days remaining` : "Expired"} ·
                    Reminder {d.reminderDays} days before
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Settings */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "22px 24px",
              }}
            >
              <p style={sectionHead}>Practice Settings</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <StatBox
                  label="Consultation Fee"
                  value={`₹${d.fees}`}
                  color="#E8630A"
                />
                <StatBox
                  label="Avg Duration"
                  value={`${d.avgDuration} min`}
                  color="#6366F1"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: d.emergency ? "rgba(34,197,94,0.06)" : "#F9FAFB",
                  border: `1px solid ${d.emergency ? "rgba(34,197,94,0.2)" : "#E5E7EB"}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                  >
                    Emergency Availability
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                    Outside regular hours
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: d.emergency ? "#22C55E" : "#9CA3AF",
                  }}
                >
                  {d.emergency ? "✓ Available" : "✗ Not Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F3F4F6",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button onClick={onClose} style={btnGhost}>
          ← Back to List
        </button>
        <button style={btnPrimary}>✏️ Edit Details</button>
      </div>
    </div>
  );
}

// ─── Horizontal Step Bar ───────────────────────────────────────
function HorizontalStepBar({ steps, currentStep, onStepClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            marginTop: 1,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ─── Add Doctor Form Steps ─────────────────────────────────────
function StepQualifications({
  degrees,
  setDegrees,
  selectedSpecs,
  setSelectedSpecs,
  formData,
  update,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p style={sectionHead}>Degrees & Certificates</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {degrees.map((d, i) => (
            <div
              key={i}
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                >
                  Degree {i + 1}
                </span>
                {i > 0 && (
                  <button
                    onClick={() =>
                      setDegrees(degrees.filter((_, j) => j !== i))
                    }
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#EF4444",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 6,
                      padding: "4px 12px",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={lbl}>Degree Name</label>
                  <select
                    style={inputBase}
                    value={d.degree}
                    onChange={(e) =>
                      setDegrees(
                        degrees.map((deg, j) =>
                          j === i ? { ...deg, degree: e.target.value } : deg,
                        ),
                      )
                    }
                  >
                    <option value="">Select degree</option>
                    {degreeTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Degree Certificate (img / pdf)</label>
                  <input
                    style={{ ...inputBase, paddingTop: 9, cursor: "pointer" }}
                    type="file"
                    accept=".pdf,image/*"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setDegrees([...degrees, { degree: "", certificate: null }])
          }
          style={{
            marginTop: 10,
            background: "rgba(232,99,10,0.07)",
            border: "1px dashed #E8630A",
            color: "#E8630A",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Another Degree
        </button>
      </div>

      <div>
        <p style={sectionHead}>Specialization</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {specializations.map((s) => {
            const active = selectedSpecs.includes(s);
            return (
              <label
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: active ? "rgba(232,99,10,0.1)" : "#FFFFFF",
                  border: `1px solid ${active ? "#E8630A" : "#E5E7EB"}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  color: active ? "#E8630A" : "#6B7280",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    setSelectedSpecs(
                      active
                        ? selectedSpecs.filter((x) => x !== s)
                        : [...selectedSpecs, s],
                    )
                  }
                  style={{ accentColor: "#E8630A" }}
                />{" "}
                {s}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 320 }}>
        <label style={lbl}>Years of Experience</label>
        <input
          style={inputBase}
          type="number"
          placeholder="e.g. 8"
          value={formData.experience}
          onChange={(e) => update("experience", e.target.value)}
        />
      </div>
    </div>
  );
}

function StepVetCouncil({ formData, update }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p style={sectionHead}>Vet Council Registration</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label style={lbl}>Registration Number *</label>
            <input
              style={inputBase}
              placeholder="e.g. VCI/MH/2020/1234"
              value={formData.regNumber}
              onChange={(e) => update("regNumber", e.target.value)}
            />
          </div>
          <div>
            <label style={lbl}>State Vet Council *</label>
            <select
              style={inputBase}
              value={formData.state}
              onChange={(e) => update("state", e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <p style={sectionHead}>Certificate</p>
        <label
          style={{
            display: "block",
            border: "2px dashed #E5E7EB",
            borderRadius: 12,
            padding: "32px",
            textAlign: "center",
            cursor: "pointer",
            background: "#FAFAFA",
          }}
        >
          <input type="file" accept=".pdf" style={{ display: "none" }} />
          <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 4,
            }}
          >
            Click to upload certificate
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>or drag and drop</div>
          <div
            style={{
              fontSize: 11,
              color: "#D1D5DB",
              marginTop: 8,
              background: "#F3F4F6",
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            PDF up to 10MB
          </div>
        </label>
      </div>
      <div>
        <p style={sectionHead}>Validity & Reminders</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label style={lbl}>Certificate Validity Date</label>
            <input
              style={inputBase}
              type="date"
              value={formData.certValidity}
              onChange={(e) => update("certValidity", e.target.value)}
            />
          </div>
          <div>
            <label style={lbl}>Renewal Reminder (days before expiry)</label>
            <input
              style={inputBase}
              type="number"
              value={formData.reminderDays}
              onChange={(e) => update("reminderDays", e.target.value)}
            />
            <span
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                marginTop: 4,
                display: "block",
              }}
            >
              Default: 30 days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPractice({ formData, update, selectedLangs, setSelectedLangs }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p style={sectionHead}>Consultation</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label style={lbl}>Consultation Fees (₹)</label>
            <input
              style={inputBase}
              type="number"
              placeholder="e.g. 500"
              value={formData.fees}
              onChange={(e) => update("fees", e.target.value)}
            />
          </div>
          <div>
            <label style={lbl}>Avg Consultation Duration (min)</label>
            <input
              style={inputBase}
              type="number"
              value={formData.avgDuration}
              onChange={(e) => update("avgDuration", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <p style={sectionHead}>Emergency Availability</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: "16px 20px",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              Available for Emergency?
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>
              Enable if doctor accepts emergency cases outside regular hours
            </div>
          </div>
          <div
            style={{
              width: 48,
              height: 26,
              background: formData.emergency ? "#22C55E" : "#D1D5DB",
              borderRadius: 13,
              position: "relative",
              cursor: "pointer",
              transition: "background 0.25s",
              flexShrink: 0,
            }}
            onClick={() => update("emergency", !formData.emergency)}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: formData.emergency ? 24 : 3,
                width: 20,
                height: 20,
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                transition: "left 0.25s",
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <p style={sectionHead}>Documents</p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label style={lbl}>Digital Signature (img upload)</label>
            <label
              style={{
                display: "block",
                border: "2px dashed #E5E7EB",
                borderRadius: 10,
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                background: "#FAFAFA",
              }}
            >
              <input type="file" accept="image/*" style={{ display: "none" }} />
              <div style={{ fontSize: 22, marginBottom: 6 }}>✍️</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                Upload signature
              </div>
              <div style={{ fontSize: 11, color: "#D1D5DB", marginTop: 4 }}>
                PNG / JPG
              </div>
            </label>
          </div>
          <div>
            <label style={lbl}>Doctor Letterhead / Stamp</label>
            <label
              style={{
                display: "block",
                border: "2px dashed #E5E7EB",
                borderRadius: 10,
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                background: "#FAFAFA",
              }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: "none" }}
              />
              <div style={{ fontSize: 22, marginBottom: 6 }}>🗂️</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
                Upload letterhead
              </div>
              <div style={{ fontSize: 11, color: "#D1D5DB", marginTop: 4 }}>
                PDF / IMG
              </div>
            </label>
          </div>
        </div>
      </div>
      <div>
        <p style={sectionHead}>Prescription Language</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {languages.map((l) => {
            const active = selectedLangs.includes(l);
            return (
              <label
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: active ? "rgba(232,99,10,0.1)" : "#FFFFFF",
                  border: `1px solid ${active ? "#E8630A" : "#E5E7EB"}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  color: active ? "#E8630A" : "#6B7280",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    setSelectedLangs(
                      active
                        ? selectedLangs.filter((x) => x !== l)
                        : [...selectedLangs, l],
                    )
                  }
                  style={{ accentColor: "#E8630A" }}
                />{" "}
                {l}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Doctor Modal ───────────────────────────────────
function DoctorForm({ onClose, initialData }) {
  const [step, setStep] = useState(1);
  const [degrees, setDegrees] = useState([{ degree: "", certificate: null }]);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [formData, setFormData] = useState({
    regNumber: "",
    state: "",
    certValidity: "",
    reminderDays: 30,
    fees: "",
    avgDuration: 15,
    emergency: false,
    experience: "",
  });
  const update = (k, v) => setFormData((p) => ({ ...p, [k]: v }));
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F3F4F6",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onClose}
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              color: "#6B7280",
            }}
          >
            ←
          </button>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Add Doctor Details
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Fill all 3 steps to complete doctor profile
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          <span>
            Step {step} of {STEPS.length}
          </span>
          <span style={{ color: "#E8630A", fontWeight: 600 }}>
            — {STEPS[step - 1].label}
          </span>
          <button
            onClick={onClose}
            style={{
              marginLeft: 16,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              fontSize: 20,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 240,
            background: "#FFFFFF",
            borderRight: "1px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
            padding: "28px 20px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {STEPS.map((s) => {
              const done = step > s.id,
                active = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: active ? "rgba(232,99,10,0.08)" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      background: done
                        ? "#E8630A"
                        : active
                          ? "#E8630A"
                          : "#E5E7EB",
                      color: done || active ? "#FFFFFF" : "#9CA3AF",
                    }}
                  >
                    {done ? "✓" : s.id}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: active ? 700 : 500,
                        color: active
                          ? "#E8630A"
                          : done
                            ? "#374151"
                            : "#9CA3AF",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}
                    >
                      {s.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9CA3AF",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Progress
            </div>
            <div
              style={{
                background: "#E5E7EB",
                borderRadius: 4,
                height: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#E8630A,#F97316)",
                  borderRadius: 4,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
              {Math.round(progressPct)}% complete
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "36px 48px",
            background: "#FFFFFF",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(232,99,10,0.08)",
                border: "1px solid rgba(232,99,10,0.2)",
                borderRadius: 20,
                padding: "4px 12px",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#E8630A",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#E8630A" }}>
                {STEPS[step - 1].label}
              </span>
            </div>
            {step === 1 && (
              <StepQualifications
                degrees={degrees}
                setDegrees={setDegrees}
                selectedSpecs={selectedSpecs}
                setSelectedSpecs={setSelectedSpecs}
                formData={formData}
                update={update}
              />
            )}
            {step === 2 && (
              <StepVetCouncil formData={formData} update={update} />
            )}
            {step === 3 && (
              <StepPractice
                formData={formData}
                update={update}
                selectedLangs={selectedLangs}
                setSelectedLangs={setSelectedLangs}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F3F4F6",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{ ...btnGhost, display: "flex", alignItems: "center", gap: 6 }}
        >
          ✕ Cancel
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          {step > 1 && (
            <button onClick={() => setStep((s) => s - 1)} style={btnGhost}>
              ← Back
            </button>
          )}
          <button style={{ ...btnGhost, color: "#374151" }}>Save Draft</button>
          {step < STEPS.length ? (
            <button onClick={() => setStep((s) => s + 1)} style={btnPrimary}>
              Next: {STEPS[step].label} →
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                ...btnPrimary,
                background: "linear-gradient(135deg,#22C55E,#16a34a)",
              }}
            >
              ✓ Save Doctor Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// function StatBox({ label, value, color }) {
//   return (
//     <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
//       <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
//       <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'Syne, sans-serif' }}>{value}</div>
//     </div>
//   );
// }

// ─── Main Page ─────────────────────────────────────────────────
export default function DoctorDetails() {
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);

  useEffect(() => {
    const open = showForm || !!viewDoctor;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm, viewDoctor]);

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Plus Jakarta Sans, sans-serif",
        background: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      {showForm && <DoctorForm onClose={() => setShowForm(false)} />}
      {viewDoctor && (
        <ViewProfile doctor={viewDoctor} onClose={() => setViewDoctor(null)} />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Doctor Details
          </h2>
          <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
            Manage doctor profiles, qualifications & practice settings
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "linear-gradient(135deg,#E8630A,#c4500a)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          + Add Doctor Details
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}
      >
        {doctors.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: `${d.color}18`,
                  border: `2px solid ${d.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: d.color,
                  flexShrink: 0,
                }}
              >
                {d.initials}
              </div>
              <div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}
                >
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{d.id}</div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(34,197,94,0.12)",
                  color: "#22C55E",
                  flexShrink: 0,
                }}
              >
                {d.status}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: "SPECIALIZATION",
                  value: d.specialization,
                  color: "#111827",
                },
                {
                  label: "EXPERIENCE",
                  value: `${d.experience} years`,
                  color: "#111827",
                },
                {
                  label: "CONSULT FEES",
                  value: `₹${d.fees}`,
                  color: "#E8630A",
                },
                {
                  label: "EMERGENCY",
                  value: d.emergency ? "Available" : "Not Available",
                  color: d.emergency ? "#22C55E" : "#EF4444",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#F9FAFB",
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#9CA3AF",
                      marginBottom: 3,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{ fontSize: 12, color: item.color, fontWeight: 600 }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                borderTop: "1px solid #E5E7EB",
                paddingTop: 10,
              }}
            >
              Reg: {d.regNo} · {d.state}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  flex: 1,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#E8630A",
                  borderRadius: 8,
                  padding: "8px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Edit Details
              </button>
              <button
                onClick={() => setViewDoctor(d)}
                style={{
                  flex: 1,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#374151",
                  borderRadius: 8,
                  padding: "8px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
