import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { revenueData, apptData, recentEnrollments, roleDistribution, todayAppts } from '../../data/dashboard';

function StatCard({ icon, label, value, change, accent }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] flex-1 min-w-0 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${accent}22` }}
        >
          {icon}
        </div>
      </div>
      <div className="text-[#9CA3AF] text-[11px] font-semibold tracking-widest uppercase mb-1.5">
        {label}
      </div>
      <div className="font-syne text-3xl font-extrabold text-[#1A1D2E] leading-none">
        {value}
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        <span className="text-[#22C55E] text-xs font-semibold">↑ {change}</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EAE5DC] rounded-lg p-2 px-3.5 shadow-md">
        <p className="text-[#9CA3AF] text-xs">{label}</p>
        <p className="text-[#E8630A] text-sm font-bold">
          {payload[0].name === 'revenue' ? `₹${payload[0].value.toLocaleString()}` : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="p-6 flex flex-col gap-5 animate-fade-in">
      
      {/* Top Stats */}
      <div className="flex gap-4">
        <StatCard icon="👥" label="Total Staff" value="28" change="3 this month" accent="#6366F1" />
        <StatCard icon="🩺" label="Active Doctors" value="9" change="1 this month" accent="#22C55E" />
        <StatCard icon="📅" label="Today's Appts" value="34" change="5 vs yesterday" accent="#F97316" />
        <StatCard icon="💰" label="Monthly Revenue" value="₹1,20,000" change="18.4% this month" accent="#A855F7" />
      </div>

      {/* Charts Row */}
      <div className="flex gap-4">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-[1.5] shadow-sm">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-0.5 h-4.5 bg-[#E8630A] rounded-full"></div>
                <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">Revenue Overview</h3>
              </div>
              <p className="text-[#6B7280] text-xs pl-2.5">Monthly revenue (INR)</p>
            </div>
            <span className="bg-green-50 text-[#22C55E] text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
              +18.4%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barSize={28}>
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(232,99,10,0.06)' }} />
              <Bar dataKey="revenue" fill="#E8630A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-0.5 h-4.5 bg-[#6366F1] rounded-full"></div>
              <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">Weekly Appointments</h3>
            </div>
            <p className="text-[#6B7280] text-xs pl-2.5">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={apptData}>
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="appts" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Row */}
      <div className="flex gap-4">
        {/* Recent Enrollments */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="flex items-center gap-2 mb-[18px]">
            <div className="w-0.5 h-4.5 bg-[#E8630A] rounded-full"></div>
            <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">Recent Staff Enrollments</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recentEnrollments.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EAE5DC] hover:border-[#E8630A55] transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-full border flex items-center justify-center text-[12px] font-bold"
                    style={{ backgroundColor: `${e.color}22`, borderColor: `${e.color}44`, color: e.color }}
                  >
                    {e.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px] text-[#1A1D2E]">{e.name}</div>
                    <div className="text-[11px] text-[#6B7280]">{e.role} · {e.dept}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="flex items-center gap-2 mb-[18px]">
            <div className="w-0.5 h-4.5 bg-[#6366F1] rounded-full"></div>
            <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">Staff Role Distribution</h3>
          </div>
          <div className="flex flex-col gap-3.5">
            {roleDistribution.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] text-gray-400">{r.role}</span>
                  <span className="text-[13px] text-[#6B7280] font-semibold">{r.count} staff</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(r.count / r.total) * 100}%`, backgroundColor: r.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-[#EAE5DC]">
              <div className="text-[#6B7280] text-[11px]">On Leave Today</div>
              <div className="font-syne text-xl font-bold text-yellow-500 mt-0.5">3</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#EAE5DC]">
              <div className="text-[#6B7280] text-[11px]">Contract Expiring</div>
              <div className="font-syne text-xl font-bold text-red-500 mt-0.5">2</div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-[1.2] shadow-sm">
          <div className="flex items-center justify-between mb-[18px]">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4.5 bg-[#F97316] rounded-full"></div>
              <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">Today's Appointments</h3>
            </div>
            <span className="bg-[#F9731626] text-[#F97316] text-[11px] font-bold px-2 py-0.5 rounded-full">
              34 total
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {todayAppts.map((a, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white rounded-xl border border-[#EAE5DC] items-center">
                <div className="bg-white border border-[#EAE5DC] rounded-lg px-2 py-1 text-[11px] font-bold text-[#E8630A] whitespace-nowrap">
                  {a.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#1A1D2E] truncate">{a.pet}</div>
                  <div className="text-[11px] text-[#6B7280]">{a.doctor} · {a.type}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap
                  ${a.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' : 
                    a.status === 'Pending' ? 'bg-red-50 text-red-500' : 
                    'bg-green-50 text-green-600'}`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}