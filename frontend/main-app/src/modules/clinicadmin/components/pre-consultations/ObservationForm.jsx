export default function ObservationForm() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical Observation
            </h1>

            <p className="text-slate-500 mt-1">
              Record physical observations before consultation.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 px-5 py-3 rounded-2xl">
            <p className="text-sm text-slate-500">
              Assessment Stage
            </p>

            <p className="font-bold text-orange-600">
              Observation
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <div className="grid md:grid-cols-2 gap-6">

          {/* General Demeanor */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              General Demeanor
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500">
              <option>Select Demeanor</option>
              <option>Alert</option>
              <option>Depressed</option>
              <option>Anxious</option>
              <option>Unconscious</option>
            </select>
          </div>

          {/* Gait */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gait & Posture
            </label>

            <input
              type="text"
              placeholder="Enter observations"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Visible Lesions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Visible Lesions / Abnormalities
            </label>

            <textarea
              rows="4"
              placeholder="Describe visible lesions..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Eye */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Eye Abnormality
            </label>

            <textarea
              rows="4"
              placeholder="Eye observations..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none"
            />
          </div>

          {/* Nose */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nose Abnormality
            </label>

            <textarea
              rows="4"
              placeholder="Nose observations..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none"
            />
          </div>

          {/* Ear */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ear Abnormality
            </label>

            <textarea
              rows="4"
              placeholder="Ear observations..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none"
            />
          </div>

        </div>

        {/* Skin Section */}
        <div className="mt-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Skin Condition / Coat Health
          </label>

          <textarea
            rows="4"
            placeholder="Describe skin condition..."
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none"
          />

        </div>

        {/* Staff Notes */}
        <div className="mt-6">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Staff Notes
          </label>

          <textarea
            rows="5"
            placeholder="Additional notes..."
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none"
          />

        </div>

        {/* Quick Status Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <p className="font-semibold text-green-700">
              Alert
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="font-semibold text-yellow-700">
              Anxious
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="font-semibold text-orange-700">
              Depressed
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-semibold text-red-700">
              Critical
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">

          <button className="px-6 py-3 border border-slate-300 rounded-2xl hover:bg-slate-100">
            Back
          </button>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md">
            Save Observation
          </button>

        </div>

      </div>
    </div>
  );
}