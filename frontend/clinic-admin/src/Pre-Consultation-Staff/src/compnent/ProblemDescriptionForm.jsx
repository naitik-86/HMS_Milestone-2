export default function ProblemDescriptionForm() {
  const symptoms = [
    "Vomiting",
    "Diarrhea",
    "Lethargy",
    "Coughing",
    "Sneezing",
    "Skin Lesion",
    "Lameness",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Problem Description
            </h1>

            <p className="text-slate-500 mt-1">
              Record the primary complaint and associated symptoms.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 px-5 py-3 rounded-2xl">
            <p className="text-sm text-slate-500">
              Case Status
            </p>

            <p className="font-bold text-orange-600">
              Under Assessment
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        {/* Complaint */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Primary Complaint
          </label>

          <textarea
            rows="5"
            placeholder="Describe the main issue reported by the owner..."
            className="w-full border border-slate-300 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Symptoms */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Associated Symptoms
          </label>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {symptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center gap-3 border border-slate-200 rounded-2xl p-4 hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-orange-500"
                />

                <span className="font-medium text-slate-700">
                  {symptom}
                </span>
              </label>
            ))}

          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Severity Level
          </label>

          <select className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Select Severity</option>
            <option>Mild</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>
        </div>

        {/* Severity Guide */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <h3 className="font-semibold text-green-700">
              Mild
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Minor symptoms, patient stable.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <h3 className="font-semibold text-yellow-700">
              Moderate
            </h3>
            <p className="text-sm text-yellow-600 mt-1">
              Requires closer evaluation.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h3 className="font-semibold text-red-700">
              Severe
            </h3>
            <p className="text-sm text-red-600 mt-1">
              Immediate medical attention needed.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-10">

          <button className="px-6 py-3 border border-slate-300 rounded-2xl hover:bg-slate-100">
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