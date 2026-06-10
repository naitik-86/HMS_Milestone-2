export default function DoctorDashboard({
  setActiveStep,
}) {
  const cards = [
    {
      title: "Consultations",
      value: "24",
      icon: "🩺",
    },
    {
      title: "Diagnoses",
      value: "12",
      icon: "🧬",
    },
    {
      title: "Lab Requests",
      value: "08",
      icon: "🧪",
    },
    {
      title: "Treatments",
      value: "15",
      icon: "💉",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="bg-white rounded-3xl p-8 shadow-md mb-8">
        <h1 className="text-3xl font-bold">
          Doctor Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Consultation, Diagnosis & Prescription
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-md"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-slate-500">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="text-4xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-md">
        <h2 className="text-xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <button
            onClick={() =>
              setActiveStep(1)
            }
            className="bg-orange-500 text-white p-4 rounded-2xl"
          >
            Start Consultation
          </button>

          <button
            onClick={() =>
              setActiveStep(3)
            }
            className="bg-slate-900 text-white p-4 rounded-2xl"
          >
            Diagnosis
          </button>

          <button
            onClick={() =>
              setActiveStep(5)
            }
            className="bg-green-500 text-white p-4 rounded-2xl"
          >
            Treatment
          </button>

        </div>
      </div>

    </div>
  );
}