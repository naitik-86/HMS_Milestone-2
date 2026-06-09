import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// Data remains the same
const revenueData = [
  { month: 'Jan', revenue: 85000 }, { month: 'Feb', revenue: 92000 },
  { month: 'Mar', revenue: 78000 }, { month: 'Apr', revenue: 105000 },
  { month: 'May', revenue: 98000 }, { month: 'Jun', revenue: 120000 },
];

const apptData = [
  { day: 'Mon', appts: 28 }, { day: 'Tue', appts: 35 },
  { day: 'Wed', appts: 22 }, { day: 'Thu', appts: 40 },
  { day: 'Fri', appts: 34 }, { day: 'Sat', appts: 18 }, { day: 'Sun', appts: 12 },
];

const recentEnrollments = [
  { initials: 'DP', name: 'Dr. Priya Sharma', role: 'Doctor', dept: 'OPD', status: 'Active', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-indigo-100' },
  { initials: 'RM', name: 'Rahul Mehta', role: 'Lab Tech', dept: 'Lab', status: 'Active', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-100' },
  { initials: 'SR', name: 'Sunita Rao', role: 'Groomer', dept: 'Grooming', status: 'Active', bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-100' },
  { initials: 'AV', name: 'Amit Verma', role: 'Kennel Staff', dept: 'Kennel', status: 'Active', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-100' },
  { initials: 'NK', name: 'Neha Kapoor', role: 'Receptionist', dept: 'Front Desk', status: 'Active', bgColor: 'bg-pink-50', textColor: 'text-pink-600', borderColor: 'border-pink-100' },
];

const roleDistribution = [
  { role: 'Doctor', count: 9, total: 28, color: 'bg-indigo-500' },
  { role: 'Lab Technician', count: 4, total: 28, color: 'bg-emerald-500' },
  { role: 'Groomer', count: 5, total: 28, color: 'bg-purple-500' },
  { role: 'Kennel Staff', count: 6, total: 28, color: 'bg-orange-500' },
  { role: 'Receptionist', count: 4, total: 28, color: 'bg-pink-500' },
];

const todayAppts = [
  { time: '09:00', pet: 'Buddy (Golden)', owner: 'Rohan Desai', doctor: 'Dr. Priya', type: 'Checkup', status: 'Confirmed' },
  { time: '09:30', pet: 'Whiskers (Cat)', owner: 'Meera Joshi', doctor: 'Dr. Arjun', type: 'Vaccine', status: 'Confirmed' },
  { time: '10:00', pet: 'Max (Lab)', owner: 'Sanjay Gupta', doctor: 'Dr. Priya', type: 'Surgery', status: 'In Progress' },
  { time: '11:00', pet: 'Coco (Poodle)', owner: 'Anita Shah', doctor: 'Dr. Kavitha', type: 'Grooming', status: 'Pending' },
  { time: '11:30', pet: 'Rocky (G. Shepherd)', owner: 'Vijay Kumar', doctor: 'Dr. Arjun', type: 'Checkup', status: 'Confirmed' },
];

function StatCard({ icon, label, value, change, accentBg, accentText }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 min-w-[200px]">
      <div className={`w-12 h-12 ${accentBg} ${accentText} rounded-xl flex items-center justify-center text-xl mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 leading-tight">{value}</h3>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-emerald-500 text-xs font-bold">↑ {change}</span>
        <span className="text-slate-400 text-xs font-medium">vs last month</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3">
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].name === 'revenue' ? `₹${payload[0].value.toLocaleString()}` : `${payload[0].value} Appts`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="bg-white min-h-screen p-8 font-sans text-slate-900 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Analytics</h1>
        <p className="text-slate-500 text-sm">Overview of your clinic performance and staff activity.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="👥" label="Total Staff" value="28" change="3" accentBg="bg-indigo-50" accentText="text-indigo-600" />
        <StatCard icon="🩺" label="Active Doctors" value="09" change="1" accentBg="bg-emerald-50" accentText="text-emerald-600" />
        <StatCard icon="📅" label="Today's Appts" value="34" change="5" accentBg="bg-orange-50" accentText="text-orange-600" />
        <StatCard icon="💰" label="Monthly Revenue" value="₹1.2L" change="18.4%" accentBg="bg-purple-50" accentText="text-purple-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full" />
              <div>
                <h3 className="font-bold text-slate-900">Revenue Overview</h3>
                <p className="text-xs text-slate-500">Monthly earnings in INR</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">+18.4% growth</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Appointments Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            <div>
              <h3 className="font-bold text-slate-900">Weekly Activity</h3>
              <p className="text-xs text-slate-500">Appointments last 7 days</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apptData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="appts" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Recent Enrollments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-orange-500 rounded-full" />
            <h3 className="font-bold text-slate-900">New Staff</h3>
          </div>
          <div className="space-y-3">
            {recentEnrollments.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${e.bgColor} ${e.textColor} flex items-center justify-center text-xs font-bold border ${e.borderColor}`}>
                    {e.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">{e.name}</p>
                    <p className="text-[11px] text-slate-500">{e.role} • {e.dept}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            <h3 className="font-bold text-slate-900">Staff Breakdown</h3>
          </div>
          <div className="space-y-5">
            {roleDistribution.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-wide">{r.role}</span>
                  <span className="text-slate-900">{r.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.count / r.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">On Leave</p>
              <p className="text-xl font-black text-orange-700">03</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">Expiring</p>
              <p className="text-xl font-black text-rose-700">02</p>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-emerald-500 rounded-full" />
              <h3 className="font-bold text-slate-900">Schedule</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">34 Total</span>
          </div>
          <div className="space-y-3">
            {todayAppts.map((a, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl border border-slate-50 items-center">
                <div className="text-[11px] font-black text-orange-600 bg-orange-50 w-14 py-1 rounded flex justify-center uppercase">
                  {a.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{a.pet}</p>
                  <p className="text-[11px] text-slate-500 truncate">{a.doctor} • {a.type}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap
                  ${a.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
                    a.status === 'Pending' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {a.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}