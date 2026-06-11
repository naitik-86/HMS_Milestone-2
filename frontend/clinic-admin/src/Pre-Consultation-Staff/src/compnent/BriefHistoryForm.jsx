export default function BriefHistoryForm() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Brief History Of Problem
          </h1>

          <p className="text-slate-500 mt-2">
            Capture initial history before doctor consultation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Duration Of Illness
            </label>

            <input
              type="text"
              placeholder="e.g. 3 Days"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Onset
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3">
              <option>Select Onset</option>
              <option>Sudden</option>
              <option>Gradual</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Progression
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3">
              <option>Select Progression</option>
              <option>Improving</option>
              <option>Worsening</option>
              <option>Stable</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Previous Similar Episode
            </label>

            <input
              type="text"
              placeholder="Enter details"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Recent Travel
            </label>

            <input
              type="text"
              placeholder="Travel history"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Contact With Any Animal
            </label>

            <select className="w-full border border-slate-300 rounded-2xl px-4 py-3">
              <option>Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-slate-700">
              Additional Notes
            </label>

            <textarea
              rows="5"
              placeholder="Enter observations..."
              className="w-full border border-slate-300 rounded-2xl px-4 py-3"
            />
          </div>

        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md">
            Save & Continue
          </button>
        </div>

      </div>
    </div>
  );
}