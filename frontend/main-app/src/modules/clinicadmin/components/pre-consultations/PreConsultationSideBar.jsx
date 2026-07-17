import { useState } from "react";
import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function PreConsulatationSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menus = [
    {
      name: "Dashboard",
      path: "",
      icon: "📊",
    },
    {
      name: "Pending Pets",
      path: "pending",
      icon: "🐾",
    },
    {
      name: "Completed Pets",
      path: "completed",
      icon: "✅",
    },
    {
      name: "History Pets",
      path: "history",
      icon: "📋",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Header - Hide when Sidebar Open */}
      {!isOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#081122] px-4 py-3 text-white shadow-lg md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600">
              🐾
            </div>

            <div>
              <h2 className="text-sm font-bold">VetCare</h2>
              <p className="text-[10px] text-slate-400">
                Pre Consultation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl bg-white/10 p-2 text-xl"
          >
            ☰
          </button>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative
          top-0 md:top-0
          left-0
          z-50
          h-screen
          w-[280px]
          bg-[#081122]
          text-white
          flex flex-col
          overflow-y-auto
          overflow-x-hidden
          shadow-2xl
          transition-transform
          duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 text-3xl">
                🐾
              </div>

              <h1 className="text-2xl font-bold">
                VetCare
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Pre Consultation
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-3xl md:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {menus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                end={menu.path === ""}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-4 transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <span className="text-xl">
                  {menu.icon}
                </span>

                <span className="font-medium">
                  {menu.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="font-semibold">
              Reception Staff
            </p>

            <p className="text-xs text-slate-400">
              Active Module
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
