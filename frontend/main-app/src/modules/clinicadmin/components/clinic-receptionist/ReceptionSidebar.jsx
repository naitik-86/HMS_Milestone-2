import { useNavigate, useLocation } from "react-router-dom";

export default function ReceptionSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: "/clinic/reception",
      title: "Dashboard",
      icon: "🏠",
    },
    {
      path: "/clinic/reception/new-registration",
      title: "New Registration Pet",
      icon: "🐾",
    },
    {
      path: "/clinic/reception/existing-customer",
      title: "Existing Customer Pet",
      icon: "👤",
    },
    {
      path: "/clinic/reception/history",
      title: "Pet History",
      icon: "📋",
    },
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#0B1324] text-white flex flex-col shadow-xl">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">
          <span className="text-orange-500">Clinic</span>{" "}
          Reception
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Veterinary Management System
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
          Navigation
        </p>

        <div className="space-y-3">
          {menuItems.map((item) => {
            let isActive = false;

            // 🔥 Dashboard → exact match only
            if (item.path === "/clinic/reception") {
              isActive = location.pathname === item.path;
            }
            // 🔥 Others → support nested routes
            else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                ${isActive
                    ? "bg-orange-500 shadow-lg"
                    : "bg-slate-800 hover:bg-slate-700"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${isActive
                      ? "bg-orange-400"
                      : "bg-slate-700"
                    }`}
                >
                  {item.icon}
                </div>

                <span className="font-medium">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center font-bold">
            CR
          </div>

          <div>
            <h4 className="font-medium">Receptionist</h4>
            <p className="text-xs text-slate-400">
              Clinic Staff
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}