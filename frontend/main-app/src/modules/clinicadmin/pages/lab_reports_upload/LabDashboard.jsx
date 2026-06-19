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
      icon: "🧪",
      color: "blue",
    },
    {
      title: "Pending Uploads",
      value: "32",
      icon: "⏳",
      color: "orange",
    },
    {
      title: "Critical Cases",
      value: "8",
      icon: "🚨",
      color: "red",
    },
    {
      title: "Today's Reports",
      value: "54",
      icon: "📄",
      color: "blue",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">

      <LabSidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <div className="flex-1 lg:ml-[280px] overflow-x-hidden overflow-y-auto pt-[80px] lg:pt-0">

        {/* Header */}


        <div className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <div className="w-3 h-3 rounded-full bg-orange-500"></div>

                <span className="text-orange-500 font-semibold">
                  Veterinary Clinic System
                </span>

              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Lab Dashboard
              </h1>

              <p className="text-slate-500 mt-2">
                Veterinary Laboratory Management
              </p>

            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

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

        <div className="p-4 md:p-6 lg:p-8">

          {activeStep === "dashboard" && (

            <>

              {/* Stats Cards */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                {stats.map((item, index) => (

                  <div
                    key={index}
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-[32px]
                        bg-white
                        p-6
                        border
                        border-slate-100
                        shadow-xl
                        transition-all
                        duration-300
                        hover:-translate-y-2
                        hover:shadow-2xl
                        "
                  >

                    {/* Top Gradient Line */}
                    <div
                      className={`
                            absolute
                            top-0
                            left-0
                            h-1
                            w-full
                            ${item.color === "blue"
                                              ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                              : item.color === "orange"
                                                ? "bg-gradient-to-r from-orange-500 to-orange-300"
                                                : "bg-gradient-to-r from-red-500 to-pink-400"
                                            }
                          `}
                    />

                    {/* Background Glow */}
                    <div
                      className={`
                      absolute
                      -right-8
                      -top-8
                      h-32
                      w-32
                      rounded-full
                      opacity-10
                      blur-3xl
                      ${item.color === "blue"
                                        ? "bg-blue-500"
                                        : item.color === "orange"
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                      }
                    `}
                    />

                    <div className="relative z-10">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            {item.title}
                          </p>

                          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                            {item.value}
                          </h2>

                          <p className="mt-3 text-sm text-green-500 font-medium">
                            ↑ Updated Today
                          </p>

                        </div>

                        <div
                          className={`
                             flex
                              h-12
                              w-12
                              md:h-16
                              md:w-16
                              items-center
                              justify-center
                              rounded-3xl
                              text-3xl
                              shadow-lg
                              transition-all
                              duration-300
                              group-hover:scale-110
                              ${item.color === "blue"
                              ? "bg-blue-100"
                              : item.color === "orange"
                                ? "bg-orange-100"
                                : "bg-red-100"
                            }
                          `}
                        >
                          {item.icon}
                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* Revenue Cards */}
              {/* Hero Section */}

              <div className="
                      mb-8
                      overflow-hidden
                      rounded-[32px]
                      bg-gradient-to-r
                      from-slate-950
                      via-blue-900
                      to-blue-600
                      p-5 md:p-8
                      text-white
                      shadow-2xl
                      ">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <p className="mb-3 text-orange-300 font-semibold">
                      Laboratory Overview
                    </p>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                      54 Reports Uploaded Today
                    </h2>

                    <p className="mt-4 max-w-xl text-white/70">
                      Manage laboratory uploads, monitor critical
                      reports and review pending submissions.
                    </p>

                    <button
                      onClick={() => setActiveStep("reports")}
                      className="
                          mt-6
                          rounded-2xl
                          bg-orange-500
                          px-6
                          py-3
                          font-semibold
                          text-white
                          shadow-lg
        "
                    >
                      Upload Reports
                    </button>

                  </div>

                  <div className="text-[120px] opacity-10">
                    🧪
                  </div>

                </div>

              </div>




              {/* Bottom Section */}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div className="
                    bg-white
                    rounded-[32px]
                    p-8
                    shadow-xl
                    border
                    border-slate-100
                    ">

                  <div className="flex items-center justify-between mb-6">

                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Recent Activity
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Latest laboratory updates
                      </p>
                    </div>

                    <span className="
                        rounded-2xl
                        bg-green-100
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-green-600
                      ">
                      Live
                    </span>

                  </div>

                  <div className="space-y-4">

                    {/* Activity 1 */}
                    <div className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        rounded-3xl
                        bg-slate-50
                        p-5
                        transition-all
                        hover:bg-slate-100
                  ">

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        <div className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-green-100
                            text-2xl
                          ">
                          ✅
                        </div>

                        <div className="
    flex
    items-center
    justify-between
    rounded-3xl
    bg-slate-50
    p-5
    transition-all
    hover:bg-slate-100
">
                          <h3 className="font-semibold text-slate-800">
                            LAB001 Uploaded
                          </h3>

                          <p className="text-sm text-slate-500">
                            Bruno • Blood Test
                          </p>
                        </div>

                      </div>

                      <span className="
                          rounded-xl
                          bg-green-100
                          px-3
                          py-1
                          text-sm
                          font-bold
                          text-green-600
                        ">
                        Completed
                      </span>

                    </div>

                    {/* Activity 2 */}
                    <div className="
                        flex
                        items-center
                        justify-between
                        rounded-3xl
                        bg-slate-50
                        p-5
                        transition-all
                        hover:bg-slate-100
                      ">

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        <div className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              bg-orange-100
                              text-2xl
                            ">
                          ⏳
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            LAB002 Pending
                          </h3>

                          <p className="text-sm text-slate-500">
                            Rocky • CBC Report
                          </p>
                        </div>

                      </div>

                      <span className="
                        rounded-xl
                        bg-orange-100
                        px-3
                        py-1
                        text-sm
                        font-bold
                        text-orange-600
                      ">
                        Pending
                      </span>

                    </div>

                    {/* Activity 3 */}
                    <div className="
                            flex
                            items-center
                            justify-between
                            rounded-3xl
                            bg-slate-50
                            p-5
                            transition-all
                            hover:bg-slate-100
                          ">

                      <div className="flex items-center gap-4">

                        <div className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              bg-red-100
                              text-2xl
                            ">
                          🚨
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            LAB003 Critical
                          </h3>

                          <p className="text-sm text-slate-500">
                            Max • X-Ray Review
                          </p>
                        </div>

                      </div>

                      <span className="
                          rounded-xl
                          bg-red-100
                          px-3
                          py-1
                          text-sm
                          font-bold
                          text-red-600
                        ">
                        Critical
                      </span>

                    </div>

                  </div>

                </div>

                <div className="
                    bg-white
                    rounded-[32px]
                    p-5 md:p-8
                    shadow-xl
                    border
                    border-slate-100
                    ">

                  <h2 className="text-xl font-bold mb-5">
                    Pending Reports
                  </h2>
                  <div className="space-y-4">

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                      <span className="font-medium text-slate-700">
                        🩸 Blood Tests
                      </span>

                      <span className="rounded-xl bg-orange-100 px-3 py-1 font-bold text-orange-600">
                        12
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                      <span className="font-medium text-slate-700">
                        📋 CBC Reports
                      </span>

                      <span className="rounded-xl bg-blue-100 px-3 py-1 font-bold text-blue-600">
                        8
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                      <span className="font-medium text-slate-700">
                        🧪 Urine Tests
                      </span>

                      <span className="rounded-xl bg-green-100 px-3 py-1 font-bold text-green-600">
                        6
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                      <span className="font-medium text-slate-700">
                        🩻 X-Ray Reports
                      </span>

                      <span className="rounded-xl bg-purple-100 px-3 py-1 font-bold text-purple-600">
                        4
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                      <span className="font-medium text-slate-700">
                        🔍 Ultrasound
                      </span>

                      <span className="rounded-xl bg-red-100 px-3 py-1 font-bold text-red-600">
                        2
                      </span>
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