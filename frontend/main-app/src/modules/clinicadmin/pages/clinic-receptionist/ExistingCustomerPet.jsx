import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExistingCustomers, updateOwner, updatePet } from "../../api/receptionApi";
import {
  Search,
  UserCheck,
  Eye,
  Edit2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  X,
  PlusCircle,
  FileText,
  User,
  PawPrint,
  Clock,
  Shield,
  Tag,
  Hash,
  CheckCircle2,
  Filter,
  RefreshCw,
  Printer
} from "lucide-react";
import toast from "react-hot-toast";

export default function ExistingCustomerPet() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("ALL");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [viewCustomer, setViewCustomer] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("pet"); // "pet" | "owner" | "visits"
  
  const [editCustomer, setEditCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    ownerName: "",
    mobileNumber: "",
    email: "",
    petName: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchCustomers = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await getExistingCustomers();
      const data = response?.data || response || [];
      setCustomers(Array.isArray(data) ? data : []);
      if (isManualRefresh) toast.success("Customer records updated");
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      toast.error("Failed to load customer records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getSpeciesEmoji = (speciesStr) => {
    const s = (speciesStr || "").toLowerCase();
    if (s.includes("cat") || s.includes("feline")) return "🐱";
    if (s.includes("bird") || s.includes("parrot") || s.includes("avian")) return "🦜";
    if (s.includes("rabbit") || s.includes("bunny")) return "🐇";
    if (s.includes("fish")) return "🐠";
    return "🐶";
  };

  const filteredCustomers = customers.filter((item) => {
    const query = search.toLowerCase().trim();
    const ownerName = item.owner?.ownerName?.toLowerCase() || "";
    const petName = (item.pet?.petName || item.pet?.name || "").toLowerCase();
    const petId = item.pet?.uniquePetId?.toLowerCase() || "";
    const mobile = item.owner?.mobileNumber?.toLowerCase() || "";
    const species = (item.pet?.species || "").toUpperCase();

    const matchesSearch =
      !query ||
      ownerName.includes(query) ||
      petName.includes(query) ||
      petId.includes(query) ||
      mobile.includes(query);

    const matchesSpecies =
      selectedSpecies === "ALL" || species.includes(selectedSpecies);

    return matchesSearch && matchesSpecies;
  });

  const handleOpenEdit = (item) => {
    setEditCustomer(item);
    setEditForm({
      ownerName: item.owner?.ownerName || "",
      mobileNumber: item.owner?.mobileNumber || "",
      email: item.owner?.email || "",
      petName: item.pet?.petName || item.pet?.name || "",
      species: item.pet?.species || "",
      breed: item.pet?.breed || "",
      age: item.pet?.age || "",
      gender: item.pet?.gender || "Male",
    });
  };

  const handleSaveEdit = async () => {
    if (!editCustomer) return;
    try {
      setSavingEdit(true);
      const ownerId = editCustomer.owner?._id;
      const petId = editCustomer.pet?._id;

      if (ownerId) {
        await updateOwner(ownerId, {
          ownerName: editForm.ownerName,
          mobileNumber: editForm.mobileNumber,
          email: editForm.email,
        });
      }

      if (ownerId && petId) {
        await updatePet(ownerId, petId, {
          petName: editForm.petName,
          species: editForm.species,
          breed: editForm.breed,
          age: editForm.age,
          gender: editForm.gender,
        });
      }

      toast.success("Record updated successfully!");
      setEditCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error saving customer edit:", err);
      toast.error("Failed to update record");
    } finally {
      setSavingEdit(false);
    }
  };

  const handlePrintCustomer = (item) => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-r from-white via-orange-50/60 to-amber-50/70 p-6 md:p-8 shadow-xs text-slate-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-orange-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200/80">
              <UserCheck className="w-3.5 h-3.5 text-orange-600" /> Customer Registry & Archive
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              Existing Customer Records
            </h1>
            <p className="mt-1 text-slate-600 text-sm max-w-2xl font-medium">
              Search registered pet owners, inspect complete medical & profile fields, and initiate new clinical visits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchCustomers(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-4 py-2.5 rounded-2xl font-bold transition-all text-xs md:text-sm shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-orange-500 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh Records</span>
            </button>

            <button
              onClick={() => navigate("/clinic/reception/new-registration")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] text-xs md:text-sm cursor-pointer border-none"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Patient Intake</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Owner Name, Pet Name, Pet ID, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-slate-800 shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Species Pills & Count Badge */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
              {["ALL", "DOG", "CAT", "BIRD"].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSelectedSpecies(sp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSpecies === sp
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {sp === "ALL" ? "All Species" : sp === "DOG" ? "Dogs 🐶" : sp === "CAT" ? "Cats 🐱" : "Birds 🦜"}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl">
              Showing <span className="text-orange-600 font-extrabold">{filteredCustomers.length}</span> of {customers.length}
            </span>
          </div>
        </div>

        {/* Content View */}
        <div className="p-5 md:p-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mb-3" />
              <p className="text-sm font-semibold">Loading customer registry records...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-20 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <div className="text-4xl mb-3">🐾</div>
              <h3 className="font-bold text-slate-800 text-base">No Customer Records Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No matching owners or pets were found for your search filters. Try adjusting your query or register a new patient.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredCustomers.map((item, idx) => {
                  const pet = item.pet || {};
                  const owner = item.owner || {};
                  const petName = pet.petName || pet.name || "Unnamed Pet";
                  const ownerName = owner.ownerName || "Unknown Owner";
                  const species = pet.species || "Dog";
                  const petId = pet.uniquePetId || `PET-${(pet._id || "").slice(-4)}`;

                  return (
                    <div
                      key={pet._id || idx}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:border-orange-200 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl">
                            {getSpeciesEmoji(species)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                              {petName}
                            </h3>
                            <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                              {petId}
                            </span>
                          </div>
                        </div>

                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
                          {species}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Owner Name</span>
                          <span className="font-bold text-slate-800 truncate block mt-0.5">{ownerName}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mobile</span>
                          <span className="font-bold text-slate-800 truncate block mt-0.5">{owner.mobileNumber || "N/A"}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Breed</span>
                          <span className="font-bold text-slate-800 truncate block mt-0.5">{pet.breed || "N/A"}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gender / Age</span>
                          <span className="font-bold text-slate-800 truncate block mt-0.5">{pet.gender || "N/A"} • {pet.age || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setViewCustomer(item);
                            setActiveModalTab("pet");
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs border-none cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/70">
                      <th className="text-left py-4 px-4">Pet ID</th>
                      <th className="text-left py-4 px-4">Patient (Pet)</th>
                      <th className="text-left py-4 px-4">Owner Name</th>
                      <th className="text-left py-4 px-4">Species / Breed</th>
                      <th className="text-left py-4 px-4">Contact Phone</th>
                      <th className="text-left py-4 px-4">Gender & Age</th>
                      <th className="text-right py-4 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs md:text-sm font-medium">
                    {filteredCustomers.map((item, idx) => {
                      const pet = item.pet || {};
                      const owner = item.owner || {};
                      const petName = pet.petName || pet.name || "Unnamed Pet";
                      const ownerName = owner.ownerName || "Unknown Owner";
                      const species = pet.species || "Dog";
                      const petId = pet.uniquePetId || `PET-${(pet._id || "").slice(-4)}`;

                      return (
                        <tr
                          key={pet._id || idx}
                          className="hover:bg-orange-50/40 transition-colors group"
                        >
                          <td className="py-4 px-4">
                            <span className="font-mono font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg">
                              {petId}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getSpeciesEmoji(species)}</span>
                              <div>
                                <p className="font-bold text-slate-900">{petName}</p>
                                <p className="text-xs text-slate-400">Reg: {pet.createdAt ? pet.createdAt.split("T")[0] : "Active"}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-semibold text-slate-800">
                            {ownerName}
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-block font-semibold text-slate-800">{species}</span>
                            {pet.breed && <span className="block text-xs text-slate-400">{pet.breed}</span>}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-mono text-slate-700 font-semibold">{owner.mobileNumber || "N/A"}</span>
                          </td>

                          <td className="py-4 px-4 text-slate-600">
                            <span>{pet.gender || "N/A"}</span>
                            {pet.age && <span className="text-xs text-slate-400 block">{pet.age}</span>}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end">
                              {/* ONLY View Details Button in Action */}
                              <button
                                onClick={() => {
                                  setViewCustomer(item);
                                  setActiveModalTab("pet");
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Details</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* 1. COMPREHENSIVE VIEW CUSTOMER MODAL (ALL FIELDS) */}
      {/* ========================================= */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 md:p-6 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-3xl shrink-0">
                  {getSpeciesEmoji(viewCustomer.pet?.species)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">
                      {viewCustomer.pet?.petName || viewCustomer.pet?.name || "Pet Details"}
                    </h2>
                    <span className="bg-orange-500 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                      {viewCustomer.pet?.uniquePetId || "N/A"}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm mt-1 font-medium flex items-center gap-2">
                    <span>Owner: <strong className="text-white">{viewCustomer.owner?.ownerName}</strong></span>
                    <span>• Phone: <strong className="text-white">{viewCustomer.owner?.mobileNumber}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintCustomer(viewCustomer)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl text-xs transition cursor-pointer border border-slate-700 flex items-center gap-1.5 font-bold"
                  title="Print Patient File"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setViewCustomer(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab("pet")}
                className={`px-5 py-3 font-bold text-xs md:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeModalTab === "pet"
                    ? "bg-white text-orange-600 border-orange-500 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 border-transparent"
                }`}
              >
                <PawPrint className="w-4 h-4" />
                <span>Pet Profile</span>
              </button>

              <button
                onClick={() => setActiveModalTab("owner")}
                className={`px-5 py-3 font-bold text-xs md:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeModalTab === "owner"
                    ? "bg-white text-orange-600 border-orange-500 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 border-transparent"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Owner & Address Info</span>
              </button>

              <button
                onClick={() => setActiveModalTab("visits")}
                className={`px-5 py-3 font-bold text-xs md:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeModalTab === "visits"
                    ? "bg-white text-orange-600 border-orange-500 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 border-transparent"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Visit & Medical History ({viewCustomer.pet?.visits?.length || 0})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* TAB 1: PET ALL FIELDS */}
              {activeModalTab === "pet" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Unique Pet ID</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.uniquePetId || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Pet Name</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.petName || viewCustomer.pet?.name || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Species</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.species || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Breed</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.breed || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Gender</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.gender || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Age / Date of Birth</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.age || viewCustomer.pet?.dob || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Color / Coat</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.color || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Sterilized / Spayed</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.sterilized || viewCustomer.pet?.spayed ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Microchip / RFID Tag</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.rfid || viewCustomer.pet?.microchipNumber || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Identification Area</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.identificationArea || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Registration Date</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.pet?.createdAt ? new Date(viewCustomer.pet.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Medical Notes / Allergies Sub-box */}
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-orange-800 tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-orange-600" />
                      Known Medical Notes & Allergies
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {typeof viewCustomer.pet?.history === "string"
                        ? viewCustomer.pet.history
                        : viewCustomer.pet?.history?.notes || "No special allergies or chronic medical conditions registered."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: OWNER ALL FIELDS */}
              {activeModalTab === "owner" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Full Owner Name</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.ownerName || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Primary Mobile Phone</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.mobileNumber || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Alternate Number</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.alternateNumber || viewCustomer.owner?.phoneNumber || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Email Address</span>
                      <span className="font-semibold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.email || "N/A"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Owner ID Proof Type</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.ownerIdType || "Aadhaar / Govt ID"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Registration Date</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {viewCustomer.owner?.createdAt ? new Date(viewCustomer.owner.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Complete Residential Address
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {viewCustomer.owner?.address || "N/A"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                      <span>City: <strong>{viewCustomer.owner?.city || "N/A"}</strong></span>
                      <span>District: <strong>{viewCustomer.owner?.district || "N/A"}</strong></span>
                      <span>State: <strong>{viewCustomer.owner?.state || "N/A"}</strong></span>
                      <span>Pincode: <strong>{viewCustomer.owner?.pincode || "N/A"}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISITS & MEDICAL HISTORY */}
              {activeModalTab === "visits" && (
                <div className="space-y-4">
                  {(!viewCustomer.pet?.visits || viewCustomer.pet.visits.length === 0) ? (
                    <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">No Past Visits Recorded</p>
                      <p className="text-xs text-slate-400 mt-0.5">This patient has no recorded clinical visits yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {viewCustomer.pet.visits.map((v, i) => (
                        <div
                          key={v._id || i}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                                {v.tokenNumber || `TK-${i + 1}`}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {v.appointmentDate ? new Date(v.appointmentDate).toLocaleDateString() : "Date N/A"}
                              </span>
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                {v.status || "Pending"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              Reason: <span className="italic text-slate-800">{v.primaryReason || v.visitType || "General Checkup"}</span>
                            </p>
                          </div>

                          <div className="text-xs text-right self-end sm:self-center">
                            <span className="text-slate-400 block text-[11px]">Assigned Doctor</span>
                            <span className="font-bold text-slate-800">{v.doctorName || "Duty Doctor"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setViewCustomer(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer border-none"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 2. EDIT CUSTOMER MODAL */}
      {/* ========================================= */}
      {editCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center gap-4 mb-6 pb-3 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-orange-500" />
                Edit Customer & Pet Record
              </h2>
              <button
                onClick={() => setEditCustomer(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Owner Name</label>
                <input
                  type="text"
                  value={editForm.ownerName}
                  onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Mobile Phone</label>
                  <input
                    type="text"
                    value={editForm.mobileNumber}
                    onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pet Name</label>
                <input
                  type="text"
                  value={editForm.petName}
                  onChange={(e) => setEditForm({ ...editForm, petName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Species</label>
                  <input
                    type="text"
                    value={editForm.species}
                    onChange={(e) => setEditForm({ ...editForm, species: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Breed</label>
                  <input
                    type="text"
                    value={editForm.breed}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
              <button
                onClick={() => setEditCustomer(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer border-none flex items-center gap-2"
              >
                {savingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}