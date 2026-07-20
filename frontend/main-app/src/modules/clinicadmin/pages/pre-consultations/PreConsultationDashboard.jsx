import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getPendingPets, getCompletedPets } from "../../api/preConsultationApi";
import PetRegistrationWizard from "./PetRegistrationWizard";
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  UserCheck, 
  ClipboardList, 
  Stethoscope, 
  FileText 
} from "lucide-react";
import toast from "react-hot-toast";

export default function PreConsultationDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayPatients: 0,
    vitalsPending: 0,
    observations: 0,
    completed: 0,
  });
  const [todaysQueue, setTodaysQueue] = useState([]);
  const [recentCompleted, setRecentCompleted] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPetForAssessment, setSelectedPetForAssessment] = useState(null);
  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch dashboard metrics
      const dashRes = await getDashboard().catch(() => null);
      
      // 2. Fetch pending queue
      const pendingRes = await getPendingPets().catch(() => ({ data: [] }));
      const pendingList = pendingRes.data || [];

      // 3. Fetch completed pets
      const completedRes = await getCompletedPets().catch(() => ({ data: { pets: [], stats: {} } }));
      const completedList = completedRes.data?.pets || [];
      const completedStats = completedRes.data?.stats || {};

      let todayPatientsCount = pendingList.length + (completedStats.completedToday || 0);
      let vitalsPendingCount = pendingList.length;
      let severeObservationsCount = pendingList.filter(p => p.priority === "High" || p.severity === "Severe").length;
      let completedTodayCount = completedStats.completedToday || 0;

      if (dashRes?.data?.cards) {
        todayPatientsCount = dashRes.data.cards.todayPatients || todayPatientsCount;
        vitalsPendingCount = dashRes.data.cards.vitalsPending || vitalsPendingCount;
        severeObservationsCount = dashRes.data.cards.observations || severeObservationsCount;
        completedTodayCount = dashRes.data.cards.completed || completedTodayCount;
      }

      setStats({
        todayPatients: todayPatientsCount,
        vitalsPending: vitalsPendingCount,
        observations: severeObservationsCount,
        completed: completedTodayCount,
      });

      setTodaysQueue(pendingList);
      setRecentCompleted(completedList.slice(0, 5));
    } catch (err) {
      console.error("Error loading pre-consultation dashboard data:", err);
      toast.error("Could not sync dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const filteredQueue = todaysQueue.filter((item) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const token = (item.tokenNumber || "").toLowerCase();
    const ownerName = (item.owner?.ownerName || item.ownerName || "").toLowerCase();
    const petName = (item.pet?.petName || item.petName || "").toLowerCase();
    const phone = (item.owner?.mobileNumber || item.phoneNumber || "").toLowerCase();
    return token.includes(query) || ownerName.includes(query) || petName.includes(query) || phone.includes(query);
  });

  const getSpeciesIcon = (species) => {
    const s = (species || "").toLowerCase();
    if (s.includes("cat")) return "🐱";
    if (s.includes("bird") || s.includes("parrot")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐶";
  };

  const cards = [
    {
      title: "Today's Patients",
      value: stats.todayPatients,
      icon: "🐾",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      trend: "Total Intake",
    },
    {
      title: "Vitals Pending",
      value: stats.vitalsPending,
      icon: "❤️",
      color: "bg-orange-50 text-orange-600 border-orange-100",
      trend: "Action Required",
    },
    {
      title: "Severe / Observations",
      value: stats.observations,
      icon: "👀",
      color: "bg-purple-50 text-purple-600 border-purple-100",
      trend: "High Priority",
    },
    {
      title: "Completed Today",
      value: stats.completed,
      icon: "✅",
      color: "bg-green-50 text-green-600 border-green-100",
      trend: "Sent to Doctor",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-r from-white via-orange-50/60 to-amber-50/70 p-6 md:p-8 shadow-xs text-slate-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-orange-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 border border-orange-200/80">
              <Stethoscope className="w-3.5 h-3.5 text-orange-600" /> Pre-Consultation Station
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Welcome Back, Triage Staff 👋
            </h1>
            <p className="text-slate-600 mt-2 text-sm md:text-base max-w-2xl font-medium">
              Real-time management of pet vitals, health histories, primary complaints, and doctor workflow queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all text-xs md:text-sm shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 text-orange-500 ${refreshing ? "animate-spin" : ""}`} />
              <span>Sync Queue</span>
            </button>
            <button
              onClick={() => navigate("/clinic/preconsultation/pending")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] text-xs md:text-sm"
            >
              <span>Assess Patients ({stats.vitalsPending})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                  <h2 className="text-3xl font-extrabold mt-2 text-slate-800 tracking-tight">
                    {loading ? "..." : card.value}
                  </h2>
                  <span className="inline-block text-xs font-semibold mt-2 text-slate-500">
                    {card.trend}
                  </span>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's Queue Section */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Live Pending Assessment Queue
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pets waiting for pre-consultation vitals recording
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter queue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
                  <p className="text-sm">Loading pending queue...</p>
                </div>
              ) : filteredQueue.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="text-4xl mb-3">🐾</div>
                  <h3 className="font-bold text-slate-700">No Patients in Pending Queue</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All registered pets have completed pre-consultation assessments.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQueue.map((item) => {
                    const petName = item.pet?.petName || item.petName || "Pet";
                    const species = item.pet?.species || item.species || "Dog";
                    const ownerName = item.owner?.ownerName || item.ownerName || "Owner";
                    const token = item.tokenNumber || `TK-${item._id?.slice(-4) || "00"}`;

                    return (
                      <div
                        key={item._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-orange-50/40 rounded-2xl border border-slate-100 transition-all gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-2xl shrink-0">
                            {getSpeciesIcon(species)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-base">{petName}</span>
                              <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold">
                                {token}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Owner: <span className="font-medium text-slate-700">{ownerName}</span> ({item.owner?.mobileNumber || item.phoneNumber || "N/A"})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                            Pending Vitals
                          </span>
                          <button
                            onClick={() => {
                              setSelectedPetForAssessment(item);
                              setOpenAssessmentModal(true);
                            }}
                            className="bg-slate-900 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Take Assessment
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Tools */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-500" />
                Quick Navigation
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/clinic/preconsultation/pending")}
                  className="w-full flex items-center justify-between bg-orange-50 hover:bg-orange-100 border border-orange-200 p-4 rounded-2xl text-orange-900 font-semibold transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Pending Assessments</p>
                      <p className="text-xs text-orange-700 font-normal">View waiting room list</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-600" />
                </button>

                <button
                  onClick={() => navigate("/clinic/preconsultation/completed")}
                  className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-2xl text-green-900 font-semibold transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Completed Cases</p>
                      <p className="text-xs text-green-700 font-normal">Vitals recorded & submitted</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-green-600" />
                </button>

                <button
                  onClick={() => navigate("/clinic/preconsultation/history")}
                  className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-2xl text-blue-900 font-semibold transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Pet History Archive</p>
                      <p className="text-xs text-blue-700 font-normal">Search past visits</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* Recent Activity Mini Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Recent Completed Assessments
              </h2>

              {recentCompleted.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl">
                  No completed assessments recorded today yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentCompleted.slice(0, 4).map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {record.petId?.name || record.petName || "Pet"} ({record.tokenNumber || "TK"})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Owner: {record.ownerId?.ownerName || record.ownerName || "Owner"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Ready for Doctor
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Edit / Create Form Modal */}
        {openAssessmentModal && (
          <PetRegistrationWizard
            petData={selectedPetForAssessment}
            onClose={() => {
              setOpenAssessmentModal(false);
              setSelectedPetForAssessment(null);
            }}
            onCompleted={() => {
              toast.success("Pre-consultation assessment saved successfully!");
              fetchDashboardData();
            }}
          />
        )}
      </div>
  );
}
