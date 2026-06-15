import { NavLink } from "react-router-dom";

export default function PreConsulatationSideBar() {
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

  return (
    <div className="w-72 min-h-screen bg-[#081122] text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">VetCare</h1>
        <p className="text-slate-400 text-sm mt-1">
          Pre Consultation
        </p>
      </div>

      {/* Menu */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === ""} // ✅ important for dashboard active state
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${isActive
                  ? "bg-orange-500 text-white"
                  : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              <span className="text-xl">{menu.icon}</span>
              <span className="font-medium">{menu.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          Veterinary Clinic System
        </p>
      </div>
    </div>
  );
}