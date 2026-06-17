import {
  FaPaw,
  FaFileMedical,
  FaSyringe,
  FaFolderOpen,
  FaArrowUp,
} from "react-icons/fa";

const cards = [
  {
    title: "Total Visits",
    value: "12",
    icon: <FaPaw />,
    bg: "from-slate-900 via-slate-800 to-slate-700",
  },
  {
    title: "Lab Reports",
    value: "08",
    icon: <FaFileMedical />,
    bg: "from-orange-500 via-orange-600 to-orange-700",
  },
  {
    title: "Vaccinations",
    value: "05",
    icon: <FaSyringe />,
    bg: "from-blue-500 via-blue-600 to-blue-700",
  },
  {
    title: "Documents",
    value: "16",
    icon: <FaFolderOpen />,
    bg: "from-emerald-500 via-emerald-600 to-emerald-700",
  },
];

const PetOwnerDashboardCards = () => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.bg}
            group relative overflow-hidden rounded-3xl p-6
            text-white shadow-xl transition-all duration-300
            hover:-translate-y-2 hover:shadow-2xl`}
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></div>

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70">
                  {card.title}
                </p>

                <h2 className="mt-4 text-5xl font-bold">
                  {card.value}
                </h2>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                  <FaArrowUp />
                  <span>12% this month</span>
                </div>
              </div>

              <div className="text-5xl text-white/90">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">
              Recent Activities
            </h3>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
              Live
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-green-100 p-3 text-xl">
                  ✅
                </div>

                <div>
                  <h4 className="font-semibold">
                    Vaccination Completed
                  </h4>

                  <p className="text-sm text-slate-500">
                    Rabies vaccination successfully completed
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-orange-100 p-3 text-xl">
                  📄
                </div>

                <div>
                  <h4 className="font-semibold">
                    Lab Report Uploaded
                  </h4>

                  <p className="text-sm text-slate-500">
                    Blood test report uploaded
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-xl">
                  🩺
                </div>

                <div>
                  <h4 className="font-semibold">
                    Doctor Consultation
                  </h4>

                  <p className="text-sm text-slate-500">
                    Consultation completed successfully
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Card */}
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 text-white shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              Upcoming Vaccine
            </h3>

            <span className="text-4xl">💉</span>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
            <h4 className="text-xl font-bold">
              Rabies Vaccine
            </h4>

            <p className="mt-2 text-orange-100">
              Due on 15 July 2025
            </p>

            <div className="mt-6">
              <button
                className="
                rounded-xl
                bg-white
                px-5
                py-3
                font-semibold
                text-orange-600
                transition
                hover:scale-105
              "
              >
                View Details
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm text-orange-100">
              Keep your pet healthy by staying up to date with vaccinations.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetOwnerDashboardCards;