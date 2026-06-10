import { useState } from "react";

export default function DiagnosisForm({
  setActiveStep,
}) {
  const [raiseLab, setRaiseLab] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Diagnosis
            </h1>

            <p className="text-slate-500 mt-2">
              Record provisional and confirmed diagnosis.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-500">
              Consultation ID
            </p>

            <h3 className="font-bold text-orange-600">
              DOC-2026-001
            </h3>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="flex justify-between">

          <span className="font-medium">
            Step 3 of 6
          </span>

          <span className="text-orange-500 font-semibold">
            Diagnosis
          </span>

        </div>

        <div className="h-3 bg-slate-200 rounded-full mt-4">
          <div className="h-3 bg-orange-500 rounded-full w-[50%]"></div>
        </div>

      </div>

      {/* Main Form */}
      <div className="space-y-6">

        {/* Provisional Diagnosis */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="font-bold text-lg mb-4 text-slate-800">
            Provisional Diagnosis
          </h2>

          <textarea
            rows="5"
            placeholder="Enter provisional diagnosis..."
            className="
              w-full
              border
              border-slate-300
              rounded-2xl
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* Differential Diagnosis */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="font-bold text-lg mb-4 text-slate-800">
            Differential Diagnosis
          </h2>

          <textarea
            rows="5"
            placeholder="Enter differential diagnosis..."
            className="
              w-full
              border
              border-slate-300
              rounded-2xl
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* Confirmed Diagnosis */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="font-bold text-lg mb-4 text-slate-800">
            Confirmed Diagnosis
          </h2>

          <textarea
            rows="5"
            placeholder="Enter confirmed diagnosis..."
            className="
              w-full
              border
              border-slate-300
              rounded-2xl
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* Lab Decision */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="font-bold text-lg mb-4 text-slate-800">
            Laboratory Requirement
          </h2>

          <label className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-4 cursor-pointer">

            <input
              type="checkbox"
              checked={raiseLab}
              onChange={() =>
                setRaiseLab(!raiseLab)
              }
              className="w-5 h-5 accent-orange-500"
            />

            <span className="font-medium">
              Raise Lab Requisition
            </span>

          </label>

        </div>

        {/* Warning Card */}
        {raiseLab && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6">

            <h3 className="font-bold text-red-600 text-lg">
              ⚠ Laboratory Investigation Required
            </h3>

            <p className="text-red-700 mt-2">
              Treatment and final prescription
              should be completed only after
              reviewing laboratory findings.
            </p>

          </div>
        )}

      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">

        <button
          onClick={() => setActiveStep(2)}
          className="
            px-8
            py-3
            rounded-2xl
            border
            border-slate-300
            bg-white
            hover:bg-slate-100
            font-medium
          "
        >
          ← Back
        </button>

        <button
          onClick={() =>
            setActiveStep(
              raiseLab ? 4 : 5
            )
          }
          className="
            px-8
            py-3
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-semibold
            shadow-md
          "
        >
          Save & Continue →
        </button>

      </div>

    </div>
  );
}