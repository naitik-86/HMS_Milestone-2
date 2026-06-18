import { useState } from "react";

export default function LabSidebar({
  activeStep,
  setActiveStep,
}) {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#020B2D] px-4 py-4 text-white shadow-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600">
            🧪
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Lab Panel
            </h2>

            <p className="text-xs text-slate-400">
              Veterinary Laboratory
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-white/10 p-2 text-xl"
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
    h-screen w-[280px]
    overflow-hidden
    bg-[#020B2D]
    text-white
    shadow-2xl
    transition-transform
    duration-300
    ${
      isOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }
    lg:translate-x-0
  `}
>
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-blue-500/20 blur-[120px]" />

        {/* Logo Section */}
        <div className="relative z-10 border-b border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div
                className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-gradient-to-br
                from-orange-500
                via-orange-400
                to-blue-600
                text-4xl
                shadow-xl
                "
              >
                🧪
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Lab Panel
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Veterinary Laboratory
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl lg:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="relative z-10 p-5">
          {menus.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveStep(item.id);
                setIsOpen(false);
              }}
              className={`
                group
                relative
                mb-3
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                px-5
                py-4
                text-left
                font-medium
                transition-all
                duration-300
                ${
                  activeStep === item.id
                    ? `
                      bg-gradient-to-r
                      from-orange-500
                      to-orange-600
                      text-white
                      shadow-lg
                      shadow-orange-500/20
                    `
                    : `
                      text-slate-300
                      hover:bg-white/5
                      hover:text-white
                    `
                }
              `}
            >
              {activeStep === item.id && (
                <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-white" />
              )}

              <span className="text-xl">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom User Card */}
        <div className="absolute bottom-6 left-5 right-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-orange-500
                to-orange-600
                font-bold
                "
              >
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