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
    <div className="flex h-screen bg-slate-100 overflow-hidden">



      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Premium Header */}
        <div className="bg-white px-8 py-4 border-b border-slate-200">

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-3 mb-2">

                <div className="w-3 h-3 rounded-full bg-orange-500"></div>

                <span className="text-orange-500 font-semibold">
                  Veterinary Clinic System
                </span>

              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {getPageTitle()}
              </h1>

              <p className="text-slate-500 mt-2">
                {getPageDescription()}
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="bg-orange-50 border border-orange-100 rounded-3xl px-5 py-3">

                <p className="text-xs text-slate-500">
                  Active Module
                </p>

                <p className="font-semibold text-orange-600">
                  Doctor Panel
                </p>

              </div>

              <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                DR
              </div>

            </div>

          </div>

        </div>

        {/* Main Page */}
        <div className="flex-1 overflow-y-auto p-8">

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