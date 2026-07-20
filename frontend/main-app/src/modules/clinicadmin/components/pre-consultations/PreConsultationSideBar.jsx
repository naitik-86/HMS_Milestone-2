import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  History,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  Stethoscope
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getPendingPets } from "../../api/preConsultationApi";

export default function PreConsultationSideBar({ isCollapsed = false, toggleCollapse }) {
  const [isOpen, setIsOpen] = useState(false);
  const [staffStatus, setStaffStatus] = useState("Online");
  const [time, setTime] = useState(new Date());
  const [queueCount, setQueueCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Live Queue Stats for sidebar widget
  useEffect(() => {
    const fetchQueueStats = async () => {
      try {
        const res = await getPendingPets();
        setQueueCount(res?.data?.length || 0);
      } catch (err) {
        console.error("Silent error fetching sidebar queue count:", err);
      }
    };
    fetchQueueStats();
    const interval = setInterval(fetchQueueStats, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const menus = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "Pending Assessment", path: "pending", icon: Clock },
    { name: "Completed Assessment", path: "completed", icon: CheckCircle2 },
    { name: "Patient History", path: "history", icon: History },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const toggleStaffStatus = () => {
    setStaffStatus((prev) => (prev === "Online" ? "Away" : "Online"));
  };

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      {/* MOBILE TOP HEADER BAR */}
      {!isOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#090d16] border-b border-slate-800/80 z-[999] flex items-center justify-between px-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              🩺
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              PetVitals <span className="text-orange-400 text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 ml-1">Pre-Consult</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open triage menu"
            className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-white transition hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-[1000] transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR MAIN CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#090d16] text-slate-100 flex flex-col 
          border-r border-slate-800/60 shadow-2xl z-[1001]
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapsed ? "md:w-20" : "md:w-72"}
        `}
      >
        {/* COLLAPSE DESKTOP TOGGLE BUTTON */}
        {toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="hidden md:flex absolute top-8 -right-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 items-center justify-center text-slate-400 hover:text-white cursor-pointer z-50 shadow-md hover:scale-110 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        )}

        {/* BRAND LOGO HEADER */}
        <div className={`relative p-5 border-b border-slate-900 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition border border-slate-700/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              🩺
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wide text-white leading-tight">
                  PetVitals
                </span>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-none mt-0.5">
                  Triage & Vitals
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menus.map((menu) => {
            const IconComponent = menu.icon;
            
            return (
              <NavLink
                key={menu.name}
                to={menu.path}
                end={menu.path === ""}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-gradient-to-r from-orange-600/20 to-orange-500/10 text-orange-400 font-semibold border-l-2 border-orange-500 shadow-[inset_4px_0_12px_rgba(249,115,22,0.05)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-l-2 border-transparent"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <IconComponent className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />

                {!isCollapsed && (
                  <span className="text-sm font-medium tracking-wide">
                    {menu.name}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {menu.name}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* DYNAMIC CLOCK WIDGET */}
          {!isCollapsed && (
            <div className="mt-8 mx-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                <span>Station Time</span>
              </div>
              <div className="text-white text-lg font-bold font-mono tracking-wider leading-none">
                {formattedTime}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <span>{formattedDate}</span>
              </div>
            </div>
          )}

          {/* LIVE TRIAGE QUEUE WIDGET */}
          {!isCollapsed && (
            <div className="mx-2 mt-4 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-orange-400" />
                  <span>Pending Triage</span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              </div>

              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Waiting for Vitals:</span>
                <span className="text-base font-extrabold text-orange-400 font-mono">{queueCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM USER PROFILE & LOGOUT */}
        <div className="p-3 border-t border-slate-900 space-y-3 bg-[#070a11]">
          <div className={`
            flex items-center gap-3 rounded-xl transition-all duration-200
            ${isCollapsed ? "justify-center" : "bg-slate-900/30 border border-slate-900/80 p-2.5"}
          `}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white text-sm border border-slate-700">
                <User className="h-5 w-5 text-slate-300" />
              </div>
              <span className={`
                absolute -bottom-1 -right-1 flex h-3 w-3 rounded-full border-2 border-[#090d16]
                ${staffStatus === "Online" ? "bg-emerald-500" : "bg-amber-500"}
              `}>
                <span className={`
                  animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                  ${staffStatus === "Online" ? "bg-emerald-400" : "bg-amber-400"}
                `}></span>
              </span>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-100 truncate">
                  Triage Staff
                </h4>
                <button
                  onClick={toggleStaffStatus}
                  className="flex items-center gap-1 mt-0.5 text-[10px] font-bold tracking-wide uppercase text-left hover:text-slate-100 transition-colors"
                >
                  <span className={staffStatus === "Online" ? "text-emerald-400" : "text-amber-400"}>
                    {staffStatus}
                  </span>
                  <span className="text-slate-500">• Change</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`
              group flex items-center gap-3 w-full rounded-xl py-3 px-3.5 text-sm font-semibold
              text-red-400/90 transition-all duration-200 hover:text-red-400
              hover:bg-red-500/10 active:bg-red-500/20 border border-transparent hover:border-red-500/20
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            
            {!isCollapsed && (
              <span className="tracking-wide">
                Logout Triage
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
