export default function DoctorSidebar({
  activeStep,
  setActiveStep,
}) {
  const menuItems = [
    { id: 0, title: "Dashboard", icon: "📊" },
    { id: 1, title: "History Review", icon: "📋" },
    { id: 2, title: "Clinical Observation", icon: "🩺" },
    { id: 3, title: "Diagnosis", icon: "🧬" },
    { id: 4, title: "Lab Requisition", icon: "🧪" },
    { id: 5, title: "Treatment", icon: "💉" },
    { id: 6, title: "Suggestion & Plans", icon: "📄" },
  ];

  return (
    <aside className="sticky top-0 h-screen w-80 bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
          <span className="font-bold text-2xl">
            DR
          </span>
        </div>

        <h1 className="text-2xl font-bold">
          Doctor Module
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Consultation & Prescription
        </p>
      </div>

      <div className="flex-1 p-4 space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActiveStep(item.id)
            }
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition

            ${
              activeStep === item.id
                ? "bg-orange-500"
                : "hover:bg-slate-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}

      </div>

    </aside>
  );
}