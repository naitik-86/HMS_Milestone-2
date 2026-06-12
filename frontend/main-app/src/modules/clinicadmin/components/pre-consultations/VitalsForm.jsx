export default function VitalsForm() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">
        Vitals Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Body Temperature (°F / °C)
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Heart Rate (bpm)
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Respiratory Breath
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Blood Pressure
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Select Blood Pressure</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            SpO2 %
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Body Weight (KG)
          </label>
          <input
            type="number"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Body Condition Score (BCS)
          </label>

          <select className="w-full border border-slate-200 rounded-2xl px-4 py-3">
            <option>Select Score</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Vitals Recorded By
          </label>

          <input
            type="text"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50"
          />
        </div>

      </div>
    </div>
  );
}