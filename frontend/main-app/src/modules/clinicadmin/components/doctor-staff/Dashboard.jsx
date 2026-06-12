export default function Dashboard() {
  const stats = [
    {
      title: "Total Pets",
      value: "248",
      icon: "🐾",
      color: "bg-blue-50",
    },
    {
      title: "Pending Pets",
      value: "32",
      icon: "⏳",
      color: "bg-orange-50",
    },
    {
      title: "Completed Cases",
      value: "216",
      icon: "✅",
      color: "bg-green-50",
    },
    {
      title: "Today's Visits",
      value: "18",
      icon: "📅",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome Card */}
   <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">
  <h1 className="text-4xl font-bold text-slate-900">
    Welcome Back Doctor 👋
  </h1>

  <p className="text-slate-500 mt-3 text-lg">
    Monitor pet consultations, pending visits and completed cases.
  </p>
</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">

              <div>
                <p className="text-slate-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold mt-3 text-slate-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${item.color}`}
              >
                {item.icon}
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <span className="text-orange-500 font-medium">
            Today
          </span>
        </div>

        <div className="space-y-4">

          <div className="bg-slate-50 rounded-2xl p-4">
            🐶 Bruno checked in for Vaccination
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            🐱 Kitty consultation completed
          </div>

          <div className="bg-slate-50 rounded-2xl p-4">
            🐾 New pet registration completed
          </div>

        </div>

      </div>

    </div>
  );
}