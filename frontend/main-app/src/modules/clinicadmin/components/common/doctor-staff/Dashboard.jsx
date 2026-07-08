import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  PawPrint,
} from "lucide-react";



export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalPets: 0,
    pendingPets: 0,
    completedPets: 0,
    todaysVisits: 0,
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setDashboard({
      totalPets: 156,
      pendingPets: 18,
      completedPets: 138,
      todaysVisits: 12,
      recentActivity: [
        {
          _id: "1",
          petId: "Buddy",
          status: "Consultation Completed",
        },
        {
          _id: "2",
          petId: "Charlie",
          status: "Waiting for Doctor",
        },
        {
          _id: "3",
          petId: "Luna",
          status: "Lab Test Recommended",
        },
        {
          _id: "4",
          petId: "Max",
          status: "Prescription Generated",
        },
      ],
    });

    setLoading(false);
  };

  const stats = [
    {
      title: "Total Pets",
      value: dashboard.totalPets,
      icon: PawPrint,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Pets",
      value: dashboard.pendingPets,
      icon: Clock3,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Completed Cases",
      value: dashboard.completedPets,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Today's Visits",
      value: dashboard.todaysVisits,
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-slate-600">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Welcome Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
          Welcome Back Doctor
        </h1>

        <p className="mt-3 text-sm text-slate-500 sm:text-base lg:text-lg">
          Monitor pet consultations, pending visits and completed cases.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg sm:p-6 lg:rounded-[30px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${item.color}`}
              >
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">
            Recent Activity
          </h2>

          <span className="font-medium text-orange-500">
            Today
          </span>
        </div>

        <div className="space-y-4">
          {dashboard.recentActivity.length > 0 ? (
            dashboard.recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="rounded-2xl bg-slate-50 p-4 text-sm sm:text-base"
              >
                <p>
                  <span className="font-semibold">
                    {activity.petId}
                  </span>{" "}
                  - {activity.status}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-center text-slate-500">
              No Recent Activity Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}