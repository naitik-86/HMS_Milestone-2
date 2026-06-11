export default function PreConsultationSidebar({
  activeStep,
  setActiveStep,
}) {
  const menuItems = [
    {
      id: 0,
      title: "Dashboard",
      icon: "📊",
    },
    {
      id: 1,
      title: "Vitals",
      icon: "❤️",
    },
    {
      id: 2,
      title: "Brief History",
      icon: "📋",
    },
    {
      id: 3,
      title: "Problem Description",
      icon: "📝",
    },
    {
      id: 4,
      title: "Observation",
      icon: "👀",
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-80 bg-slate-900 text-white flex flex-col shadow-2xl">

   

      {/* Staff Card */}
      <div className="p-5">

        <div className="bg-slate-800 rounded-3xl p-4">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold">
              P
            </div>

            <div>
              <h3 className="font-semibold">
                Pre Consultation Staff
              </h3>

              <p className="text-xs text-slate-400">
                Active Shift
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <div className="flex-1 px-5">

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 px-3">
          Navigation
        </p>

        <div className="space-y-3">

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`
                relative w-full flex items-center gap-4
                px-5 py-4 rounded-2xl
                transition-all duration-300

                ${
                  activeStep === item.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "hover:bg-slate-800 text-slate-300"
                }
              `}
            >
              {activeStep === item.id && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
              )}

              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.title}
              </span>
            </button>
          ))}

        </div>

      </div>

      {/* Footer */}
      <div className="p-5 border-t border-slate-800">

        <div className="bg-slate-800 rounded-2xl p-4">

          <p className="text-sm text-slate-400">
            Current Module
          </p>

          <h3 className="font-semibold text-orange-400 mt-1">
            Pre Consultation
          </h3>

        </div>

      </div>

    </aside>
  );
}