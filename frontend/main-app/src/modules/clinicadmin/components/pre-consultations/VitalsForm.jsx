export default function VitalsForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "bcs" ||
          name === "bodyTemperature" ||
          name === "heartRate" ||
          name === "respiratoryRate" ||
          name === "spo2" ||
          name === "bodyWeight"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

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
            name="bodyTemperature"
            value={formData.bodyTemperature}
            onChange={handleChange}
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
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
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

        {/* Respiratory Rate */}
        <div>
          <label className="block mb-2 font-medium">
            Respiratory Breath
          </label>

          <input
            type="number"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleChange}
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
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
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
            <option value="">Select Blood Pressure</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* SpO2 */}
        <div>
          <label className="block mb-2 font-medium">
            SpO2 %
          </label>

          <input
            type="number"
            name="spo2"
            value={formData.spo2}
            onChange={handleChange}
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
            name="bodyWeight"
            value={formData.bodyWeight}
            onChange={handleChange}
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
            name="bcs"
            value={formData.bcs}
            onChange={handleChange}
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
            <option value="">Select Score</option>
            <option value={1}>1 - Very Thin</option>
            <option value={2}>2 - Thin</option>
            <option value={3}>3 - Ideal</option>
            <option value={4}>4 - Overweight</option>
            <option value={5}>5 - Obese</option>
          </select>
        </div>

        {/* Recorded By */}
        <div>
          <label className="block mb-2 font-medium">
            Vitals Recorded By
          </label>

          <input
            type="text"
            name="recordedBy"
            value={formData.recordedBy}
            onChange={handleChange}
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