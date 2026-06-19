import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function LabSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      id: "/clinic/lab",
      label: "Dashboard",
      icon: "📊",
    },
    {
      id: "/clinic/lab/upload",
      label: "Lab Reports",
      icon: "🧪",
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#020B2D] px-4 py-4 text-white shadow-lg lg:hidden">
        <h2 className="font-bold">
          Lab Panel
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-white/10 p-2"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen
          w-[240px]
          bg-[#020B2D]
          text-white
          transition-transform
          duration-300
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="border-b border-white/10 p-6">
          <h2 className="text-2xl font-bold">
            <span className="text-orange-500">
              Lab
            </span>{" "}
            Panel
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Veterinary Laboratory
          </p>
        </div>

        {/* Menu */}
        <div className="p-4">
          {menus.map((item) => {
            const isActive =
              location.pathname === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setIsOpen(false);
                }}
                className={`
          flex
          items-center
          gap-3
          w-full
          px-4
          py-3
          mb-2
          rounded-xl
          transition-all
          text-left
          ${isActive
                    ? "bg-orange-500/20 text-orange-500 border-l-4 border-orange-500"
                    : "text-slate-300 hover:bg-white/5"
                  }
        `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        {/* Bottom Card */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
                LB
              </div>

              <div>
                <p className="font-semibold">
                  Lab Technician
                </p>

                <p className="text-xs text-slate-400">
                  Active Module
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}