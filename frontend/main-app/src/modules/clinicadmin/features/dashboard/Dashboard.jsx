import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { fetchClinicDashboard } from "../../api/dashboardApi";

const DEFAULT_DASHBOARD = {
  metrics: {
    totalStaff: 0,
    activeDoctors: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingAppointments: 0,
    newRegistrationsToday: 0,
    staffThisMonth: 0,
    doctorJoiningsThisMonth: 0,
  },
  revenueData: [],
  appointmentTrend: [],
  recentEnrollments: [],
  roleDistribution: [],
  todayAppointments: [],
};

const ROLE_COLORS = {
  Doctor: "#6366F1",
  "Lab Technician": "#22C55E",
  Groomer: "#A855F7",
  "Kennel Staff": "#F97316",
  Receptionist: "#EC4899",
  default: "#64748B",
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getStatusClass = (status = "") => {
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  if (status === "Pending") return "bg-red-50 text-red-600";
  if (status === "Completed") return "bg-green-50 text-green-600";
  if (status === "Cancelled") return "bg-slate-100 text-slate-500";
  if (status === "Lab Pending") return "bg-orange-50 text-orange-600";
  return "bg-slate-100 text-slate-600";
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "NA";

function StatCard({ icon, label, value, change, accent }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EAE5DC] flex-1 min-w-0 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[11px] font-extrabold tracking-[0.14em]"
          style={{ backgroundColor: `${accent}22`, color: accent }}
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
        <span className="text-[#22C55E] text-xs font-semibold">{change}</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const value = item?.value ?? 0;
  const isRevenue = item?.dataKey === "revenue";

  return (
    <div className="bg-white border border-[#EAE5DC] rounded-lg p-2 px-3.5 shadow-md">
      <p className="text-[#9CA3AF] text-xs">{label}</p>
      <p className="text-[#E8630A] text-sm font-bold">
        {isRevenue ? `INR ${formatINR(value)}` : value}
      </p>
    </div>
  );
};

const normalizeDashboard = (payload = {}) => {
  const data = payload?.data || payload;
  const metrics = data?.metrics || {};

  return {
    metrics: {
      totalStaff: Number(metrics.totalStaff || 0),
      activeDoctors: Number(metrics.activeDoctors || 0),
      todayAppointments: Number(metrics.todayAppointments || 0),
      monthlyRevenue: Number(metrics.monthlyRevenue || 0),
      pendingAppointments: Number(metrics.pendingAppointments || 0),
      newRegistrationsToday: Number(metrics.newRegistrationsToday || 0),
      staffThisMonth: Number(metrics.staffThisMonth || 0),
      doctorJoiningsThisMonth: Number(metrics.doctorJoiningsThisMonth || 0),
    },
    revenueData: Array.isArray(data?.revenueData) ? data.revenueData : [],
    appointmentTrend: Array.isArray(data?.appointmentTrend) ? data.appointmentTrend : [],
    recentEnrollments: Array.isArray(data?.recentEnrollments) ? data.recentEnrollments : [],
    roleDistribution: Array.isArray(data?.roleDistribution)
      ? data.roleDistribution.map((item) => ({
          ...item,
          count: Number(item.count || 0),
          total: Number(item.total || 0),
        }))
      : [],
    todayAppointments: Array.isArray(data?.todayAppointments) ? data.todayAppointments : [],
  };
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(DEFAULT_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchClinicDashboard();

      if (!mountedRef.current) return;

      setDashboard(normalizeDashboard(response));
    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load clinic dashboard"
      );
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadDashboard();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-0 sm:p-2 lg:p-6">
        <div className="rounded-2xl border border-[#EAE5DC] bg-white p-6 shadow-sm">
          Loading clinic dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-0 sm:p-2 lg:p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-red-600">Dashboard unavailable</div>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-lg bg-[#E8630A] px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-2 lg:p-6 flex flex-col gap-5 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="STA"
          label="Total Staff"
          value={dashboard.metrics.totalStaff}
          change={`${dashboard.metrics.staffThisMonth} this month`}
          accent="#6366F1"
        />
        <StatCard
          icon="DOC"
          label="Active Doctors"
          value={dashboard.metrics.activeDoctors}
          change={`${dashboard.metrics.doctorJoiningsThisMonth} this month`}
          accent="#22C55E"
        />
        <StatCard
          icon="APT"
          label="Today's Appts"
          value={dashboard.metrics.todayAppointments}
          change={`${dashboard.metrics.pendingAppointments} waiting`}
          accent="#F97316"
        />
        <StatCard
          icon="REV"
          label="Monthly Revenue"
          value={`INR ${formatINR(dashboard.metrics.monthlyRevenue)}`}
          change="From completed visits"
          accent="#A855F7"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-[1.5] shadow-sm">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-0.5 h-4.5 bg-[#E8630A] rounded-full" />
                <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">
                  Revenue Overview
                </h3>
              </div>
              <p className="text-[#6B7280] text-xs pl-2.5">
                Monthly revenue from completed appointments
              </p>
            </div>
            <span className="bg-green-50 text-[#22C55E] text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
              Live
            </span>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dashboard.revenueData} barSize={28}>
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `INR ${(Number(value) / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(232,99,10,0.06)" }} />
              <Bar dataKey="revenue" fill="#E8630A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-0.5 h-4.5 bg-[#6366F1] rounded-full" />
              <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">
                Weekly Appointments
              </h3>
            </div>
            <p className="text-[#6B7280] text-xs pl-2.5">
              Last 7 days from the clinic queue
            </p>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dashboard.appointmentTrend}>
              <XAxis
                dataKey="day"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="appts"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ fill: "#6366F1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[1fr_1fr_1.2fr] gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="flex items-center gap-2 mb-[18px]">
            <div className="w-0.5 h-4.5 bg-[#E8630A] rounded-full" />
            <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">
              Recent Staff Enrollments
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {dashboard.recentEnrollments.length > 0 ? (
              dashboard.recentEnrollments.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EAE5DC] hover:border-[#E8630A55] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full border flex items-center justify-center text-[12px] font-bold"
                      style={{
                        backgroundColor: `${staff.color || ROLE_COLORS.default}22`,
                        borderColor: `${staff.color || ROLE_COLORS.default}44`,
                        color: staff.color || ROLE_COLORS.default,
                      }}
                    >
                      {getInitials(staff.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px] text-[#1A1D2E]">
                        {staff.name}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {staff.role} - {staff.dept}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                    {staff.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#EAE5DC] p-4 text-center text-sm text-slate-500">
                No recent staff enrollments found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-1 shadow-sm">
          <div className="flex items-center gap-2 mb-[18px]">
            <div className="w-0.5 h-4.5 bg-[#6366F1] rounded-full" />
            <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">
              Staff Role Distribution
            </h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {dashboard.roleDistribution.length > 0 ? (
              dashboard.roleDistribution.map((role) => (
                <div key={role.role}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-gray-400">{role.role}</span>
                    <span className="text-[13px] text-[#6B7280] font-semibold">
                      {role.count} staff
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${role.total ? (role.count / role.total) * 100 : 0}%`,
                        backgroundColor: role.color || ROLE_COLORS.default,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#EAE5DC] p-4 text-center text-sm text-slate-500">
                No staff roles found yet.
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-[#EAE5DC]">
              <div className="text-[#6B7280] text-[11px]">New Registrations</div>
              <div className="font-syne text-xl font-bold text-[#E8630A] mt-0.5">
                {dashboard.metrics.newRegistrationsToday}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#EAE5DC]">
              <div className="text-[#6B7280] text-[11px]">Pending Queue</div>
              <div className="font-syne text-xl font-bold text-red-500 mt-0.5">
                {dashboard.metrics.pendingAppointments}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] flex-[1.2] shadow-sm">
          <div className="flex items-center justify-between mb-[18px]">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4.5 bg-[#F97316] rounded-full" />
              <h3 className="font-syne text-[15px] font-bold text-[#1A1D2E]">
                Today's Appointments
              </h3>
            </div>
            <span className="bg-[#F9731626] text-[#F97316] text-[11px] font-bold px-2 py-0.5 rounded-full">
              {dashboard.metrics.todayAppointments} total
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {dashboard.todayAppointments.length > 0 ? (
              dashboard.todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-[#EAE5DC] items-center"
                >
                  <div className="bg-white border border-[#EAE5DC] rounded-lg px-2 py-1 text-[11px] font-bold text-[#E8630A] whitespace-nowrap">
                    {appointment.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#1A1D2E] truncate">
                      {appointment.pet}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      {appointment.doctor} - {appointment.type}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#EAE5DC] p-4 text-center text-sm text-slate-500">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
