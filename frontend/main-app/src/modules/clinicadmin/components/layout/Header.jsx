import React, { useState } from 'react';

export default function Header({ title, subtitle }) {
  const [notifications] = useState(3);
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EAE5DC', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1D2E' }}>{title}</h1>
        {subtitle && <p style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff, records..."
            style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', color: '#1A1D2E', borderRadius: 10, padding: '9px 14px 9px 36px', fontSize: 13, width: 240, outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
        </div>
        <button style={{ position: 'relative', background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', fontSize: 16 }}>
          🔔
          {notifications > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#E8630A', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications}</span>
          )}
        </button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#E8630A,#c4500a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>CA</div>
      </div>
    </div>
  );
}
