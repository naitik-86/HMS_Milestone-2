export default function VitalsForm() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Patient Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Vitals Assessment
            </h1>

            <p className="text-slate-500 mt-1">
              Record patient's vital signs before consultation
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 px-5 py-3 rounded-2xl">
            <p className="text-sm text-slate-500">
              Registration ID
            </p>

            <p className="font-bold text-orange-600">
              PET-2026-001
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Patient Vitals
          </h2>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
            Active Assessment
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Temperature */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Body Temperature (°F)
            </label>

            <input
              type="number"
              placeholder="Enter temperature"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Heart Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Heart Rate (BPM)
            </label>

            <input
              type="number"
              placeholder="Enter BPM"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Respiratory Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Respiratory Rate
            </label>

            <input
              type="number"
              placeholder="Breaths per minute"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blood Pressure
            </label>

            <input
              type="text"
              placeholder="120/80"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* SpO2 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SpO₂ (%)
            </label>

            <input
              type="number"
              placeholder="Enter SpO₂"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Body Weight (KG)
            </label>

            <input
              type="number"
              placeholder="Enter weight"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* BCS */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Body Condition Score (BCS)
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Select Score</option>
              <option>1 - Very Thin</option>
              <option>2 - Thin</option>
              <option>3 - Ideal</option>
              <option>4 - Overweight</option>
              <option>5 - Obese</option>
            </select>
          </div>

          {/* Recorded By */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recorded By
            </label>

            <input
              readOnly
              value="Pre Consultation Staff"
              className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3"
            />
          </div>

          {/* Timestamp */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recorded At
            </label>

            <input
              readOnly
              value={new Date().toLocaleString()}
              className="w-full bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-10">

          <button className="px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100">
            Cancel
          </button>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md">
            Save & Continue
          </button>

        </div>

      </div>
    </div>
  );
}