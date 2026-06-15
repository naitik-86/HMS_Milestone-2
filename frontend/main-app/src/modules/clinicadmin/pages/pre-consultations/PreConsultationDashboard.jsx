export default function PreConsultationDashboard() {
  const cards = [
    {
      title: "Today's Patients",
      value: "42",
      icon: "🐾",
      color: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Vitals Pending",
      value: "12",
      icon: "❤️",
      color: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Observations",
      value: "08",
      icon: "👀",
      color: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Completed",
      value: "30",
      icon: "✅",
      color: "bg-green-50",
      text: "text-green-600",
    },
  ];

  const queueData = [
    {
      pet: "Bruno",
      owner: "Rahul Sharma",
      status: "Pending",
    },
    {
      pet: "Max",
      owner: "Amit Verma",
      status: "Completed",
    },
    {
      pet: "Rocky",
      owner: "Karan Kumar",
      status: "Observation",
    },
    {
      pet: "Tommy",
      owner: "Rohit Kumar",
      status: "Pending",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">

      <div className="flex-1 p-8">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8">

          <div className="flex flex-col lg:flex-row justify-between items-center">

            <div>
              <h1 className="text-4xl font-bold">
                Welcome Back 👋
              </h1>

              <p className="text-slate-300 mt-3 text-lg">
                Pre Consultation Staff Dashboard
              </p>

              <p className="text-slate-400 mt-2">
                Manage registrations, vitals, observations and pet workflow.
              </p>
            </div>

            <div className="mt-6 lg:mt-0">

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl px-8 py-6">

                <p className="text-slate-300 text-sm">
                  Today's Performance
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  42
                </h2>

                <p className="text-green-400 mt-2">
                  ↑ 12% from yesterday
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* KPI Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

          {cards.map((card, index) => (
            <div
              key={index}
              className="
              bg-white
              rounded-3xl
              p-6
              border
              border-slate-100
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-slate-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-slate-800">
                    {card.value}
                  </h2>

                  <p className="text-green-500 text-sm mt-2 font-medium">
                    ↑ Active Today
                  </p>

                </div>

                <div
                  className={`
                  w-16 h-16
                  rounded-2xl
                  flex items-center justify-center
                  text-3xl
                  shadow-inner
                  ${card.color}
                  `}
                >
                  {card.icon}
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Queue */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100 flex justify-between items-center">

              <h2 className="text-xl font-bold text-slate-800">
                Today's Queue
              </h2>

              <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl font-semibold">
                4 Active
              </span>

            </div>

            <div>

              {queueData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-5 border-b border-slate-100 hover:bg-slate-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                      {item.pet.charAt(0)}
                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-800">
                        {item.pet}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Owner : {item.owner}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`
                    px-4 py-2 rounded-full text-sm font-semibold
                    ${item.status === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : item.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }
                    `}
                  >
                    {item.status}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <h2 className="text-xl font-bold">
                Quick Actions
              </h2>

            </div>

            <div className="p-6 space-y-4">

              <button className="w-full flex items-center gap-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-semibold transition-all hover:scale-[1.02]">

                <span className="text-2xl">
                  🐾
                </span>

                <span>
                  Pending Pets
                </span>

              </button>

              <button className="w-full flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-semibold transition-all hover:scale-[1.02]">

                <span className="text-2xl">
                  ✅
                </span>

                <span>
                  Completed Pets
                </span>

              </button>

              <button className="w-full flex items-center gap-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-semibold transition-all hover:scale-[1.02]">

                <span className="text-2xl">
                  📚
                </span>

                <span>
                  History Pets
                </span>

              </button>

            </div>

            {/* Staff */}
            <div className="m-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                  👨‍⚕️
                </div>

                <div>

                  <h3 className="font-semibold">
                    Pre Consultation Staff
                  </h3>

                  <p className="text-sm text-slate-500">
                    Morning Shift
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Recent Completed */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Recent Completed Pets
              </h2>

              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-2xl">
                Today
              </span>

            </div>

            <div className="space-y-4">

              {["Bruno", "Max", "Tommy"].map((pet, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-slate-200 rounded-2xl p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                      🐾
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {pet}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Consultation Completed
                      </p>

                    </div>

                  </div>

                  <span className="text-green-600 font-bold text-xl">
                    ✓
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* Activity */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">

            <h2 className="text-xl font-bold mb-6">
              Recent Activity
            </h2>

            <div className="space-y-6">

              <div className="flex gap-4">

                <div className="w-3 h-3 rounded-full bg-orange-500 mt-2"></div>

                <div>
                  <p className="font-medium">
                    Bruno registered successfully
                  </p>

                  <p className="text-sm text-slate-500">
                    5 minutes ago
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>

                <div>
                  <p className="font-medium">
                    Max assessment completed
                  </p>

                  <p className="text-sm text-slate-500">
                    15 minutes ago
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>

                <div>
                  <p className="font-medium">
                    Rocky moved to observation
                  </p>

                  <p className="text-sm text-slate-500">
                    30 minutes ago
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}