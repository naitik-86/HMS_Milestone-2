import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ReceptionSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: "Dashboard", path: "", icon: "DB" },
    { name: "New Registration", path: "new-registration", icon: "NR" },
    { name: "Create Visit", path: "create-visit", icon: "CV" },
    { name: "Existing Customer", path: "existing-customer", icon: "EC" },

    { name: "Pet History", path: "history", icon: "PH" },
  ];

  return (
    <>
      {!isOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#081122] border-b border-slate-800 z-[999] flex items-center justify-between px-4 shadow-lg">
          <h2 className="text-white font-bold text-lg">
            Reception Module
          </h2>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open reception menu"
            className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white text-xl"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-[280px] sm:w-72 bg-[#081122]
          text-white flex flex-col shadow-2xl z-[1001]
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="relative p-6 border-b border-slate-800">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close reception menu"
            className="md:hidden absolute top-4 right-4 w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white text-xl transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-orange-500 flex items-center justify-center font-bold text-2xl mb-6">
            RC
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Reception
            <br />
            Module
          </h1>

          <p className="text-slate-400 mt-3">
            Veterinary HMS
          </p>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-3">
            {menus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                end={menu.path === ""}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-orange-500 shadow-lg"
                    : "hover:bg-slate-800"
                  }`
                }
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold">
                  {menu.icon}
                </div>

                <span className="font-medium text-lg">
                  {menu.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              RC
            </div>

            <div>
              <h4 className="font-medium">
                Reception
              </h4>

              <p className="text-xs text-slate-400">
                Front Desk Staff
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
