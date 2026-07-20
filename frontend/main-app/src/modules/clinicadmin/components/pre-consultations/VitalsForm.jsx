import { useEffect } from "react";

export default function VitalsForm({ formData, setFormData }) {
  useEffect(() => {
    // Auto fill recordedBy from logged in user if empty
    if (!formData.recordedBy) {
      try {
        const storedUser = localStorage.getItem("user") || localStorage.getItem("userData");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const name = user.name || user.fullName || user.personalInfo?.fullName || user.username || "";
          if (name) {
            setFormData((prev) => ({ ...prev, recordedBy: name }));
          }
        }
      } catch (e) {
        console.warn("Failed to parse user from localStorage:", e);
      }
    }

    // Auto set vitalsRecordedAt if empty
    if (!formData.vitalsRecordedAt) {
      setFormData((prev) => ({ ...prev, vitalsRecordedAt: new Date().toISOString() }));
    }
  }, []);

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
          <label className="block mb-2 font-medium text-slate-700">
            Body Temperature (°F / °C)
          </label>

          <input
            type="number"
            name="bodyTemperature"
            value={formData.bodyTemperature}
            onChange={handleChange}
            placeholder="Enter Temperature"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* Heart Rate */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Heart Rate (bpm)
          </label>

          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            placeholder="Enter Heart Rate"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* Respiratory Rate */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Respiratory Breath (Breaths/min)
          </label>

          <input
            type="number"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleChange}
            placeholder="Enter Respiratory Rate"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Blood Pressure (mmHg)
          </label>

          <select
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select Blood Pressure</option>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* SpO2 */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            SpO2 %
          </label>

          <input
            type="number"
            name="spo2"
            value={formData.spo2}
            onChange={handleChange}
            placeholder="Enter SpO2 %"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* Body Weight */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Body Weight (KG)
          </label>

          <input
            type="number"
            name="bodyWeight"
            step="0.1"
            value={formData.bodyWeight}
            onChange={handleChange}
            placeholder="Enter Weight in KG"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* BCS */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Body Condition Score (BCS)
          </label>

          <select
            name="bcs"
            value={formData.bcs}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="">Select Score Scale</option>
            <option value={1}>1 - Very Thin</option>
            <option value={2}>2 - Thin</option>
            <option value={3}>3 - Ideal</option>
            <option value={4}>4 - Overweight</option>
            <option value={5}>5 - Obese</option>
          </select>
        </div>

        {/* Recorded By */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Vitals Recorded By
          </label>

          <input
            type="text"
            name="recordedBy"
            value={formData.recordedBy || ""}
            onChange={handleChange}
            placeholder="Logged in staff name"
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-sm md:text-base outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 font-medium"
          />
        </div>

        {/* Vitals Recorded At */}
        <div className="lg:col-span-2">
          <label className="block mb-2 font-medium text-slate-700">
            Vitals Recorded At (Timestamp)
          </label>

          <input
            type="text"
            value={
              formData.vitalsRecordedAt
                ? new Date(formData.vitalsRecordedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : new Date().toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
            }
            readOnly
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-100 text-slate-500 text-sm md:text-base outline-none cursor-not-allowed font-mono"
          />
        </div>
      </div>
    </div>
  );
}