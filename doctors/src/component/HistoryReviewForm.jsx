export default function HistoryReviewForm({
  setActiveStep,
}) {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              History Review
            </h1>

            <p className="text-slate-500 mt-2">
              Review patient history, diet and medication details.
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
            Step 1 of 6
          </span>

          <span className="text-orange-500 font-semibold">
            History Review
          </span>

        </div>

        <div className="h-3 bg-slate-200 rounded-full mt-4">
          <div className="h-3 bg-orange-500 rounded-full w-[16%]"></div>
        </div>

      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <div className="grid lg:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Diet Type
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none">
              <option>Select Diet Type</option>
              <option>Commercial Dry</option>
              <option>Commercial Wet</option>
              <option>Home Cooked</option>
              <option>Raw</option>
              <option>Mixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Diet Frequency
            </label>

            <input
              type="number"
              placeholder="Meals per day"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Water Intake
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none">
              <option>Normal</option>
              <option>Reduced</option>
              <option>Increased</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Exercise Level
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none">
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Behavioral Habits
            </label>

            <textarea
              rows="4"
              placeholder="Enter behavioural observations..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Medications
            </label>

            <textarea
              rows="4"
              placeholder="Enter current medications..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

        </div>

        {/* Auto Filled Information */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Vaccination Status
            </label>

            <input
              readOnly
              value="Auto Filled"
              className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3"
            />

          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Known Allergies
            </label>

            <input
              readOnly
              value="Auto Filled"
              className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3"
            />

          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-10">

          <button
            onClick={() => setActiveStep(2)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md transition"
          >
            Save & Continue →
          </button>

        </div>

      </div>

    </div>
  );
}