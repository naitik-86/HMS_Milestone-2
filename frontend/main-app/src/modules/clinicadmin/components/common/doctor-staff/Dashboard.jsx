import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  PawPrint,
  Stethoscope,
  RefreshCw,
  Search,
  ChevronRight,
  UserCheck,
  Activity,
  FileText,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { getDashboard, getPendingPets, getCompletedPets } from "../../../api/doctorModuleApi";
import toast from "react-hot-toast";

export default function Dashboard({ setActiveStep }) {
  const [dashboard, setDashboard] = useState({
    totalPets: 0,
    pendingPets: 0,
    completedPets: 0,
    todaysVisits: 0,
    recentActivity: [],
  });

  const [pendingQueue, setPendingQueue] = useState([]);
  const [completedCases, setCompletedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch backend dashboard overview
      const dashRes = await getDashboard().catch(() => null);
      const dashData = dashRes?.dashboard || dashRes?.data || {};

      // 2. Fetch live pending queue
      const pendingRes = await getPendingPets().catch(() => ({ data: [] }));
      const pendingList = pendingRes?.data || [];

      // 3. Fetch completed pets
      const completedRes = await getCompletedPets().catch(() => ({ pets: [], stats: {} }));
      const completedList = completedRes?.pets || completedRes?.data?.pets || [];

      setDashboard({
        totalPets: dashData.totalPets || (pendingList.length + completedList.length),
        pendingPets: pendingList.length || dashData.pendingPets || 0,
        completedPets: completedList.length || dashData.completedPets || 0,
        todaysVisits: dashData.todaysVisits || (pendingList.length + completedList.length),
        recentActivity: dashData.recentActivity || completedList.slice(0, 5),
      });

      setPendingQueue(pendingList);
      setCompletedCases(completedList.slice(0, 4));
    } catch (error) {
      console.error("Error fetching doctor dashboard data:", error);
      toast.error("Could not sync doctor dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getSpeciesIcon = (species) => {
    const s = (species || "").toLowerCase();
    if (s.includes("cat")) return "🐱";
    if (s.includes("bird") || s.includes("parrot")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐶";
  };

  const filteredQueue = pendingQueue.filter((item) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const token = (item.tokenNumber || "").toLowerCase();
    const ownerName = (item.owner?.ownerName || item.ownerName || "").toLowerCase();
    const petName = (item.pet?.petName || item.petName || "").toLowerCase();
    const phone = (item.owner?.mobileNumber || item.phoneNumber || "").toLowerCase();
    return token.includes(query) || ownerName.includes(query) || petName.includes(query) || phone.includes(query);
  });

  const stats = [
    {
      title: "Today's Consultations",
      value: dashboard.todaysVisits,
      icon: PawPrint,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      badge: "Total Expected",
    },
    {
      title: "Pending Patients",
      value: dashboard.pendingPets,
      icon: Clock3,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      badge: "Waiting for Doctor",
    },
    {
      title: "Completed Cases",
      value: dashboard.completedPets,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 border-green-100",
      badge: "Prescriptions Done",
    },
    {
      title: "Registered Patients",
      value: dashboard.totalPets,
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      badge: "Patient Archive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-r from-white via-orange-50/60 to-amber-50/70 p-6 md:p-8 shadow-xs text-slate-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-orange-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 border border-orange-200/80">
              <Activity className="w-3.5 h-3.5 text-orange-600" /> Doctor Workspace Live
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              Welcome Back, Doctor 🩺
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base max-w-2xl font-medium">
              Examine waiting patients, review vitals from pre-consultation, record clinical diagnoses, and prescribe treatments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-5 py-3 rounded-2xl font-bold transition-all text-xs md:text-sm shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 text-orange-500 ${refreshing ? "animate-spin" : ""}`} />
              <span>Sync Hub</span>
            </button>

            {setActiveStep && (
              <button
                onClick={() => setActiveStep("pendingPets")}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] text-xs md:text-sm"
              >
                <span>Consult Patients ({dashboard.pendingPets})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.title}</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                  {loading ? "..." : item.value}
                </h2>
                <span className="inline-block mt-2 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              </div>
              <div className={`flex h-13 w-13 items-center justify-center rounded-2xl border ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Waiting Patients Queue & Clinical Quick Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Waiting Patients Queue */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-50/40 to-white">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-orange-500" />
                Live Patients Waiting for Doctor
              </h2>
              <p className="text-xs text-slate-500 mt-1">Pre-consultation completed & ready for medical examination</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, owner, token..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-orange-500 transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="p-5 flex-1">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
                <p className="text-sm">Loading live patient queue...</p>
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="py-16 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <div className="text-4xl mb-3">🩺</div>
                <h3 className="font-bold text-slate-700">No Waiting Patients in Queue</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  All waiting patients have completed doctor consultations! New pre-consulted patients will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQueue.map((item) => {
                  const petName = item.pet?.petName || item.petName || "Pet";
                  const species = item.pet?.species || item.species || "Dog";
                  const ownerName = item.owner?.ownerName || item.ownerName || "Owner";
                  const token = item.tokenNumber || `TK-${item._id?.slice(-4) || "00"}`;
                  const temp = item.preConsultationId?.bodyTemperature || item.vitals?.temp || "101.5 °F";
                  const weight = item.preConsultationId?.bodyWeight || item.vitals?.weight || "14 kg";
                  const reason = item.primaryReason || item.reason || "General Consultation";

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200/70 transition-all gap-4 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                          {getSpeciesIcon(species)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">{petName}</span>
                            <span className="bg-slate-900 text-white text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
                              {token}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              Vitals Ready
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Owner: <span className="font-semibold text-slate-700">{ownerName}</span> • Temp: <span className="font-semibold text-slate-700">{temp}</span> • Weight: <span className="font-semibold text-slate-700">{weight}</span>
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5 font-medium truncate max-w-md">
                            Complaint: <span className="italic text-slate-800">{reason}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                        {setActiveStep && (
                          <button
                            onClick={() => setActiveStep("pendingPets")}
                            className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-4 h-4" />
                            Examine Patient
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Modules & Recent Cases Panel */}
        <div className="space-y-6">
          {/* Quick Doctor Modules */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              Doctor Module Panel
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setActiveStep && setActiveStep("pendingPets")}
                className="w-full flex items-center justify-between bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 p-4 rounded-2xl text-orange-950 font-bold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    ⏳
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold">Pending Patients</p>
                    <p className="text-xs text-orange-700 font-normal">Examine pending queue ({dashboard.pendingPets})</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveStep && setActiveStep("completedPets")}
                className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100/80 border border-green-200/80 p-4 rounded-2xl text-green-950 font-bold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    ✅
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold">Completed Cases</p>
                    <p className="text-xs text-green-700 font-normal">Review prescriptions & notes ({dashboard.completedPets})</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveStep && setActiveStep("history")}
                className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 p-4 rounded-2xl text-blue-950 font-bold transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    📚
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-extrabold">Patient Medical History</p>
                    <p className="text-xs text-blue-700 font-normal">Audit historical treatments ({dashboard.totalPets})</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Consultations Feed */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Recent Consultations
              </h3>
              {setActiveStep && (
                <button
                  onClick={() => setActiveStep("completedPets")}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {completedCases.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-100">
                  No recent completed cases recorded today.
                </div>
              ) : (
                completedCases.map((item) => {
                  const petName = item.petId?.name || item.petId?.petName || item.petName || "Patient";
                  const ownerName = item.ownerId?.ownerName || item.ownerName || "Owner";
                  const diagnosis = item.diagnosis?.confirmedDiagnosis || item.diagnosis?.provisionalDiagnosis || "Completed";

                  return (
                    <div key={item._id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{petName}</span>
                        <span className="text-slate-400 font-normal"> ({ownerName})</span>
                        <p className="text-slate-500 text-[11px] mt-0.5 truncate max-w-xs">{diagnosis}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold border border-green-200 shrink-0">
                        Done
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}