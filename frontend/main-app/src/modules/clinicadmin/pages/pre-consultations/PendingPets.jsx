import { useState, useEffect } from "react";
import { Header } from "../../components";
import PetRegistrationWizard from "./PetRegistrationWizard";
import { getPendingPets } from "../../api/preConsultationApi";
import { Search, Filter, Stethoscope, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function PendingPets() {
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("ALL");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPets();
  }, []);

  const fetchPendingPets = async () => {
    try {
      setLoading(true);
      const res = await getPendingPets();
      setPets(res.data || []);
    } catch (err) {
      console.error("Error fetching pending pets:", err);
      toast.error("Failed to load pending queue");
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

  const filteredPets = pets.filter((petItem) => {
    const ownerName = petItem.owner?.ownerName || petItem.ownerName || "";
    const petName = petItem.pet?.petName || petItem.petName || "";
    const token = petItem.tokenNumber || petItem.token || "";
    const phone = petItem.owner?.mobileNumber || petItem.phoneNumber || "";
    const species = petItem.pet?.species || petItem.species || "";

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

  return (
    <div className="space-y-6">
        <Header
          title="Pending Pets Queue"
          subtitle="Manage pending triage assessments and record vitals"
          showSearch={false}
        />

        {/* Search & Species Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Token, Owner Name, Phone Number or Pet Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-sm"
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
                onClick={fetchPendingPets}
                className="p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-slate-700 transition-all"
                title="Refresh List"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table / Mobile Cards */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-orange-50/70 to-white">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pending Assessments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a pet to open and submit pre-consultation vitals</p>
            </div>

            <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-2xl font-bold text-xs border border-orange-200 self-start sm:self-center">
              {filteredPets.length} Patients Waiting
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
                  <th className="px-6 py-4">Complaint / Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
                      Loading pending pets queue...
                    </td>
                  </tr>
                ) : filteredPets.length > 0 ? (
                  filteredPets.map((petItem) => {
                    const token = petItem.tokenNumber || `TK-${petItem._id?.slice(-4)}`;
                    const ownerName = petItem.owner?.ownerName || petItem.ownerName || "Unknown Owner";
                    const mobile = petItem.owner?.mobileNumber || petItem.phoneNumber || "N/A";
                    const petName = petItem.pet?.petName || petItem.petName || "Pet";
                    const species = petItem.pet?.species || petItem.species || "Dog";
                    const breed = petItem.pet?.breed || petItem.breed || "Standard";
                    const complaint = petItem.primaryReason || petItem.complaint || "General Pre-Checkup";

                    return (
                      <tr key={petItem._id} className="hover:bg-orange-50/40 transition-all duration-150">
                        {/* Token */}
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                          <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                            {token}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                              {ownerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{ownerName}</p>
                              <p className="text-xs text-slate-500">{mobile}</p>
                            </div>
                          </div>
                        </td>

                        {/* Pet */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">
                              {getSpeciesIcon(species)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{petName}</p>
                              <p className="text-xs text-slate-500">{species} • {breed}</p>
                            </div>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-slate-700 max-w-xs truncate">{complaint}</p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Pending Assessment
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedPet(petItem);
                              setOpenModal(true);
                            }}
                            className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs inline-flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Record Vitals
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="text-5xl mb-3">🐾</div>
                      <h3 className="text-lg font-bold text-slate-700">No Matching Pending Pets</h3>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting search query or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden p-4 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading pending pets...</div>
            ) : filteredPets.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-medium">No pending pets found.</div>
            ) : (
              filteredPets.map((petItem) => {
                const token = petItem.tokenNumber || `TK-${petItem._id?.slice(-4)}`;
                const ownerName = petItem.owner?.ownerName || petItem.ownerName || "Unknown Owner";
                const mobile = petItem.owner?.mobileNumber || petItem.phoneNumber || "N/A";
                const petName = petItem.pet?.petName || petItem.petName || "Pet";
                const species = petItem.pet?.species || petItem.species || "Dog";

                return (
                  <div
                    key={petItem._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {token}
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-bold">
                        Pending Vitals
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                        {getSpeciesIcon(species)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{petName}</h4>
                        <p className="text-xs text-slate-500">Owner: {ownerName} ({mobile})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPet(petItem);
                        setOpenModal(true);
                      }}
                      className="w-full bg-slate-900 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Record / Edit Vitals
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pre Consultation Assessment Edit / Create Form Modal */}
        {openModal && (
          <PetRegistrationWizard
            petData={selectedPet}
            onClose={() => {
              setOpenModal(false);
              setSelectedPet(null);
            }}
            onCompleted={() => {
              toast.success("Pre-consultation assessment saved successfully!");
              fetchPendingPets();
            }}
          />
        )}
      </div>
  );
}