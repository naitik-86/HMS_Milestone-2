import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'staff', label: 'Staff Enrollment', icon: '👥' },
  { id: 'doctors', label: 'Doctor Details', icon: '🩺' },
  { id: 'lab', label: 'Lab Technician', icon: '🔬' },
  { id: 'groomer', label: 'Groomer', icon: '✂️' },
  { id: 'kennel', label: 'Kennel Staff', icon: '🐾' },
  { id: 'settings', label: 'Clinic Settings', icon: '⚙️' },
  { id: 'reports', label: 'Reports', icon: '📊' },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div style={{ width: 260, minWidth: 260, background: '#13151F', borderRight: '1px solid #2A2E45', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #2A2E45' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: '#E8630A' }}>Clinic</span>
          <span style={{ color: '#E2E8F0' }}>Admin</span>
        </div>
        <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2, letterSpacing: '0.05em' }}>Veterinary Management System</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '11px 14px', borderRadius: 10,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontSize: 14, fontWeight: activePage === item.id ? 600 : 400,
              marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif',
              background: activePage === item.id ? 'rgba(232,99,10,0.18)' : 'transparent',
              color: activePage === item.id ? '#E8630A' : '#9CA3AF',
              borderLeft: activePage === item.id ? '3px solid #E8630A' : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2E45', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#E8630A,#c4500a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>CA</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Clinic Admin</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>admin@clinic.com</div>
        </div>
      </div>
    </div>
  );
}
