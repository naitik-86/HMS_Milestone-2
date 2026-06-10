import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { revenueData, roleData, apptTrend } from '../../data/reports';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 8, padding: '8px 14px' }}>
        <p style={{ color: '#9CA3AF', fontSize: 12 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
            {p.name}: {p.name === 'revenue' || p.name === 'target' ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [dateRange, setDateRange] = useState('monthly');

  return (
    <div style={{ padding: 24 }} className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: '#1A1D2E' }}>Reports & Analytics</h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Clinic performance metrics & insights</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['weekly', 'monthly', 'yearly'].map(r => (
            <button key={r} onClick={() => setDateRange(r)} style={{
              background: dateRange === r ? 'rgba(232,99,10,0.15)' : '#FFFFFF',
              border: `1px solid ${dateRange === r ? '#E8630A' : '#EAE5DC'}`,
              color: dateRange === r ? '#E8630A' : '#9CA3AF',
              borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize', fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>{r}</button>
          ))}
          <button style={{ background: 'linear-gradient(135deg,#E8630A,#c4500a)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📥 Export</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Revenue', value: '₹6,78,000', change: '+22%', color: '#E8630A' },
          { label: 'Total Appointments', value: '653', change: '+15%', color: '#6366F1' },
          { label: 'New Patients', value: '142', change: '+8%', color: '#22C55E' },
          { label: 'Staff Attendance', value: '94.2%', change: '+1.2%', color: '#A855F7' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: '#1A1D2E' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#22C55E', marginTop: 6 }}>↑ {c.change} vs last period</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 18, background: '#E8630A', borderRadius: 2 }}></div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Revenue vs Target</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={14} barGap={3}>
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="revenue" fill="#E8630A" radius={[4,4,0,0]} name="revenue" />
              <Bar dataKey="target" fill="#EAE5DC" radius={[4,4,0,0]} name="target" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#E8630A', display: 'inline-block' }}></span>Revenue</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9CA3AF' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#EAE5DC', display: 'inline-block' }}></span>Target</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 18, background: '#6366F1', borderRadius: 2 }}></div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Staff by Role</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={180} height={180}>
              <Pie data={roleData} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
            {roleData.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9CA3AF' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, display: 'inline-block' }}></span>{r.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 14, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 3, height: 18, background: '#22C55E', borderRadius: 2 }}></div>
          <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Weekly Appointment Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={apptTrend}>
            <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="appts" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
