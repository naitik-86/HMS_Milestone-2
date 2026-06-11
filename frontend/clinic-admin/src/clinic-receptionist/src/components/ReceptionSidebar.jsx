export default function ReceptionSidebar({
  activePage,
  setActivePage,
}) {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "🏠",
    },
    {
      id: "new-registration",
      title: "New Registration Pet",
      icon: "🐾",
    },
    {
      id: "existing-customer",
      title: "Existing Customer Pet",
      icon: "👤",
    },
    {
      id: "history",
      title: "Pet History",
      icon: "📋",
    },
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#0B1324] text-white flex flex-col shadow-xl">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">
          <span className="text-orange-500">
            Clinic
          </span>{" "}
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

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setActivePage(item.id)
              }
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300

              ${
                activePage === item.id
                  ? "bg-orange-500 shadow-lg"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center

                ${
                  activePage === item.id
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
          ))}

        </div>

      </div>

      {/* User */}
      <div className="p-4 border-t border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center font-bold">
            CR
          </div>

          <div>
            <h4 className="font-medium">
              Receptionist
            </h4>

            <p className="text-xs text-slate-400">
              Clinic Staff
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}