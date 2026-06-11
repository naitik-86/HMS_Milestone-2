export default function PreConsultationDashboard() {
  const cards = [
    {
      title: "Today's Patients",
      value: "42",
      icon: "🐾",
      color: "bg-blue-50",
    },
    {
      title: "Vitals Pending",
      value: "12",
      icon: "❤️",
      color: "bg-orange-50",
    },
    {
      title: "Observations",
      value: "08",
      icon: "👀",
      color: "bg-purple-50",
    },
    {
      title: "Completed",
      value: "30",
      icon: "✅",
      color: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Back 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Pre Consultation Staff Dashboard
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3 text-slate-800">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${card.color}`}
              >
                {card.icon}
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">
            Today's Queue
          </h2>

          <div className="space-y-4">

            {[
              {
                pet: "Bruno",
                owner: "Rahul",
                status: "Pending",
              },
              {
                pet: "Max",
                owner: "Amit",
                status: "Completed",
              },
              {
                pet: "Rocky",
                owner: "Karan",
                status: "Observation",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-slate-200 rounded-2xl p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.pet}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Owner : {item.owner}
                  </p>
                </div>

                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-xl text-sm">
                  {item.status}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="space-y-4">

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-medium">
              Record Vitals
            </button>

            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-2xl font-medium">
              Add Observation
            </button>

            <button className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-medium">
              Start Assessment
            </button>

          </div>

          <div className="mt-8 border-t pt-6">

            <h3 className="font-semibold mb-3">
              Staff Information
            </h3>

            <p className="text-slate-600">
              Name: Pre Consultation Staff
            </p>

            <p className="text-slate-600">
              Shift: Morning
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}