export default function LabRequisitionForm({
  setActiveStep,
}) {
  const tests = [
    "CBC",
    "Biochemistry",
    "Urinalysis",
    "Culture & Sensitivity",
    "X-Ray",
    "USG",
    "Cytology",
    "ELISA",
    "PCR",
    "Other",
  ];

  const samples = [
    "Blood",
    "Urine",
    "Stool",
    "Swab",
    "Biopsy",
  ];

  
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Lab Requisition
            </h1>

            <p className="text-slate-500 mt-2">
              Request laboratory investigations for accurate diagnosis.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-500">
              Lab Request ID
            </p>

            <h3 className="font-bold text-orange-600">
              LAB-2026-001
            </h3>
          </div>

        </div>

      </div>

      {/* Progress */}
      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="flex justify-between">

          <span className="font-medium">
            Step 4 of 6
          </span>

          <span className="text-orange-500 font-semibold">
            Laboratory Requisition
          </span>

        </div>

        <div className="h-3 bg-slate-200 rounded-full mt-4">
          <div className="h-3 bg-orange-500 rounded-full w-[66%]"></div>
        </div>

      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        {/* Tests */}
        <div className="mb-10">

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Tests Required
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {tests.map((item) => (
              <label
                key={item}
                className="
                  flex items-center gap-3
                  p-4
                  border border-slate-200
                  rounded-2xl
                  hover:border-orange-400
                  hover:bg-orange-50
                  transition
                  cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  className="accent-orange-500 w-4 h-4"
                />

                <span className="font-medium text-slate-700">
                  {item}
                </span>
              </label>
            ))}

          </div>

        </div>

        {/* Samples */}
        <div className="mb-10">

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Sample Types
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {samples.map((item) => (
              <label
                key={item}
                className="
                  flex items-center gap-3
                  p-4
                  border border-slate-200
                  rounded-2xl
                  hover:border-orange-400
                  hover:bg-orange-50
                  transition
                  cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  className="accent-orange-500 w-4 h-4"
                />

                <span className="font-medium text-slate-700">
                  {item}
                </span>
              </label>
            ))}

          </div>

        </div>

        {/* Instructions */}
        <div className="mb-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Special Instructions
          </label>

          <textarea
            rows="5"
            placeholder="Enter special laboratory instructions..."
            className="
              w-full
              border border-slate-300
              rounded-2xl
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* Auto Generated */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Lab Order ID
          </label>

          <input
            readOnly
            value={`LAB-${Date.now()}`}
            className="
              w-full
              bg-white
              border border-slate-300
              rounded-2xl
              px-4
              py-3
            "
          />

        </div>

        {/* Warning Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-5 mt-6">

          <h3 className="font-bold text-yellow-700">
            ⚠ Awaiting Lab Results
          </h3>

          <p className="text-sm text-yellow-600 mt-2">
            Final diagnosis and treatment decisions should be reviewed after laboratory reports are available.
          </p>

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-10">

          <button
            onClick={() => setActiveStep(3)}
            className="
              px-8 py-3
              rounded-2xl
              border border-slate-300
              bg-white
              hover:bg-slate-100
              font-medium
            "
          >
            ← Back
          </button>

          <button
            onClick={() => setActiveStep(5)}
            className="
              px-8 py-3
              rounded-2xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              shadow-md
            "
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}