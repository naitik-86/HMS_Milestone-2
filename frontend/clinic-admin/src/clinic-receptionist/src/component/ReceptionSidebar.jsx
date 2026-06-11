export default function ReceptionSidebar({
  activeStep,
  setActiveStep,
}) {
  const steps = [
    {
      id: 0,
      title: "Dashboard",
      icon: "🏠",
    },
    {
      id: 1,
      title: "Owner Verification",
      icon: "👤",
    },
    {
      id: 2,
      title: "Pet Registration",
      icon: "🐾",
    },
    {
      id: 3,
      title: "Pet History",
      icon: "📋",
    },
    {
      id: 4,
      title: "Reason For Visit",
      icon: "🩺",
    },
  ];

  return (
    <div className="w-72 min-h-screen bg-[#111827] text-white flex flex-col shadow-2xl">

      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">

        <h1 className="text-3xl font-bold">
          <span className="text-orange-500">
            Clinic
          </span>

          <span className="text-white">
            Reception
          </span>
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          Veterinary Management System
        </p>

      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">

        <p className="text-xs uppercase tracking-wider text-gray-500 mb-4 px-2">
          Navigation
        </p>

        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`
              w-full
              flex
              items-center
              gap-4
              p-4
              mb-3
              rounded-2xl
              transition-all
              duration-300

              ${
                activeStep === step.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-[1.02]"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200"
              }
            `}
          >

            <div
              className={`
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-lg

                ${
                  activeStep === step.id
                    ? "bg-white/20"
                    : "bg-gray-700"
                }
              `}
            >
              {step.icon}
            </div>

            <div className="text-left">

              <p className="font-semibold">
                {step.title}
              </p>

              {step.id !== 0 && (
                <p className="text-xs opacity-80">
                  Step {step.id}
                </p>
              )}

            </div>

          </button>
        ))}

      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-700">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
            CR
          </div>

          <div>
            <p className="font-semibold">
              Receptionist
            </p>

            <p className="text-xs text-gray-400">
              Clinic Staff
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}