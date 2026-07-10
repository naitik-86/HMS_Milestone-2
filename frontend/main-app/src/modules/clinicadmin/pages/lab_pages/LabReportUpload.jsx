import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  FlaskConical,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import LabReportModal from "./LabReportCard"
import {
  getAllPatientReports,
  getPatientReports

} from "../../api/labApi"

export default function LabReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    completed: 0,
    critical: 0,
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await getAllPatientReports();

      setReports(res.data);
      setFilteredReports(res.data);

      setStats({
        total: res.totalReports,
        today: res.todayReports,
        completed: res.completedReports,
        critical: res.criticalReports,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredReports(
      reports.filter(
        (item) =>
          item.petId?.name?.toLowerCase().includes(value) ||
          item.ownerId?.ownerName?.toLowerCase().includes(value) ||
          item.tokenNumber?.toString().includes(value)
      )
    );
  }, [search, reports]);

  const openReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Lab Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Manage and review laboratory reports
          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<FlaskConical size={22} />}
          color="orange"
        />

        <StatCard
          title="Today's Reports"
          value={stats.today}
          icon={<Calendar size={22} />}
          color="blue"
        />

        <StatCard
          title="Critical Reports"
          value={stats.critical}
          icon={<AlertTriangle size={22} />}
          color="red"
        />

        <StatCard
          title="Completed Reports"
          value={stats.completed}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400"
          />

          <input
            placeholder="Search by Pet, Owner or Token..."
            className="w-full border rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <table className="w-full">

          <thead className="bg-white border-b border-slate-200">

            <tr>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Token
              </th>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Pet
              </th>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Owner
              </th>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Tests
              </th>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Status
              </th>

              <th className="px-6 py-4 text-left text-slate-700 font-semibold tracking-wide">
                Date
              </th>

              <th className="px-6 py-4 text-center text-slate-700 font-semibold tracking-wide">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredReports.map((item) => (

              <tr
                key={item._id}
                className="border-b hover:bg-orange-50"
              >

                <td className="p-4">{item.visitId?.tokenNumber}</td>

                <td className="p-4">
                  {item.petId?.name}
                </td>

                <td className="p-4">
                  {item.ownerId?.ownerName}
                </td>

                <td className="p-4">
                  {item.reports.length}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-center">

                  <button
                    onClick={() => openReport(item)}
                    className="border border-orange-400 text-orange-600 rounded-lg px-4 py-2 hover:bg-orange-500 hover:text-white transition"
                  >
                    <Eye size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <LabReportModal
        open={showModal}
        onClose={setShowModal}
        report={selectedReport}
      />

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}