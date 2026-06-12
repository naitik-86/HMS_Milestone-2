export default function DoctorSidebar({
  activeStep,
  setActiveStep,
}) {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "📊",
    },
    {
      id: "pendingPets",
      title: "Pending Pets",
      icon: "⏳",
    },
    {
      id: "completedPets",
      title: "Completed Pets",
      icon: "✅",
    },
    {
      id: "history",
      title: "History",
      icon: "📋",
    },
  ];

  return (
    <aside className="w-[300px] h-screen bg-[#081122] text-white flex flex-col border-r border-slate-800">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">

        <div className="w-16 h-16 rounded-3xl bg-orange-500 flex items-center justify-center text-3xl font-bold">
          DR
        </div>

        <h1 className="text-4xl font-bold mt-6">
          Doctor Module
        </h1>

        <p className="text-slate-400 mt-2">
          Existing Customer Pet
        </p>

      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-5 space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveStep(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300

            ${
              activeStep === item.id
                ? "bg-orange-500 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }
            `}
          >
            <span className="text-2xl">
              {item.icon}
            </span>

            <span className="font-semibold text-lg">
              {item.title}
            </span>
          </button>
        ))}

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800">
        <p className="text-slate-500 text-sm">
          Veterinary Management System
        </p>
      </div>

    </aside>
  );
}