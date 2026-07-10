import { useState } from "react";
import { useEffect } from "react";
import { Header } from "../../components";
import { getHistoryPets } from "../../api/preConsultationApi";
import formatDate from "../../../../shared/utils/formatDate";

export default function HistoryPets() {
  const [search, setSearch] = useState("");

  const [historyData, setHistoryData] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryPets();

      setHistoryData(res.data.records);

      setCards([
        {
          title: "Total Records",
          value: res.data.stats.totalRecords,
          icon: "📚",
          color: "bg-blue-50",
        },
        {
          title: "This Month",
          value: res.data.stats.thisMonth,
          icon: "📅",
          color: "bg-purple-50",
        },
        {
          title: "Archived Cases",
          value: res.data.stats.archivedCases,
          icon: "🗂️",
          color: "bg-orange-50",
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(historyData);


  const filteredRecords = historyData
  // historyData.filter(
  //   (item) =>
  //     item.tokenNumber
  //       ?.toLowerCase()
  //       .includes(search.toLowerCase()) ||
  //     item.ownerId?.ownerName
  //       ?.toLowerCase()
  //       .includes(search.toLowerCase()) ||
  //     item.ownerId?.petName
  //       ?.toLowerCase()
  //       .includes(search.toLowerCase()) ||
  //     item.ownerId?.phoneNumber
  //       ?.toLowerCase()
  //       .includes(search.toLowerCase())
  // );

  return (
    <div className="flex min-h-screen bg-slate-100">



      <div className="flex-1 p-4 md:p-6 lg:p-8 mt-17.5 md:mt-0 overflow-x-hidden">
        <Header

          title="History Pets"
          subtitle="Archived pet consultation records"
          showSearch={false}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mt-3">
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
        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-sm p-4 md:p-6 mb-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* Search Input */}
            <div className="relative sm:col-span-2 xl:col-span-1">

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

            {/* Date */}
            <input
              type="date"
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

            {/* Visit Type */}
            <select className="w-full border border-slate-200 rounded-2xl px-5 py-4">
              <option>All Visit Types</option>
              <option>Checkup</option>
              <option>Vaccination</option>
              <option>Consultation</option>
            </select>

            {/* Button */}
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-medium py-4">
              Search Records
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Table Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-8 py-6 border-b border-slate-200">
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

          <div className="hidden lg:block overflow-x-auto">
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
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    CurrentStage
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                    Priority
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-slate-100 hover:bg-blue-50/30 transition-all"
                    >

                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {item.tokenNumber}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                            {item.ownerId?.ownerName?.charAt(0)}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {item?.ownerId?.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {item.ownerId?.mobileNumber}
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
                              {item.petId?.name}
                            </p>
                            <p className="font-semibold text-slate-800">
                              {item.petId?.breed}
                            </p>

                            <p className="text-sm text-slate-500">
                              {item.petId?.species
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {formatDate(item.updatedAt)}
                      </td>

                      <td className="px-6 py-5">

                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          {item?.status}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {item.currentStage}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {item.priority}
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
          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredRecords.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {item.tokenNumber}
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.visitType}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Owner:</strong> {item?.ownerId?.ownerName}</p>
                  <p><strong>Phone:</strong> {item?.ownerId?.mobileNumber}</p>
                  <p><strong>Pet:</strong> {item?.petId?.name || "Bruno"}</p>

                </div>

                <button className="mt-4 w-full rounded-xl bg-slate-800 py-3 text-white">
                  📄 View Record
                </button>
              </div>
            ))}
          </div>


        </div>

      </div>

    </div>
  );
}