
import { useEffect, useState } from "react";
import { Search, Filter, RefreshCw, Eye } from "lucide-react";
import { getCompletedPets } from "../../../api/doctorModuleApi";
import toast from "react-hot-toast";

export default function CompletedPets() {
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("ALL");
  const [completedCases, setCompletedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    total: 0,
  });

  useEffect(() => {
    fetchCompletedPets();
  }, []);

  const fetchCompletedPets = async () => {
    try {
      setLoading(true);
      const response = await getCompletedPets();
      const cases = response?.pets || response?.data?.pets || (Array.isArray(response) ? response : []);
      setCompletedCases(cases);
      setStats({
        today: response?.stats?.completedToday || cases.length,
        thisWeek: response?.stats?.completedThisWeek || cases.length,
        total: response?.stats?.totalCompleted || cases.length,
      });
    } catch (error) {
      console.error("Error fetching completed pets:", error);
      toast.error("Failed to load completed doctor cases");
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesIcon = (species) => {
    const s = (species || "").toLowerCase();
    if (s.includes("cat")) return "🐱";
    if (s.includes("bird") || s.includes("parrot")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐶";
  };

  const filteredCases = completedCases.filter((item) => {
    const ownerName = item.ownerId?.ownerName || item.ownerName || "";
    const petName = item.petId?.name || item.petId?.petName || item.petName || "";
    const phone = item.ownerId?.mobileNumber || item.phoneNumber || "";
    const species = item.petId?.species || item.species || "";
    const token = item.tokenNumber || item.token || "";

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      ownerName.toLowerCase().includes(query) ||
      petName.toLowerCase().includes(query) ||
      phone.includes(query) ||
      token.toLowerCase().includes(query);

    const matchesSpecies =
      speciesFilter === "ALL" ||
      species.toUpperCase() === speciesFilter.toUpperCase();

    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6 pt-16 md:pt-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Today</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{loading ? "..." : stats.today}</h2>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-green-50 text-green-600 border border-green-100 flex items-center justify-center text-2xl font-bold">
            ✅
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">This Week</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{loading ? "..." : stats.thisWeek}</h2>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-2xl font-bold">
            📅
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Completed Cases</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{loading ? "..." : stats.total}</h2>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-2xl font-bold">
            🏆
          </div>
        </div>
      </div>

      {/* Search & Species Filter Toolbar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient Name, Owner Name, Phone Number, or Token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-700 text-sm focus:border-green-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer pr-2"
              >
                <option value="ALL">All Species</option>
                <option value="DOG">Dog 🐶</option>
                <option value="CAT">Cat 🐱</option>
                <option value="BIRD">Bird 🦜</option>
                <option value="RABBIT">Rabbit 🐇</option>
              </select>
            </div>

            <button
              onClick={fetchCompletedPets}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-slate-700 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-green-50/60 to-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Completed Doctor Consultations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Clinical evaluations, diagnoses, and prescriptions generated</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-4 py-1.5 rounded-2xl border border-green-200 self-start sm:self-center">
            {filteredCases.length} Cases
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Pet Name</th>
                <th className="py-4 px-6">Owner Info</th>
                <th className="py-4 px-6">Diagnosis / Complaint</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-green-500" />
                    Loading completed cases...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500">
                    <div className="text-5xl mb-3">🩺</div>
                    <h3 className="font-bold text-slate-700">No Completed Cases Found</h3>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting search parameters.</p>
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => {
                  const petName = item.petId?.name || item.petId?.petName || item.petName || "Pet";
                  const species = item.petId?.species || item.species || "Dog";
                  const ownerName = item.ownerId?.ownerName || item.ownerName || "Owner";
                  const mobile = item.ownerId?.mobileNumber || item.phoneNumber || "N/A";
                  const diagnosis = item.diagnosis?.confirmedDiagnosis || item.diagnosis?.provisionalDiagnosis || item.primaryReason || "Consultation Completed";
                  const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Today";

                  return (
                    <tr key={item._id} className="hover:bg-green-50/40 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-xl border border-green-100">
                            {getSpeciesIcon(species)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{petName}</span>
                            <p className="text-xs text-slate-500">{species}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-800">{ownerName}</p>
                          <p className="text-xs text-slate-500">{mobile}</p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="text-xs font-semibold text-slate-800 max-w-xs truncate">{diagnosis}</p>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {dateStr}
                      </td>

                      <td className="py-4 px-6">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 border border-green-200 inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Doctor Completed
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedCase(item)}
                          className="bg-slate-900 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading cases...</div>
          ) : filteredCases.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No completed cases found.</div>
          ) : (
            filteredCases.map((item) => {
              const petName = item.petId?.name || item.petId?.petName || item.petName || "Pet";
              const ownerName = item.ownerId?.ownerName || item.ownerName || "Owner";

              return (
                <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800">{petName}</h4>
                    <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-bold">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Owner: {ownerName}</p>
                  <button
                    onClick={() => setSelectedCase(item)}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Consultation
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Case Details Drawer Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  Doctor Consultation Summary
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">
                  {selectedCase.petId?.name || selectedCase.petName || "Pet"} Clinical Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-500 uppercase">Owner Name</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedCase.ownerId?.ownerName || selectedCase.ownerName || "N/A"}</p>
                <p className="text-slate-500 mt-0.5">{selectedCase.ownerId?.mobileNumber || selectedCase.phoneNumber || "N/A"}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-500 uppercase">Confirmed Diagnosis</p>
                <p className="text-sm font-bold text-green-800 mt-1">
                  {selectedCase.diagnosis?.confirmedDiagnosis || selectedCase.diagnosis?.provisionalDiagnosis || "Wellness Check"}
                </p>
              </div>
            </div>

            {selectedCase.treatment?.medicines && (
              <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl space-y-1 text-xs">
                <p className="font-bold text-green-900 uppercase">Prescribed Treatment & Medicines:</p>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedCase.treatment.medicines}</p>
              </div>
            )}

            {selectedCase.suggestion?.dietAdvice && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1 text-xs">
                <p className="font-bold text-blue-900 uppercase">Discharge & Diet Advice:</p>
                <p className="text-slate-700">{selectedCase.suggestion.dietAdvice}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-green-600 transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}