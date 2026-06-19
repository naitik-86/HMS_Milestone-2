import { CalendarDays, CheckCircle2, Clock3, PawPrint } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Pets",
      value: "248",
      icon: PawPrint,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Pets",
      value: "32",
      icon: Clock3,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Completed Cases",
      value: "216",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Today's Visits",
      value: "18",
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
          Welcome Back Doctor
        </h1>

        <p className="mt-3 text-sm text-slate-500 sm:text-base lg:text-lg">
          Monitor pet consultations, pending visits and completed cases.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg sm:p-6 lg:rounded-[30px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${item.color}`}
              >
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold sm:text-2xl">
            Recent Activity
          </h2>

          <span className="shrink-0 font-medium text-orange-500">
            Today
          </span>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm sm:text-base">
            Bruno checked in for Vaccination
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm sm:text-base">
            Kitty consultation completed
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm sm:text-base">
            New pet registration completed
          </div>
        </div>
      </div>
    </div>
  );
}
