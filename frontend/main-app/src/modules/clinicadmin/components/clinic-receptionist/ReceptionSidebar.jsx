import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  UserPlus, 
  CalendarCheck, 
  Users, 
  History, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  Circle,
  HelpCircle,
  Activity,
  Sparkles
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getDashboardStats } from "../../api/receptionApi";

export default function ReceptionSidebar({ isCollapsed = false, toggleCollapse }) {
  const [isOpen, setIsOpen] = useState(false);
  const [staffStatus, setStaffStatus] = useState("Online"); // "Online" | "Away"
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    activeVisits: 0,
    pendingVisits: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Stats for the Mini-Widget
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await getDashboardStats();
        if (response && response.data) {
          setStats({
            activeVisits: response.data.activeVisits || 0,
            pendingVisits: response.data.pendingVisits || 0,
          });
        }
      } catch (error) {
        console.error("Silent error fetching sidebar statistics:", error);
      }
    };

    fetchStats();
    // Poll every 30 seconds for live updates
    const statsInterval = setInterval(fetchStats, 30000);
    return () => clearInterval(statsInterval);
  }, [location.pathname]); // refetch on navigation too

  const menus = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "New Registration", path: "new-registration", icon: UserPlus },
    { name: "Existing Customer", path: "existing-customer", icon: Users },
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

  // Formatted Time and Date
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      {/* MOBILE TOP BAR */}
      {!isOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1d] border-b border-slate-800/80 z-[999] flex items-center justify-between px-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              🐾
            </div>
            <span className="text-white font-bold text-lg font-['Syne'] tracking-wide">
              PetVitals <span className="text-orange-500 text-xs font-medium uppercase px-1.5 py-0.5 rounded-full bg-orange-500/10 ml-1 border border-orange-500/20">Reception</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open reception menu"
            className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-white transition hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] transition-opacity duration-300"
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
        {/* COLLAPSE FLAGGED TOGGLE BUTTON (DESKTOP ONLY) */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute top-8 -right-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 items-center justify-center text-slate-400 hover:text-white cursor-pointer z-50 shadow-md hover:scale-110 transition-all duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* LOGO AREA */}
        <div className={`relative p-5 border-b border-slate-900 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {/* Close button for mobile drawer */}
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close reception menu"
              className="md:hidden absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition border border-slate-700/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_rgba(249,115,22,0.25)]">
              🐾
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg font-['Syne'] tracking-wide text-white leading-tight flex items-center">
                  PetVitals
                </span>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-none mt-0.5">
                  Reception Desk
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NAV LINKS */}
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
                <IconComponent className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105`} />

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

          {/* DYNAMIC TIME & DATE WIDGET (Expanded only) */}
          {!isCollapsed && (
            <div className="mt-8 mx-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                <span>Local Time</span>
              </div>
              <div className="text-white text-lg font-bold font-mono tracking-wider leading-none">
                {formattedTime}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>
          )}

          {/* QUEUE STATUS MINI WIDGET (Expanded only) */}
          {!isCollapsed && (
            <div className="mx-2 mt-4 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Live Queue</span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-900">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active</p>
                  <p className="text-base font-extrabold text-emerald-400 mt-0.5">{stats.activeVisits}</p>
                </div>
                <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-900">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pending</p>
                  <p className="text-base font-extrabold text-orange-400 mt-0.5">{stats.pendingVisits}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM USER PANEL & LOGOUT */}
        <div className="p-3 border-t border-slate-900 space-y-3 bg-[#070a11]">
          {/* USER PROFILE CARD */}
          <div className={`
            flex items-center gap-3 rounded-xl transition-all duration-200
            ${isCollapsed ? "justify-center" : "bg-slate-900/30 border border-slate-900/80 p-2.5"}
          `}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white text-sm border border-slate-700">
                <User className="h-5 w-5 text-slate-300" />
              </div>
              
              {/* Pulsing Status Dot */}
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
                  Reception Staff
                </h4>
                
                {/* Status selector / indicator button */}
                <button 
                  onClick={toggleStaffStatus}
                  className="flex items-center gap-1 mt-0.5 text-[10px] font-bold tracking-wide uppercase hover:text-slate-100 transition-colors text-left"
                  title="Click to toggle status"
                >
                  <span className={staffStatus === "Online" ? "text-emerald-400" : "text-amber-400"}>
                    {staffStatus}
                  </span>
                  <span className="text-slate-500">• Change</span>
                </button>
              </div>
            )}
          </div>

          {/* LOGOUT BUTTON */}
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
                Logout Desk
              </span>
            )}

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-red-950 text-red-300 text-xs font-semibold rounded-lg shadow-xl border border-red-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                Logout Desk
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
