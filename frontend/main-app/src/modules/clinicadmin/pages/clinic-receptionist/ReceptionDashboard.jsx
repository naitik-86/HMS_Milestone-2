import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExistingCustomers,
  getDashboardStats
} from "../../api/receptionApi";
import { 
  Plus, 
  UserCheck, 
  Users, 
  RefreshCw, 
  ChevronRight, 
  Sparkles,
  PawPrint,
  ShieldCheck,
  Building,
  UserPlus
} from "lucide-react";
import toast from "react-hot-toast";
import ExistingCustomerPet from "./ExistingCustomerPet";

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("hub"); // "hub" | "customers"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [dashboardStats, setDashboardStats] = useState({
    todayVisits: 0,
    newPets: 0,
    totalCustomers: 0,
  });

  const fetchData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const statsRes = await getDashboardStats().catch(() => ({ data: {} }));
      const backendStats = statsRes.data || {};

      const customersRes = await getExistingCustomers().catch(() => ({ data: [] }));
      const customers = customersRes.data || [];

      let newPetsTodayCount = 0;
      const todayStr = new Date().toISOString().split("T")[0];

      customers.forEach((item) => {
        const owner = item.owner || {};
        const ownerCreatedDate = owner.createdAt ? owner.createdAt.split("T")[0] : null;
        if (ownerCreatedDate === todayStr) {
          newPetsTodayCount++;
        }
      });

      setDashboardStats({
        todayVisits: backendStats.activeVisits || 0,
        newPets: newPetsTodayCount || backendStats.totalPets || 0,
        totalCustomers: customers.length || backendStats.totalPets || 0,
      });

      if (isManual) toast.success("Front Desk Hub synchronized");
    } catch (error) {
      console.error("Error fetching reception hub data:", error);
      toast.error("Could not sync reception hub data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-bold animate-pulse text-sm">Loading Reception Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ========================================= */}
      {/* CLASSIC ULTRA-MODERN HERO SECTION */}
      {/* ========================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-7 md:p-10 shadow-xl">
        {/* Glow Accents */}
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-extrabold uppercase tracking-widest border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Front Desk Station Live
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              Reception Hub <Sparkles className="w-7 h-7 text-amber-400 animate-bounce" />
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Welcome to the clinical front desk. Seamlessly register new pet patients or inspect existing customer profile records with ease.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-3 rounded-2xl font-bold transition-all text-xs md:text-sm shadow-md cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`w-4 h-4 text-orange-400 ${refreshing ? "animate-spin" : ""}`} />
              <span>Sync Hub</span>
            </button>

            {currentView === "customers" && (
              <button
                onClick={() => setCurrentView("hub")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-2xl text-xs md:text-sm shadow-md transition cursor-pointer border-none"
              >
                Back to Hub Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: MAIN RECEPTION HUB ENTRY */}
      {currentView === "hub" ? (
        <div className="space-y-8">
          {/* KPI STATS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4 transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Customer Records</p>
                <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  {dashboardStats.totalCustomers}
                </h2>
                <span className="inline-block mt-2 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Active Pet Archive
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4 transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">New Registered Today</p>
                <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  {dashboardStats.newPets}
                </h2>
                <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  Fresh Intake Files
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Plus className="w-7 h-7" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4 transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Front Desk Status</p>
                <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  Ready
                </h2>
                <span className="inline-block mt-2 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md">
                  Intake Operations
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* TWO PRIMARY CLASSIC HERO ACTION MODULES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MODULE 1: NEW REGISTRATION */}
            <div 
              onClick={() => navigate("new-registration")}
              className="group relative overflow-hidden rounded-3xl border border-orange-200/90 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[260px]"
            >
              <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 w-44 h-44 bg-orange-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>

              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                    New Patient Registration
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Complete new pet owner registration, record pet species & breed, verify mobile OTP, and initiate patient file.
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <span className="inline-flex items-center gap-2 bg-orange-500 group-hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-orange-500/20 transition-all group-hover:gap-3">
                  <span>Start New Registration</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* MODULE 2: EXISTING CUSTOMER RECORDS */}
            <div 
              onClick={() => setCurrentView("customers")}
              className="group relative overflow-hidden rounded-3xl border border-blue-200/90 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60 p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[260px]"
            >
              <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 w-44 h-44 bg-blue-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>

              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    Existing Customer Records
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Search registered pet owners, filter by species, and inspect complete pet, owner & visit history fields.
                  </p>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <span className="inline-flex items-center gap-2 bg-blue-600 group-hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition-all group-hover:gap-3">
                  <span>View Existing Customers</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: EMBEDDED EXISTING CUSTOMERS PAGE */
        <div className="space-y-4">
          <ExistingCustomerPet />
        </div>
      )}
    </div>
  );
}


