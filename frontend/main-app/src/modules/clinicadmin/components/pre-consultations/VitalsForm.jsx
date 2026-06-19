export default function VitalsForm() {
  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8">
        Vitals Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Body Temperature */}
        <div>
          <label className="block mb-2 font-medium">
            Body Temperature (°F / °C)
          </label>

          <input
            type="number"
            placeholder="Enter Temperature"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Heart Rate */}
        <div>
          <label className="block mb-2 font-medium">
            Heart Rate (bpm)
          </label>

          <input
            type="number"
            placeholder="Enter Heart Rate"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Respiratory Breath */}
        <div>
          <label className="block mb-2 font-medium">
            Respiratory Breath
          </label>

          <input
            type="number"
            placeholder="Enter Respiratory Rate"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block mb-2 font-medium">
            Blood Pressure
          </label>

          <select
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          >
            <option>Select Blood Pressure</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
        </div>

        {/* SpO2 */}
        <div>
          <label className="block mb-2 font-medium">
            SpO2 %
          </label>

          <input
            type="number"
            placeholder="Enter SpO2"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Body Weight */}
        <div>
          <label className="block mb-2 font-medium">
            Body Weight (KG)
          </label>

          <input
            type="number"
            placeholder="Enter Weight"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* BCS */}
        <div>
          <label className="block mb-2 font-medium">
            Body Condition Score (BCS)
          </label>

          <select
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          >
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
          <label className="block mb-2 font-medium">
            Vitals Recorded By
          </label>

          <input
            type="text"
            placeholder="Staff Name"
            className="
              w-full
              border border-slate-200
              rounded-2xl
              px-4 py-3
              bg-slate-50
              text-sm md:text-base
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

      </div>
    </div>
  );
}