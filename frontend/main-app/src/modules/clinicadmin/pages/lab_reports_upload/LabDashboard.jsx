import { useState } from "react";
import LabSidebar from "./LabSidebar";
import LabReports from "./LabReportUpload";

export default function LabDashboard() {
  const [activeStep, setActiveStep] =
    useState("dashboard");

  const stats = [
    {
      title: "Total Reports",
      value: "1,245",
      color: "blue",
      icon: "🧪",
    },
    {
      title: "Pending Uploads",
      value: "32",
      color: "orange",
      icon: "⏳",
    },
    {
      title: "Critical Cases",
      value: "8",
      color: "red",
      icon: "🚨",
    },
    {
      title: "Today's Reports",
      value: "54",
      color: "blue",
      icon: "📅",
    },
  ];

return (
  <div className="flex h-screen bg-slate-100">

    <LabSidebar
      activeStep={activeStep}
      setActiveStep={setActiveStep}
    />

    <div className="flex-1 overflow-auto">

      {/* Header */}

      <div className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="flex justify-between items-center">

          <div>

            <div className="flex items-center gap-3 mb-2">

              <div className="w-3 h-3 rounded-full bg-orange-500"></div>

              <span className="text-orange-500 font-semibold">
                Veterinary Clinic System
              </span>

            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Lab Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Veterinary Laboratory Management
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-orange-50 border border-orange-100 rounded-3xl px-5 py-3">

              <p className="text-xs text-slate-500">
                Active Module
              </p>

              <p className="font-semibold text-orange-600">
                Laboratory Panel
              </p>

            </div>

            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-black via-orange-500 to-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
              LB
            </div>

          </div>

        </div>

      </div>

      <div className="p-8">

        {activeStep === "dashboard" && (

          <>

            {/* Stats Cards */}

            <div className="grid grid-cols-4 gap-6 mb-8">

              {stats.map((item, index) => (

                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
                >

                  <div className="flex justify-between">

                    <div>

                      <p className="text-slate-500 text-sm">
                        {item.title}
                      </p>

                      <h2 className="text-4xl font-bold mt-3">
                        {item.value}
                      </h2>

                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        item.color === "blue"
                          ? "bg-blue-100"
                          : item.color === "orange"
                          ? "bg-orange-100"
                          : "bg-red-100"
                      }`}
                    >
                      {item.icon}
                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* Revenue Cards */}

            <div className="grid grid-cols-3 gap-6 mb-8">

              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg">

                <h3 className="text-lg font-semibold mb-2">
                  Total Revenue
                </h3>

                <h2 className="text-4xl font-bold">
                  ₹1.2L
                </h2>

                <p className="text-slate-300 mt-2">
                  This Month
                </p>

              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-6 shadow-lg">

                <h3 className="text-lg font-semibold mb-2">
                  Pending Reports
                </h3>

                <h2 className="text-4xl font-bold">
                  32
                </h2>

                <p className="text-orange-100 mt-2">
                  Need Attention
                </p>

              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg">

                <h3 className="text-lg font-semibold mb-2">
                  Completed Today
                </h3>

                <h2 className="text-4xl font-bold">
                  54
                </h2>

                <p className="text-blue-100 mt-2">
                  Successfully Uploaded
                </p>

              </div>

            </div>

            {/* Quick Actions */}

            <div className="grid grid-cols-3 gap-6 mb-8">

              <div
                onClick={() => setActiveStep("reports")}
                className="cursor-pointer bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
              >

                <div className="text-4xl mb-4">
                  🧪
                </div>

                <h2 className="font-bold text-xl">
                  Lab Reports
                </h2>

                <p className="text-slate-500 mt-2">
                  Upload and manage reports
                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg">

                <div className="text-4xl mb-4">
                  🚨
                </div>

                <h2 className="font-bold text-xl">
                  Critical Cases
                </h2>

                <p className="text-slate-500 mt-2">
                  8 reports require review
                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg">

                <div className="text-4xl mb-4">
                  📈
                </div>

                <h2 className="font-bold text-xl">
                  Performance
                </h2>

                <p className="text-slate-500 mt-2">
                  97% reports completed
                </p>

              </div>

            </div>

            {/* Bottom Section */}

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white rounded-3xl p-6 shadow-lg">

                <h2 className="text-xl font-bold mb-5">
                  Recent Activity
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between border-b pb-3">

                    <div>

                      <p className="font-semibold">
                        LAB001 Uploaded
                      </p>

                      <p className="text-sm text-slate-500">
                        Bruno • Blood Test
                      </p>

                    </div>

                    <span className="text-green-500 font-bold">
                      Completed
                    </span>

                  </div>

                  <div className="flex justify-between border-b pb-3">

                    <div>

                      <p className="font-semibold">
                        LAB002 Pending
                      </p>

                      <p className="text-sm text-slate-500">
                        Rocky • CBC
                      </p>

                    </div>

                    <span className="text-orange-500 font-bold">
                      Pending
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <div>

                      <p className="font-semibold">
                        LAB003 Critical
                      </p>

                      <p className="text-sm text-slate-500">
                        Max • X-Ray
                      </p>

                    </div>

                    <span className="text-red-500 font-bold">
                      Critical
                    </span>

                  </div>

                </div>

              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg">

                <h2 className="text-xl font-bold mb-5">
                  Pending Reports
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span>Blood Tests</span>
                    <span className="font-bold">12</span>
                  </div>

                  <div className="flex justify-between">
                    <span>CBC Reports</span>
                    <span className="font-bold">8</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Urine Tests</span>
                    <span className="font-bold">6</span>
                  </div>

                  <div className="flex justify-between">
                    <span>X-Ray Reports</span>
                    <span className="font-bold">4</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Ultrasound</span>
                    <span className="font-bold">2</span>
                  </div>

                </div>

              </div>

            </div>

          </>

        )}

        {activeStep === "reports" && (
          <LabReports />
        )}

      </div>

    </div>

  </div>
);
}