import { useState } from "react";
import formatDate from "../../../../shared/utils/formatDate";
import { Header } from "../../components";
import { useEffect } from "react";
import { getCompletedPets } from "../../api/preConsultationApi";

export default function CompletedPets() {
  const [search, setSearch] = useState("");

  const [completedPets, setCompletedPets] = useState([]);
  const [stats, setStats] = useState({
    completedToday: 0,
    completedThisWeek: 0,
    totalCompleted: 0,
  });

  useEffect(() => {
    fetchCompletedPets();
  }, []);

  const fetchCompletedPets = async () => {
    try {
      const res = await getCompletedPets();

      setCompletedPets(res.data.pets);
      setStats(res.data.stats);



    } catch (err) {
      console.error(err);
    }
  };
  console.log(completedPets);
  const filteredPets = completedPets;


  const cards = [
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: "✅",
      color: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "This Week",
      value: stats.completedThisWeek,
      icon: "📅",
      color: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Completed",
      value: stats.totalCompleted,
      icon: "🏆",
      color: "bg-purple-50",
      text: "text-purple-600",
    },
  ];
  return (
    <div className="flex min-h-screen bg-slate-100">


      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden mt-17.5 md:mt-0">
        <Header
          title="Completed Pets"
          subtitle="Successfully completed consultations"
          showSearch={false}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

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

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">
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
        <div className="bg-white rounded-3xl shadow-sm p-4 md:p-6 mb-8">

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-4 md:px-8 py-6 border-b border-slate-200">

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
                    Completed Date
                  </th>


                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    currentStage
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPets.length > 0 ? (
                  filteredPets.map((pet) => (
                    <tr
                      key={pet._id}
                      className="border-t border-slate-100 hover:bg-green-50/30 transition-all"
                    >

                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {pet.tokenNumber}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center font-bold text-green-600">
                            {pet?.ownerId?.ownerName.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {pet?.ownerId?.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {pet?.ownerId?.mobileNumber}
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
                              {pet?.petId?.name}
                            </p>

                            <p className="text-sm text-slate-500">
                              Consultation Completed
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {formatDate(pet.updatedAt)}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {pet?.currentStage}
                      </td>

                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                          <span className="w-2 h-2 rounded-full bg-green-500"></span>

                          {pet?.workflow?.preConsultationCompleted ? "Completed" : "Pending"}

                        </span>

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
          <div className="lg:hidden p-4 space-y-4">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-bold text-slate-800">
                    {pet.token}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {pet.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Owner:</strong> {pet.ownerName}
                  </p>

                  <p>
                    <strong>Phone:</strong> {pet.phoneNumber}
                  </p>

                  <p>
                    <strong>Pet:</strong> {pet.petName}
                  </p>

                  <p>
                    <strong>Date:</strong> {pet.completedDate}
                  </p>

                  <p>
                    <strong>Doctor:</strong> {pet.completedBy}
                  </p>
                </div>

                <button className="mt-4 w-full rounded-xl bg-blue-500 py-3 text-white font-medium hover:bg-blue-600 transition-all">
                  👁 View
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}