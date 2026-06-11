export default function TreatmentForm({
  setActiveStep,
}) {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Treatment Plan
            </h1>

            <p className="text-slate-500 mt-2">
              Prescribe medications, procedures and supportive care.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-500">
              Treatment ID
            </p>

            <h3 className="font-bold text-orange-600">
              TRT-2026-001
            </h3>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="flex justify-between">
          <span className="font-medium">
            Step 5 of 6
          </span>

          <span className="text-orange-500 font-semibold">
            Treatment
          </span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full mt-4">
          <div className="h-3 bg-orange-500 rounded-full w-[83%]"></div>
        </div>

      </div>

      {/* Medication */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          💊 Medication
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Drug Name"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Dose"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Route"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Frequency"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Duration"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Instructions"
            className="border border-slate-300 rounded-2xl p-3"
          />

        </div>

      </div>

      {/* Procedure */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          🩺 Procedure
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <input
            placeholder="Procedure"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Description"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Outcome"
            className="border border-slate-300 rounded-2xl p-3"
          />

        </div>

      </div>

      {/* Vaccination */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          💉 Vaccination
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Vaccine Name"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Batch Number"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Dose"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Route"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            type="date"
            className="border border-slate-300 rounded-2xl p-3 md:col-span-2"
          />

        </div>

      </div>

      {/* Deworming */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          🪱 Deworming
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <input
            placeholder="Product Name"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Dose"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            type="date"
            className="border border-slate-300 rounded-2xl p-3"
          />

        </div>

      </div>

      {/* IV Fluids */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          💧 IV Fluids
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <input
            placeholder="Fluid Type"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Volume"
            className="border border-slate-300 rounded-2xl p-3"
          />

          <input
            placeholder="Rate"
            className="border border-slate-300 rounded-2xl p-3"
          />

        </div>

      </div>

      {/* Footer Action */}
      <div className="flex justify-between mt-8">

        <button
          onClick={() => setActiveStep(4)}
          className="
            px-8 py-3
            rounded-2xl
            border border-slate-300
            bg-white
            hover:bg-slate-100
          "
        >
          ← Back
        </button>

        <button
          onClick={() => setActiveStep(6)}
          className="
            px-8 py-3
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