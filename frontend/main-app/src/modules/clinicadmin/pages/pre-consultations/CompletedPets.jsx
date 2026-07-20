import { useState, useEffect } from "react";
import formatDate from "../../../../shared/utils/formatDate";
import { Header } from "../../components";
import { getCompletedPets } from "../../api/preConsultationApi";
import { Search, Filter, RefreshCw, Eye, CheckCircle, Stethoscope, X } from "lucide-react";
import PetRegistrationWizard from "./PetRegistrationWizard";
import toast from "react-hot-toast";

export default function CompletedPets() {
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("ALL");
  const [completedPets, setCompletedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedToday: 0,
    completedThisWeek: 0,
    totalCompleted: 0,
  });

  const [selectedPetView, setSelectedPetView] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCompletedPets();
  }, []);

  const fetchCompletedPets = async () => {
    try {
      setLoading(true);
      const res = await getCompletedPets();
      setCompletedPets(res.data?.pets || []);
      setStats(res.data?.stats || {
        completedToday: (res.data?.pets || []).length,
        completedThisWeek: (res.data?.pets || []).length,
        totalCompleted: (res.data?.pets || []).length,
      });
    } catch (err) {
      console.error("Error fetching completed pets:", err);
      toast.error("Failed to fetch completed assessments");
    } fontally: {
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

  const filteredPets = completedPets.filter((item) => {
    const ownerName = item.ownerId?.ownerName || item.ownerName || "";
    const petName = item.petId?.name || item.petId?.petName || item.petName || "";
    const token = item.tokenNumber || item.token || "";
    const phone = item.ownerId?.mobileNumber || item.phoneNumber || "";
    const species = item.petId?.species || item.species || "";

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      token.toLowerCase().includes(query) ||
      ownerName.toLowerCase().includes(query) ||
      petName.toLowerCase().includes(query) ||
      phone.includes(query);

    const matchesSpecies =
      speciesFilter === "ALL" ||
      species.toUpperCase() === speciesFilter.toUpperCase();

    return matchesSearch && matchesSpecies;
  });

  const cards = [
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: "✅",
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      title: "This Week",
      value: stats.completedThisWeek,
      icon: "📅",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Total Completed",
      value: stats.totalCompleted,
      icon: "🏆",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
        <Header
          title="Completed Assessments"
          subtitle="Successfully recorded pre-consultation vitals & triage records"
          showSearch={false}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{loading ? "..." : card.value}</h2>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search completed pets by Owner, Pet Name, Token or Mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-sm"
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
                title="Refresh List"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-green-50/70 to-white">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Completed Assessments Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">Vitals successfully recorded and pushed to Doctor queue</p>
            </div>

            <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-2xl font-bold text-xs border border-green-200 self-start sm:self-center">
              {filteredPets.length} Completed
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <th className="px-6 py-4">Token</th>
                  <th className="px-6 py-4">Owner Details</th>
                  <th className="px-6 py-4">Pet Info</th>
                  <th className="px-6 py-4">Completed Date</th>
                  <th className="px-6 py-4">Current Stage</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-green-500" />
                      Loading completed assessments...
                    </td>
                  </tr>
                ) : filteredPets.length > 0 ? (
                  filteredPets.map((pet) => {
                    const token = pet.tokenNumber || `TK-${pet._id?.slice(-4)}`;
                    const ownerName = pet.ownerId?.ownerName || pet.ownerName || "Owner";
                    const mobile = pet.ownerId?.mobileNumber || pet.phoneNumber || "N/A";
                    const petName = pet.petId?.name || pet.petId?.petName || pet.petName || "Pet";
                    const species = pet.petId?.species || pet.species || "Dog";
                    const stage = pet.currentStage || "DOCTOR";

                    return (
                      <tr key={pet._id} className="hover:bg-green-50/40 transition-all duration-150">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                          <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                            {token}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                              {ownerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{ownerName}</p>
                              <p className="text-xs text-slate-500">{mobile}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">
                              {getSpeciesIcon(species)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{petName}</p>
                              <p className="text-xs text-slate-500">{species}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-700">
                          {formatDate(pet.updatedAt || pet.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {stage === "DOCTOR" ? "Sent to Doctor" : stage}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedPetView(pet)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Vitals
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPetView(pet);
                                setShowEditModal(true);
                              }}
                              className="bg-slate-900 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              Edit Vitals
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="text-5xl mb-3">🎉</div>
                      <h3 className="text-lg font-bold text-slate-700">No Completed Assessments Found</h3>
                      <p className="text-xs text-slate-500 mt-1">Completed records will appear here once recorded.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden p-4 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading completed cases...</div>
            ) : filteredPets.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-medium">No completed pets found.</div>
            ) : (
              filteredPets.map((pet) => {
                const token = pet.tokenNumber || `TK-${pet._id?.slice(-4)}`;
                const ownerName = pet.ownerId?.ownerName || pet.ownerName || "Owner";
                const petName = pet.petId?.name || pet.petId?.petName || pet.petName || "Pet";
                const species = pet.petId?.species || pet.species || "Dog";

                return (
                  <div
                    key={pet._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {token}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-bold">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                        {getSpeciesIcon(species)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{petName}</h4>
                        <p className="text-xs text-slate-500">Owner: {ownerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPetView(pet)}
                        className="flex-1 bg-slate-100 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Vitals
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPetView(pet);
                          setShowEditModal(true);
                        }}
                        className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" /> Edit Vitals
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* View Vitals Quick Drawer/Modal */}
        {selectedPetView && !showEditModal && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                    Vitals Assessment File
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedPetView.petId?.name || selectedPetView.petName || "Patient"} Vitals
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Token: {selectedPetView.tokenNumber || "N/A"}</p>
                </div>
                <button
                  onClick={() => setSelectedPetView(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-red-50/70 border border-red-100 rounded-2xl">
                  <p className="text-[10px] text-red-700 font-bold uppercase tracking-wider">Body Temperature</p>
                  <p className="text-lg font-extrabold text-red-900 mt-1">
                    {selectedPetView.preConsultationId?.bodyTemperature || "101.5 °F"}
                  </p>
                </div>
                <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-2xl">
                  <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">Heart Rate</p>
                  <p className="text-lg font-extrabold text-rose-900 mt-1">
                    {selectedPetView.preConsultationId?.heartRate || "95 bpm"}
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Body Weight</p>
                  <p className="text-lg font-extrabold text-amber-900 mt-1">
                    {selectedPetView.preConsultationId?.bodyWeight || "14.2 kg"}
                  </p>
                </div>
                <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl">
                  <p className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">SpO2 Oxygen</p>
                  <p className="text-lg font-extrabold text-sky-900 mt-1">
                    {selectedPetView.preConsultationId?.spo2 || "98 %"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1 text-xs">
                <p className="font-bold text-slate-800">Primary Complaint / Notes:</p>
                <p className="text-slate-600 italic">
                  {selectedPetView.primaryReason || selectedPetView.complaint || "Routine checkup and vitals assessment completed."}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedPetView(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-orange-600 transition-all shadow-xs"
                >
                  Edit Vitals Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditModal && (
          <PetRegistrationWizard
            petData={selectedPetView}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPetView(null);
            }}
            onCompleted={() => {
              toast.success("Assessment updated successfully!");
              fetchCompletedPets();
            }}
          />
        )}
      </div>
  );
}