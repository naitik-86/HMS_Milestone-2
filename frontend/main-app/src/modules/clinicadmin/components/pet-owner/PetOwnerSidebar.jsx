import { Link, useLocation } from "react-router-dom";

const PetOwnerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/clinic/owner",
      icon: "🏠",
    },
    {
      name: "History",
      path: "/clinic/owner/history",
      icon: "📋",
    },
    {
      name: "Upload Documents",
      path: "/clinic/owner/upload",
      icon: "📄",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#020B2D] text-white shadow-2xl z-50">
      {/* Logo */}
      <div className="border-b border-white/10 p-6">
        <div className="mb-4 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 text-3xl">
          🐾
        </div>

        <h2 className="text-2xl font-bold">
          Pet Owner
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Healthcare Portal
        </p>
      </div>

      {/* Menu */}
      <div className="p-4">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                mb-3 flex items-center gap-3 rounded-2xl px-5 py-4
                transition-all duration-300
                ${
                  active
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/10"
                }
              `}
            >
              <span>{item.icon}</span>
              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default PetOwnerSidebar;