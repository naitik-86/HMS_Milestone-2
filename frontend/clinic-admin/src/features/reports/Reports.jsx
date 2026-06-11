import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart,
} from 'recharts';

// ─── Mock data (replace with your imports) ─────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 92000,  target: 100000 },
  { month: 'Feb', revenue: 108000, target: 110000 },
  { month: 'Mar', revenue: 97000,  target: 105000 },
  { month: 'Apr', revenue: 123000, target: 115000 },
  { month: 'May', revenue: 134000, target: 130000 },
  { month: 'Jun', revenue: 124000, target: 120000 },
];
const roleData = [
  { name: 'Doctors',      value: 12, color: '#E8630A' },
  { name: 'Nurses',       value: 24, color: '#6366F1' },
  { name: 'Technicians',  value: 9,  color: '#22C55E' },
  { name: 'Admin',        value: 7,  color: '#F59E0B' },
];
const apptTrend = [
  { week: 'W1', appts: 62 },
  { week: 'W2', appts: 75 },
  { week: 'W3', appts: 71 },
  { week: 'W4', appts: 89 },
  { week: 'W5', appts: 95 },
  { week: 'W6', appts: 98 },
];
// ───────────────────────────────────────────────────────────────────────────

const ACCENT  = '#E8630A';
const INDIGO  = '#6366F1';
const GREEN   = '#22C55E';
const VIOLET  = '#A855F7';
const AMBER   = '#F59E0B';
const ROSE    = '#F43F5E';

const SURFACE  = '#FAFAF9';
const CARD_BG  = '#FFFFFF';
const BORDER   = '#EBEBEB';
const TEXT_HI  = '#0F172A';
const TEXT_MID = '#64748B';
const TEXT_LO  = '#94A3B8';

/* ── shared primitives ── */
const Tag = ({ color, children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: `${color}15`, color,
  }}>{children}</span>
);

const Dot = ({ color }) => (
  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
);

const SectionLabel = ({ color = ACCENT, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
    <span style={{ width: 3, height: 16, borderRadius: 99, background: color }} />
    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_HI, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {children}
    </span>
  </div>
);

/* ── tooltip ── */
const Tip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12,
      padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_LO, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: i ? 4 : 0 }}>
          <Dot color={p.color || p.fill} />
          <span style={{ fontSize: 12, color: TEXT_MID, minWidth: 70 }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: TEXT_HI, marginLeft: 'auto' }}>
            {(p.name === 'Revenue' || p.name === 'Target') ? `₹${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── KPI card ── */
const KPICard = ({ label, value, subValue, change, positive = true, color, icon, spark }) => (
  <div style={{
    background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20,
    padding: '22px 22px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', overflow: 'hidden',
  }}>
    {/* soft glow blob */}
    <span style={{
      position: 'absolute', top: -20, right: -20, width: 90, height: 90,
      borderRadius: '50%', background: `${color}18`, filter: 'blur(20px)', pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: TEXT_LO, textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>{label}</span>
      <span style={{
        width: 34, height: 34, borderRadius: 11, background: `${color}14`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      }}>{icon}</span>
    </div>

    <div style={{
      fontFamily: 'system-ui', fontSize: 28, fontWeight: 800, color: TEXT_HI,
      letterSpacing: '-0.03em', lineHeight: 1,
    }}>{value}</div>
    {subValue && <div style={{ fontSize: 11, color: TEXT_MID, marginTop: 4 }}>{subValue}</div>}

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
      <Tag color={positive ? GREEN : ROSE}>
        {positive ? '▲' : '▼'} {change}
      </Tag>
      {spark && (
        <ResponsiveContainer width={70} height={28}>
          <AreaChart data={spark} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`sg${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg${label})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

/* ── main ── */
export default function Reports() {
  const [range, setRange] = useState('monthly');

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalTarget  = revenueData.reduce((s, d) => s + d.target, 0);
  const pct          = Math.round((totalRevenue / totalTarget) * 100);

  // mini sparklines
  const revSpark  = revenueData.map(d => ({ v: d.revenue }));
  const apptSpark = apptTrend.map(d => ({ v: d.appts }));

  return (
    <div style={{ background: SURFACE, minHeight: '100vh', padding: '28px 32px', fontFamily: '"Inter", "Plus Jakarta Sans", system-ui, sans-serif' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${ACCENT}, #c4500a)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              boxShadow: `0 4px 14px ${ACCENT}40`,
            }}>📊</div>
            <h2 style={{ fontFamily: 'system-ui', fontSize: 22, fontWeight: 800, color: TEXT_HI, margin: 0, letterSpacing: '-0.03em' }}>
              Reports & Analytics
            </h2>
          </div>
          <p style={{ color: TEXT_LO, fontSize: 13, margin: 0 }}>
            Clinic performance · Updated just now
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* range toggle */}
          <div style={{
            display: 'flex', gap: 2, background: '#EDEDED', borderRadius: 12, padding: 3,
          }}>
            {['weekly', 'monthly', 'yearly'].map(r => (
              <button key={r} onClick={() => setRange(r)} style={{
                background: range === r ? '#fff' : 'transparent',
                border: 'none',
                boxShadow: range === r ? '0 1px 5px rgba(0,0,0,0.12)' : 'none',
                color: range === r ? ACCENT : TEXT_MID,
                borderRadius: 9, padding: '6px 16px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}>{r}</button>
            ))}
          </div>

          <button style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, #c4500a 100%)`,
            color: '#fff', border: 'none', borderRadius: 12, padding: '9px 20px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: `0 4px 16px ${ACCENT}45`,
            letterSpacing: '0.01em',
          }}>
            <span style={{ fontSize: 14 }}>↓</span> Export PDF
          </button>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KPICard label="Total Revenue"      value="₹6,78,000" subValue="This month"    change="+22% vs last"  color={ACCENT}  icon="💰" spark={revSpark} />
        <KPICard label="Appointments"       value="653"        subValue="Completed"     change="+15% vs last"  color={INDIGO}  icon="📅" spark={apptSpark} />
        <KPICard label="New Patients"       value="142"        subValue="First visits"  change="+8% vs last"   color={GREEN}   icon="🧑‍⚕️" />
        <KPICard label="Staff Attendance"   value="94.2%"      subValue="On duty today" change="+1.2% vs last" color={VIOLET}  icon="✅" />
      </div>

      {/* ── ROW 2: Revenue chart + Goal ring + Staff pie ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 260px', gap: 16, marginBottom: 16 }}>

        {/* Revenue vs Target */}
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20,
          padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <SectionLabel color={ACCENT}>Revenue vs Target</SectionLabel>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['Revenue', ACCENT], ['Target', '#D1CBC3']].map(([l, c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: TEXT_MID, fontWeight: 600 }}>
                  <span style={{ width: 10, height: 4, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={10} barGap={4} barCategoryGap="32%">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} />
                  <stop offset="100%" stopColor="#F4966A" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1EEEA" />
              <XAxis dataKey="month" tick={{ fill: TEXT_MID, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT_LO, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<Tip />} cursor={{ fill: '#F7F5F2' }} />
              <Bar dataKey="revenue" fill="url(#revGrad)" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar dataKey="target"  fill="#EDE9E3"        radius={[6, 6, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Goal donut */}
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20,
          padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <SectionLabel color={AMBER}>Monthly Goal</SectionLabel>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '4px auto 0' }}>
            <PieChart width={140} height={140}>
              <defs>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={AMBER} />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
              </defs>
              <Pie
                data={[{ value: pct }, { value: 100 - pct }]}
                cx={65} cy={65} startAngle={90} endAngle={-270}
                innerRadius={46} outerRadius={64} dataKey="value" paddingAngle={0} stroke="none"
              >
                <Cell fill="url(#amberGrad)" />
                <Cell fill="#F0EDE9" />
              </Pie>
            </PieChart>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: TEXT_HI, letterSpacing: '-0.04em', lineHeight: 1 }}>{pct}%</span>
              <span style={{ fontSize: 10, color: TEXT_LO, marginTop: 2, fontWeight: 600 }}>achieved</span>
            </div>
          </div>

          <div style={{
            marginTop: 18, padding: '12px 16px', borderRadius: 12, background: '#FEF9F3',
            border: `1px solid #FDE6C8`, width: '100%', boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 11, color: TEXT_LO, fontWeight: 600, marginBottom: 6 }}>Revenue progress</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: AMBER }}>₹{(totalRevenue / 100000).toFixed(1)}L</span>
              <span style={{ fontSize: 11, color: TEXT_LO }}>of ₹{(totalTarget / 100000).toFixed(1)}L</span>
            </div>
            <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: '#EDEBE8', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${AMBER}, #FB923C)`, borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Staff by role */}
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20,
          padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <SectionLabel color={INDIGO}>Staff by Role</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={150} height={130}>
              <Pie data={roleData} cx={70} cy={62} innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={4} stroke="none">
                {roleData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                formatter={(v, n) => [v, n]}
                contentStyle={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 11, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
            </PieChart>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {roleData.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Dot color={r.color} />
                <span style={{ fontSize: 12, color: TEXT_MID, flex: 1 }}>{r.name}</span>
                {/* mini bar */}
                <div style={{ flex: 2, height: 4, borderRadius: 4, background: '#F0EDEA', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: r.color, borderRadius: 4,
                    width: `${(r.value / roleData.reduce((a, b) => a + b.value, 0)) * 100}%`,
                    opacity: 0.85,
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color, minWidth: 20, textAlign: 'right' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Appointment trend ── */}
      <div style={{
        background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20,
        padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <SectionLabel color={GREEN}>Weekly Appointment Trend</SectionLabel>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag color={GREEN}>▲ 59% growth over 6 weeks</Tag>
            <Tag color={INDIGO}>Peak: W6 — 98 appts</Tag>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={apptTrend} margin={{ top: 4, right: 8, bottom: 0, left: -4 }}>
            <defs>
              <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.18} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F1EEEA" />
            <XAxis dataKey="week" tick={{ fill: TEXT_MID, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT_LO, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<Tip />} cursor={{ stroke: GREEN, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone" dataKey="appts" name="Appointments"
              stroke={GREEN} strokeWidth={2.5} fill="url(#apptGrad)"
              dot={{ fill: '#fff', stroke: GREEN, strokeWidth: 2.5, r: 4 }}
              activeDot={{ fill: GREEN, r: 6, stroke: '#fff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}