export default function ClinicalObservationForm({
  setActiveStep,
}) {
  const sections = [
    {
      title: "Cardiovascular System",
      icon: "❤️",
    },
    {
      title: "Respiratory System",
      icon: "🫁",
    },
    {
      title: "Digestive System",
      icon: "🍽️",
    },
    {
      title: "Musculoskeletal System",
      icon: "🦴",
    },
    {
      title: "Neurological System",
      icon: "🧠",
    },
    {
      title: "Urogenital System",
      icon: "🩺",
    },
    {
      title: "Skin & Coat",
      icon: "🐕",
    },
    {
      title: "Eyes",
      icon: "👁️",
    },
    {
      title: "Ears",
      icon: "👂",
    },
    {
      title: "Nose",
      icon: "👃",
    },
    {
      title: "Throat",
      icon: "🗣️",
    },
    {
      title: "Lymph Nodes",
      icon: "🔬",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex flex-col lg:flex-row justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Clinical Observation
            </h1>

            <p className="text-slate-500 mt-2">
              Perform complete physical examination and record findings.
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

      {/* Progress Card */}
      <div className="bg-white rounded-3xl shadow-md p-5 mb-6">

        <div className="flex items-center justify-between">

          <span className="font-medium">
            Step 2 of 6
          </span>

          <span className="text-orange-500 font-semibold">
            Clinical Observation
          </span>

        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full mt-4">
          <div className="w-[35%] h-3 bg-orange-500 rounded-full"></div>
        </div>

      </div>

      {/* Observation Sections */}
      <div className="grid lg:grid-cols-2 gap-6">

        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-3xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-xl">
                {section.icon}
              </div>

              <h2 className="font-bold text-lg text-slate-800">
                {section.title}
              </h2>

            </div>

            <textarea
              rows="5"
              placeholder={`Enter findings for ${section.title}`}
              className="
                w-full
                border
                border-slate-300
                rounded-2xl
                p-4
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
              "
            />
          </div>
        ))}

      </div>

      {/* Detailed Notes */}
      <div className="bg-white rounded-3xl shadow-md p-6 mt-6">

        <h2 className="text-xl font-bold mb-4">
          Doctor Detailed Notes
        </h2>

        <textarea
          rows="8"
          placeholder="Enter complete examination summary..."
          className="
            w-full
            border
            border-slate-300
            rounded-2xl
            p-4
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-orange-500
          "
        />

      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">

        <button
          onClick={() => setActiveStep(1)}
          className="
            px-8
            py-3
            rounded-2xl
            border
            border-slate-300
            bg-white
            hover:bg-slate-100
            font-medium
          "
        >
          ← Back
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className="
            px-8
            py-3
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-semibold
            shadow-md
          "
        >
          Save & Continue →
        </button>

      </div>

    </div>
  );
}