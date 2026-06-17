import PetOwnerDashboardCards from "../../components/pet-owner/PetOwnerDashboardCards";
import PetOwnerSidebar from "../../components/pet-owner/PetOwnerSidebar";

const PetOwnerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <PetOwnerSidebar />

      <div className="flex-1 ml-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-8 py-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Pet Owner Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your pet health records and documents
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50">
              Notifications
            </button>

            <div className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                P
              </div>


              <div>
                <p className="font-semibold text-slate-800">Pet Owner</p>
                <p className="text-xs text-slate-500">Premium Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Hero Banner */}
          <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="mt-2 max-w-xl text-slate-200">
              Track appointments, prescriptions, vaccinations and
              upload medical reports for your pet.
            </p>
          </div>

          <PetOwnerDashboardCards />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Activity */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-slate-800">
                Recent Activities
              </h3>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  ✅ Vaccination completed successfully
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  📄 Blood report uploaded
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  🩺 Doctor consultation completed
                </div>
              </div>
            </div>

            {/* Reminder */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-slate-800">
                Upcoming Vaccination
              </h3>

              <div className="rounded-2xl bg-orange-50 p-5">
                <h4 className="font-semibold text-slate-800">
                  Rabies Vaccine
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Due on 15 July 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetOwnerDashboard;