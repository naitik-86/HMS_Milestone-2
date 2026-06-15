export default function LabSidebar({
  activeStep,
  setActiveStep,
}) {
  const menus = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      id: "reports",
      label: "Lab Reports",
      icon: "🧪",
    },
  ];

  return (
    <div className="w-72 bg-slate-950 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-3xl">
          🧪
        </div>

        <h2 className="text-2xl font-bold mt-4">
          Lab Panel
        </h2>

        <p className="text-slate-400">
          Veterinary Laboratory
        </p>

      </div>

      <div className="p-4 flex-1">

        {menus.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveStep(item.id)}
            className={`w-full text-left p-4 rounded-2xl mb-3 transition-all font-medium ${
              activeStep === item.id
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}

      </div>

    </div>
  );
}