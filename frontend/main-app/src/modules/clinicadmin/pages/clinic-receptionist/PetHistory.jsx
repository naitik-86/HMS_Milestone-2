import { useEffect, useState } from "react";
import { getPetHistory } from "../../api/receptionApi";
import { useParams } from "react-router-dom";
export default function PetHistory() {
  console.log("PetHistory Rendered");
  const [search, setSearch] = useState("");
  const [visits, setVisits] = useState([]);
  const fetchPetHistory = async () => {
    try {
      console.log("API Calling...");

      const response = await getPetHistory();

      console.log("API Response:", response);

      setVisits(response.data);
    } catch (error) {
      console.error("Error fetching pet history:", error);
    }
  };
  useEffect(() => {
    console.log("useEffect fired");

    fetchPetHistory();
  }, []);

  const filteredVisits = visits.filter(
    (visit) =>
      visit.petName?.toLowerCase().includes(search.toLowerCase()) ||
      visit.owner?.toLowerCase().includes(search.toLowerCase())
  );


  const getStatusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  const stats = [
    { label: "Total Visits", value: "12", color: "text-slate-900" },
    { label: "Vaccinations", value: "5", color: "text-green-600" },
    { label: "Treatments", value: "4", color: "text-orange-500" },
    { label: "Checkups", value: "3", color: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
          Pet History
        </h1>
        <p className="text-slate-500 mt-2">
          View complete visit history and medical records
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-sm"
          >
            <p className="text-slate-500">{item.label}</p>
            <h2 className={`text-3xl sm:text-4xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Visit History Records
          </h2>
          <p className="text-orange-100 mt-1">
            Search by Pet Name or Owner Name
          </p>
        </div>

        <div className="p-4 sm:p-8">
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              Search
            </div>
            <input
              type="text"
              placeholder="Pet name or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-20 sm:pl-24 pr-4 sm:pr-5 py-3.5 sm:py-4 border border-slate-300 rounded-2xl sm:rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
            />
          </div>

          <div className="md:hidden space-y-4">
            {filteredVisits.map((visit) => (
              <div
                key={`${visit.ownerId}-${visit.petId}-${visit.tokenNumber}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Pet Name
                    </p>
                    <h3 className="text-lg font-bold text-slate-800">
                      {visit.petName}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(visit.status)}`}
                  >
                    {visit.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-semibold text-slate-800">
                        {visit.date}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Bill</p>
                      <p className="font-semibold text-slate-800">
                        {visit.bill}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="font-semibold text-slate-800">
                      {visit.owner}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Reason</p>
                      <p className="font-semibold text-slate-800">
                        {visit.reason}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Doctor</p>
                      <p className="font-semibold text-slate-800">
                        {visit.doctor}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition">
                  View
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Pet Name</th>
                  <th className="p-4 text-left">Owner</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Doctor</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={`${visit.ownerId}-${visit.petId}-${visit.tokenNumber}`}>
                    <td className="p-4">{visit.date}</td>
                    <td className="p-4 font-medium">{visit.petName}</td>
                    <td className="p-4">{visit.owner}</td>
                    <td className="p-4">{visit.reason}</td>
                    <td className="p-4">{visit.doctor}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(visit.status)}`}
                      >
                        {visit.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{visit.age}</td>
                    <td className="p-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-lg p-5 sm:p-8 mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          Recent Activity
        </h2>
        <div className="space-y-6">
          {visits.map((visit, index) => (
            <div key={`${visit.ownerId}-${visit.petId}-${visit.tokenNumber}`} className="flex gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-2 ${index === 0 ? "bg-orange-500" : index === 1 ? "bg-blue-500" : "bg-green-500"}`}
              />
              <div>
                <h3 className="font-semibold">{visit.reason}</h3>
                <p className="text-slate-500">
                  {visit.petName} - {visit.date} - {visit.doctor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
