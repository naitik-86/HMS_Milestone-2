import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function DoctorSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "Pending Pets", path: "pending", icon: Clock3 },

    { name: "Completed Pets", path: "completed", icon: CheckCircle2 },

  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed top-0 left-0 right-0 z-[999] flex h-16 items-center justify-between border-b border-slate-800 bg-[#081122] px-4 text-white shadow-lg lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold leading-tight">
                Doctor Module
              </h2>
              <p className="text-xs text-slate-400">
                Existing Customer Pet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open doctor menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white transition hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-[1001] flex h-screen w-[280px] flex-col
          bg-[#081122] text-white shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:z-40 lg:w-72 lg:translate-x-0 lg:border-r lg:border-slate-800 lg:shadow-none
        `}
      >
        <div className="relative border-b border-slate-800 p-6">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close doctor menu"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white transition hover:bg-slate-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500">
            <Stethoscope className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Doctor Module
          </h1>
          <p className="mt-2 text-slate-400">
            Existing Customer Pet
          </p>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === ""}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${isActive
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span className="text-lg font-semibold">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <p className="text-sm text-slate-500">
            Veterinary Management System
          </p>
        </div>
      </aside>
    </>
  );
}
