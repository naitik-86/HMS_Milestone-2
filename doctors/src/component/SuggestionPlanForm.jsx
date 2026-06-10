export default function SuggestionPlanForm({
  setActiveStep,
}) {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Suggestions & Follow-Up Plan
            </h1>

            <p className="text-slate-500 mt-2">
              Final recommendations, follow-up schedule and case closure.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-500">
              Case Status
            </p>

            <h3 className="font-bold text-green-600">
              Ready To Close
            </h3>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="flex justify-between">
          <span className="font-medium">
            Step 6 of 6
          </span>

          <span className="text-green-600 font-semibold">
            Final Review
          </span>
        </div>

        <div className="h-3 bg-slate-200 rounded-full mt-4">
          <div className="h-3 bg-green-500 rounded-full w-full"></div>
        </div>

      </div>

      {/* Advice Section */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          📋 Care Recommendations
        </h2>

        <div className="grid gap-5">

          <textarea
            rows="4"
            placeholder="Dietary Advice"
            className="border border-slate-300 rounded-2xl p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Activity Restriction"
            className="border border-slate-300 rounded-2xl p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Home Care Instructions"
            className="border border-slate-300 rounded-2xl p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Preventive Care Notes"
            className="border border-slate-300 rounded-2xl p-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
          />

        </div>

      </div>

      {/* Follow Up Section */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          📅 Follow-Up Planning
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block font-medium mb-2">
              Prognosis
            </label>

            <select className="w-full border border-slate-300 rounded-2xl p-3">
              <option>Good</option>
              <option>Fair</option>
              <option>Guarded</option>
              <option>Poor</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Follow-Up Date
            </label>

            <input
              type="date"
              className="w-full border border-slate-300 rounded-2xl p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Next Vaccination Date
            </label>

            <input
              type="date"
              className="w-full border border-slate-300 rounded-2xl p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Case Status
            </label>

            <select className="w-full border border-slate-300 rounded-2xl p-3">
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>

        </div>

        <div className="mt-5">

          <label className="block font-medium mb-2">
            Next Vaccinations
          </label>

          <textarea
            rows="3"
            placeholder="Mention upcoming vaccines..."
            className="w-full border border-slate-300 rounded-2xl p-4 resize-none"
          />

        </div>

      </div>

      {/* Prescription Ready */}
      <div className="bg-green-50 border border-green-200 rounded-3xl p-6 mb-6">

        <h3 className="text-lg font-bold text-green-700">
          ✅ Prescription Ready
        </h3>

        <p className="text-green-600 mt-2">
          Treatment plan completed successfully. Prescription can now be generated and printed with clinic letterhead.
        </p>

      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-5 shadow-md">
          <p className="text-slate-500 text-sm">
            Diagnosis Status
          </p>
          <h3 className="font-bold text-orange-500 mt-2">
            Completed
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md">
          <p className="text-slate-500 text-sm">
            Treatment Status
          </p>
          <h3 className="font-bold text-green-500 mt-2">
            Approved
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-md">
          <p className="text-slate-500 text-sm">
            Case Closure
          </p>
          <h3 className="font-bold text-blue-500 mt-2">
            Ready
          </h3>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between">

        <button
          onClick={() => setActiveStep(5)}
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

        <div className="flex gap-4">

          <button
            className="
              px-8 py-3
              rounded-2xl
              bg-slate-800
              hover:bg-slate-900
              text-white
            "
          >
            Generate PDF
          </button>

          <button
            onClick={() => setActiveStep(0)}
            className="
              px-8 py-3
              rounded-2xl
              bg-green-500
              hover:bg-green-600
              text-white
              font-semibold
              shadow-md
            "
          >
            Close Case ✓
          </button>

        </div>

      </div>

    </div>
  );
}