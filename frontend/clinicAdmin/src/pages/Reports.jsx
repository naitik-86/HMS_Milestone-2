import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 85000, target: 90000 },
  { month: 'Feb', revenue: 92000, target: 90000 },
  { month: 'Mar', revenue: 78000, target: 95000 },
  { month: 'Apr', revenue: 105000, target: 95000 },
  { month: 'May', revenue: 98000, target: 100000 },
  { month: 'Jun', revenue: 120000, target: 100000 },
];

const roleData = [
  { name: 'Doctor', value: 9, color: '#6366F1' },
  { name: 'Kennel Staff', value: 6, color: '#F97316' },
  { name: 'Groomer', value: 5, color: '#A855F7' },
  { name: 'Lab Tech', value: 4, color: '#22C55E' },
  { name: 'Receptionist', value: 4, color: '#EC4899' },
];

const apptTrend = [
  { week: 'W1', appts: 142 },
  { week: 'W2', appts: 167 },
  { week: 'W3', appts: 155 },
  { week: 'W4', appts: 189 },
];

const topServices = [
  { name: 'Consultation', count: 312, revenue: 234000, color: '#E8630A' },
  { name: 'Vaccination', count: 198, revenue: 89100, color: '#6366F1' },
  { name: 'Grooming', count: 87, revenue: 52200, color: '#A855F7' },
  { name: 'Lab Tests', count: 56, revenue: 67200, color: '#22C55E' },
];

/* ─── Custom Tooltip ─────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 10, padding: '10px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
          {p.name === 'revenue' || p.name === 'target'
            ? `₹${Number(p.value).toLocaleString('en-IN')}`
            : p.value}{' '}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', textTransform: 'capitalize' }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Stat Card ───────────────────────────────────────────────────── */
function StatCard({ label, value, change, color, icon, positive = true }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: color, borderRadius: '16px 0 0 16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#1A1D2E', letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: positive ? '#22C55E' : '#EF4444', background: positive ? '#F0FDF4' : '#FEF2F2', padding: '2px 7px', borderRadius: 20 }}>
          {positive ? '↑' : '↓'} {change}
        </span>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs last period</span>
      </div>
    </div>
  );
}

/* ─── Chart Card wrapper ──────────────────────────────────────────── */
function ChartCard({ title, accent, children, action }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 16, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#1A1D2E', margin: 0 }}>{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────── */
export default function Reports() {
  const [dateRange, setDateRange] = useState('monthly');

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '28px' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1D2E', margin: 0 }}>
            Reports & Analytics
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>Clinic performance metrics & insights</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#F9FAFB', border: '1px solid #F0F0F0', borderRadius: 10, padding: 4, gap: 3 }}>
            {['weekly', 'monthly', 'yearly'].map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                style={{
                  background: dateRange === r ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  color: dateRange === r ? '#E8630A' : '#9CA3AF',
                  borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  boxShadow: dateRange === r ? '0 1px 6px rgba(0,0,0,0.07)' : 'none',
                  transition: 'all 0.15s',
                }}
              >{r}</button>
            ))}
          </div>
          <button style={{ background: 'linear-gradient(135deg,#E8630A,#c4500a)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            📥 Export Report
          </button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value="₹6,78,000" change="+22%" color="#E8630A" icon="💰" />
        <StatCard label="Total Appointments" value="653" change="+15%" color="#6366F1" icon="📅" />
        <StatCard label="New Patients" value="142" change="+8%" color="#22C55E" icon="🐾" />
        <StatCard label="Staff Attendance" value="94.2%" change="+1.2%" color="#A855F7" icon="👥" />
      </div>

      {/* ── Revenue + Staff pie ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 18, marginBottom: 18 }}>

        {/* Revenue bar chart */}
        <ChartCard
          title="Revenue vs Target"
          accent="#E8630A"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9CA3AF' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#E8630A', display: 'inline-block' }} />Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9CA3AF' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#E5E7EB', display: 'inline-block' }} />Target
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={revenueData} barSize={16} barGap={4}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 6 }} />
              <Bar dataKey="revenue" fill="#E8630A" radius={[5, 5, 0, 0]} name="revenue" />
              <Bar dataKey="target" fill="#E5E7EB" radius={[5, 5, 0, 0]} name="target" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Staff by role donut */}
        <ChartCard title="Staff by Role" accent="#6366F1">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <PieChart width={170} height={170}>
              <Pie data={roleData} cx={82} cy={82} innerRadius={48} outerRadius={78} dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}>
                {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {roleData.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6B7280' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, display: 'inline-block', flexShrink: 0 }} />
                  {r.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 4, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(r.value / 9) * 100}%`, background: r.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.color, minWidth: 14, textAlign: 'right' }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Appointment trend + Top services ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>

        {/* Line/area chart */}
        <ChartCard title="Weekly Appointment Trend" accent="#22C55E">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={apptTrend}>
              <defs>
                <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="appts" stroke="#22C55E" strokeWidth={2.5} fill="url(#apptGrad)" dot={{ fill: '#22C55E', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, strokeWidth: 0 }} name="appts" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top services table */}
        <ChartCard title="Top Services" accent="#A855F7">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topServices.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FAFAFA', borderRadius: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: s.color, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1D2E' }}>{s.name}</div>
                  <div style={{ width: '100%', height: 3, borderRadius: 99, background: '#F0F0F0', marginTop: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.count / 312) * 100}%`, background: s.color, borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1D2E' }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>₹{(s.revenue / 1000).toFixed(0)}k</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}