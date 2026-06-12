import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function CompletedPets() {
  const [search, setSearch] = useState("");

  const completedPets = [
    {
      id: 1,
      token: "TK-001",
      ownerName: "Rahul Sharma",
      phoneNumber: "+91 9876543210",
      petName: "Bruno",
      completedDate: "12 Jun 2026",
      completedBy: "Dr. Amit",
      status: "Completed",
    },
    {
      id: 2,
      token: "TK-002",
      ownerName: "Aman Verma",
      phoneNumber: "+91 9876543211",
      petName: "Max",
      completedDate: "12 Jun 2026",
      completedBy: "Dr. Karan",
      status: "Completed",
    },
    {
      id: 3,
      token: "TK-003",
      ownerName: "Rohit Kumar",
      phoneNumber: "+91 9876543212",
      petName: "Rocky",
      completedDate: "11 Jun 2026",
      completedBy: "Dr. Vivek",
      status: "Completed",
    },
  ];

  const filteredPets = completedPets.filter(
    (pet) =>
      pet.token.toLowerCase().includes(search.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      pet.petName.toLowerCase().includes(search.toLowerCase()) ||
      pet.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  const cards = [
    {
      title: "Completed Today",
      value: "18",
      icon: "✅",
      color: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "This Week",
      value: "96",
      icon: "📅",
      color: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Completed",
      value: "1248",
      icon: "🏆",
      color: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-8">

        <Header
          title="Completed Pets"
          subtitle="Successfully completed consultations"
        />

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all"
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

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search completed pets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Completed Consultations
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                All successfully completed pet assessments
              </p>
            </div>

            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-semibold">
              {filteredPets.length} Completed
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
                    Completed Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Completed By
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                    View
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPets.length > 0 ? (
                  filteredPets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="border-t border-slate-100 hover:bg-green-50/30 transition-all"
                    >

                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {pet.token}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center font-bold text-green-600">
                            {pet.ownerName.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {pet.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {pet.phoneNumber}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center text-xl">
                            🐾
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {pet.petName}
                            </p>

                            <p className="text-sm text-slate-500">
                              Consultation Completed
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {pet.completedDate}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {pet.completedBy}
                      </td>

                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                          <span className="w-2 h-2 rounded-full bg-green-500"></span>

                          {pet.status}

                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-center">

                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
                            👁 View
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
                        🎉
                      </div>

                      <h3 className="text-xl font-bold text-slate-700">
                        No Completed Pets Yet
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Completed consultations will appear here.
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