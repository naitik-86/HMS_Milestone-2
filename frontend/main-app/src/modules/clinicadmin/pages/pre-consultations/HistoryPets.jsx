import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";

import { Header } from "../../components";

export default function HistoryPets() {
  const [search, setSearch] = useState("");

  const historyData = [
    {
      id: 1,
      token: "TK-001",
      ownerName: "Rahul Sharma",
      phoneNumber: "+91 9876543210",
      petName: "Bruno",
      visitDate: "12 Jun 2026",
      visitType: "Checkup",
      doctor: "Dr. Amit",
    },
    {
      id: 2,
      token: "TK-002",
      ownerName: "Amit Verma",
      phoneNumber: "+91 9876543211",
      petName: "Max",
      visitDate: "11 Jun 2026",
      visitType: "Vaccination",
      doctor: "Dr. Karan",
    },
    {
      id: 3,
      token: "TK-003",
      ownerName: "Karan Kumar",
      phoneNumber: "+91 9876543212",
      petName: "Rocky",
      visitDate: "10 Jun 2026",
      visitType: "Consultation",
      doctor: "Dr. Vivek",
    },
  ];

  const cards = [
    {
      title: "Total Records",
      value: "2458",
      icon: "📚",
      color: "bg-blue-50",
    },
    {
      title: "This Month",
      value: "148",
      icon: "📅",
      color: "bg-purple-50",
    },
    {
      title: "Archived Cases",
      value: "982",
      icon: "🗂️",
      color: "bg-orange-50",
    },
  ];

  const filteredRecords = historyData.filter(
    (item) =>
      item.token.toLowerCase().includes(search.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      item.petName.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-100">



      <div className="flex-1 p-8">

        <Header

          title="History Pets"
          subtitle="Archived pet consultation records"
        />

        {/* KPI Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-lg transition-all"
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-slate-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold text-slate-800 mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${card.color}`}
                >
                  {card.icon}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">

          <div className="grid lg:grid-cols-4 gap-4">

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search Pet / Owner / Token..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />

            </div>

            <input
              type="date"
              className="border border-slate-200 rounded-2xl px-5 py-4"
            />

            <select className="border border-slate-200 rounded-2xl px-5 py-4">
              <option>All Visit Types</option>
              <option>Checkup</option>
              <option>Vaccination</option>
              <option>Consultation</option>
            </select>

            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-medium">
              Search Records
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Table Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Medical Records Archive
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Historical pet consultations and treatments
              </p>

            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl font-semibold">
              {filteredRecords.length} Records
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Token
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Owner Details
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Pet Details
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Visit Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Visit Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-blue-50/30 transition-all"
                    >

                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {item.token}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                            {item.ownerName.charAt(0)}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {item.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {item.phoneNumber}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">
                            🐾
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {item.petName}
                            </p>

                            <p className="text-sm text-slate-500">
                              Medical Record
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {item.visitDate}
                      </td>

                      <td className="px-6 py-5">

                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          {item.visitType}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {item.doctor}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-center">

                          <button className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium">
                            📄 View Record
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-20"
                    >

                      <div className="text-6xl mb-4">
                        📚
                      </div>

                      <h3 className="text-xl font-bold text-slate-700">
                        No Records Found
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Historical consultation records will appear here.
                      </p>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}