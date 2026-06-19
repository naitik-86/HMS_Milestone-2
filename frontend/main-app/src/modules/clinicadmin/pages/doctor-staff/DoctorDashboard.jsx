import { useState } from "react";

import {
  PendingPets,
  CompletedPets,
  History,
  Dashboard,

} from "../../components"

export default function DoctorDashboard() {
  const [activeStep, setActiveStep] = useState("dashboard");

  const getPageTitle = () => {
    switch (activeStep) {
      case "pendingPets":
        return "Pending Pets";
      case "completedPets":
        return "Completed Cases";
      case "history":
        return "Pet History";
      default:
        return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (activeStep) {
      case "pendingPets":
        return "Manage pets waiting for consultation";
      case "completedPets":
        return "Review completed consultations";
      case "history":
        return "Access previous pet records";
      default:
        return "Veterinary Clinic Management Overview";
    }
  };

  return (
    <div className="min-h-full bg-slate-100 lg:flex lg:h-full lg:overflow-hidden">



      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Premium Header */}
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-orange-500"></div>

                <span className="text-orange-500 font-semibold">
                  Veterinary Clinic System
                </span>

              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {getPageTitle()}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {getPageDescription()}
              </p>

            </div>

            <div className="flex items-center gap-3 sm:gap-4">

              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 sm:rounded-3xl sm:px-5">

                <p className="text-xs text-slate-500">
                  Active Module
                </p>

                <p className="font-semibold text-orange-600">
                  Doctor Panel
                </p>

              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-lg font-bold text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-3xl">
                DR
              </div>

            </div>

          </div>

        </div>

        {/* Main Page */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {activeStep === "dashboard" && (
            <Dashboard setActiveStep={setActiveStep} />
          )}

          {activeStep === "pendingPets" && (
            <PendingPets setActiveStep={setActiveStep} />
          )}

          {activeStep === "completedPets" && (
            <CompletedPets setActiveStep={setActiveStep} />
          )}

          {activeStep === "history" && (
            <History />
          )}

        </div>

      </div>

    </div>
  );
}
