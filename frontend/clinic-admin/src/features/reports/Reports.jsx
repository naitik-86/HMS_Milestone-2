import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import { revenueData, roleData, apptTrend } from '../../data/reports';

const ACCENT = '#E8630A';
const INDIGO = '#6366F1';
const GREEN  = '#22C55E';
const VIOLET = '#A855F7';
const AMBER  = '#F59E0B';
const BORDER   = '#F0EDE8';
const TEXT_HI  = '#111827';
const TEXT_MID = '#6B7280';
const TEXT_LO  = '#9CA3AF';

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#FFFFFF', border: `1px solid ${BORDER}`,
    borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style,
  }}>
    {children}
  </div>
);

const CardTitle = ({ color = ACCENT, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
    <span style={{ width: 3, height: 18, background: color, borderRadius: 2, flexShrink: 0 }} />
    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: TEXT_HI, margin: 0 }}>
      {children}
    </h3>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 120,
    }}>
      <p style={{ color: TEXT_LO, fontSize: 11, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: TEXT_MID, fontSize: 12 }}>{p.name}</span>
          <span style={{ color: TEXT_HI, fontSize: 13, fontWeight: 700, marginLeft: 'auto', paddingLeft: 12 }}>
            {p.name === 'revenue' || p.name === 'target' ? `₹${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, change, color, icon }) => (
  <Card style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: 11, color: TEXT_LO, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <span style={{ fontSize: 18, width: 36, height: 36, borderRadius: 10, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </span>
    </div>
    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: TEXT_HI, margin: '10px 0 6px' }}>
      {value}
    </div>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: GREEN }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%', background: `${GREEN}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>↑</span>
      {change} vs last period
    </div>
  </Card>
);

export default function Reports() {
  const [dateRange, setDateRange] = useState('monthly');

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalTarget  = revenueData.reduce((s, d) => s + d.target, 0);
  const achievePct   = Math.round((totalRevenue / totalTarget) * 100);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: 28, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: TEXT_HI, margin: 0 }}>
            Reports & Analytics
          </h2>
          <p style={{ color: TEXT_LO, fontSize: 13, marginTop: 4 }}>Clinic performance metrics & insights</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 2, background: '#F7F6F4', borderRadius: 10, padding: 3, border: `1px solid ${BORDER}` }}>
            {['weekly', 'monthly', 'yearly'].map(r => (
              <button key={r} onClick={() => setDateRange(r)} style={{
                background: dateRange === r ? '#FFFFFF' : 'transparent',
                border: 'none',
                boxShadow: dateRange === r ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                color: dateRange === r ? ACCENT : TEXT_LO,
                borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', textTransform: 'capitalize',
                fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.15s',
              }}>{r}</button>
            ))}
          </div>
          <button style={{
            background: `linear-gradient(135deg, ${ACCENT}, #c4500a)`,
            color: '#fff', border: 'none', borderRadius: 10, padding: '8px 18px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: `0 4px 12px ${ACCENT}40`,
          }}>
            <span style={{ fontSize: 13 }}>↓</span> Export
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Revenue"      value="₹6,78,000" change="+22%"  color={ACCENT} icon="💰" />
        <StatCard label="Total Appointments" value="653"        change="+15%"  color={INDIGO} icon="📅" />
        <StatCard label="New Patients"       value="142"        change="+8%"   color={GREEN}  icon="🧑‍⚕️" />
        <StatCard label="Staff Attendance"   value="94.2%"      change="+1.2%" color={VIOLET} icon="✅" />
      </div>

      {/* Row 2: Revenue + Goal + Staff */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.65fr 0.85fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardTitle color={ACCENT}>Revenue vs Target</CardTitle>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={revenueData} barSize={12} barGap={4} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke="#F3F0EB" />
              <XAxis dataKey="month" tick={{ fill: TEXT_MID, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_LO, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F7F6F4' }} />
              <Bar dataKey="revenue" fill={ACCENT}    radius={[5, 5, 0, 0]} name="revenue" />
              <Bar dataKey="target"  fill="#EDE9E3"   radius={[5, 5, 0, 0]} name="target" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
            {[['Revenue', ACCENT], ['Target', '#C9C4BC']].map(([lbl, col]) => (
              <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: TEXT_LO }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: col, display: 'inline-block' }} />
                {lbl}
              </span>
            ))}
          </div>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CardTitle color={AMBER}>Goal</CardTitle>
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <PieChart width={130} height={130}>
              <Pie
                data={[{ value: achievePct }, { value: 100 - achievePct }]}
                cx={60} cy={60} startAngle={90} endAngle={-270}
                innerRadius={44} outerRadius={60} dataKey="value" paddingAngle={0} stroke="none"
              >
                <Cell fill={AMBER} />
                <Cell fill="#F3F0EB" />
              </Pie>
            </PieChart>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: TEXT_HI }}>{achievePct}%</span>
              <span style={{ fontSize: 10, color: TEXT_LO, marginTop: 1 }}>achieved</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: TEXT_LO, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
            ₹{(totalRevenue / 100000).toFixed(1)}L of ₹{(totalTarget / 100000).toFixed(1)}L target
          </p>
        </Card>

        <Card>
          <CardTitle color={INDIGO}>Staff by Role</CardTitle>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={160} height={140}>
              <Pie data={roleData} cx={75} cy={65} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3} stroke="none">
                {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {roleData.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: TEXT_MID }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.color, display: 'inline-block', flexShrink: 0 }} />
                  {r.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Appointment trend */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <CardTitle color={GREEN}>Weekly Appointment Trend</CardTitle>
          <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, background: `${GREEN}12`, padding: '4px 10px', borderRadius: 20 }}>
            ↑ 59% growth over 6 weeks
          </span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={apptTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#F3F0EB" />
            <XAxis dataKey="week" tick={{ fill: TEXT_MID, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT_LO, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: GREEN, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line
              type="monotone" dataKey="appts" name="Appointments"
              stroke={GREEN} strokeWidth={2.5}
              dot={{ fill: '#FFFFFF', stroke: GREEN, strokeWidth: 2, r: 4 }}
              activeDot={{ fill: GREEN, r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

    </div>
  );
}