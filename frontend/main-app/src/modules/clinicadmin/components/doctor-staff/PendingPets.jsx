import { useState } from "react";

export default function PendingPets() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const steps = [
    "History",
    "Observation",
    "Diagnosis",
    "Lab",
    "Treatment",
    "Plans",
  ];

  const pendingPets = [
    {
      id: "PET001",
      petName: "Bruno",
      owner: "Rahul Sharma",
      phone: "9876543210",
      status: "Pending",
    },
    {
      id: "PET002",
      petName: "Tommy",
      owner: "Amit Verma",
      phone: "9876541230",
      status: "Pending",
    },
    {
      id: "PET003",
      petName: "Max",
      owner: "Rohan Singh",
      phone: "9988776655",
      status: "Pending",
    },
  ];

  const filteredPets = pendingPets.filter(
    (pet) =>
      pet.phone.includes(search) ||
      pet.owner.toLowerCase().includes(search.toLowerCase()) ||
      pet.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">



      {/* Search */}
      <div className="bg-white rounded-[30px] p-6 shadow-sm">

        <input
          type="text"
          placeholder="Search by Phone Number, Owner Name or Pet ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full h-14 border border-slate-300 rounded-2xl px-5 outline-none focus:border-orange-500"
        />

      </div>

      {/* Table */}
      <div className="bg-white rounded-[30px] p-8 shadow-sm">

        <h2 className="text-2xl font-bold mb-6">
          Pending Cases
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-4">
                  Pet ID
                </th>

                <th className="text-left py-4">
                  Pet Name
                </th>

                <th className="text-left py-4">
                  Owner
                </th>

                <th className="text-left py-4">
                  Phone
                </th>

                <th className="text-left py-4">
                  Status
                </th>

                <th className="text-left py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredPets.map((pet) => (
                <tr
                  key={pet.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-4">
                    {pet.id}
                  </td>

                  <td>
                    {pet.petName}
                  </td>

                  <td>
                    {pet.owner}
                  </td>

                  <td>
                    {pet.phone}
                  </td>

                  <td>
                    <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
                      {pet.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowModal(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl"
                    >
                      Edit
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>


      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

          <div className="bg-white w-[95%] h-[90vh] rounded-[30px] shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h1 className="text-3xl font-bold">
                  {selectedPet?.petName}
                </h1>

                <p className="text-slate-500">
                  {selectedPet?.owner}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPet(null);
                  setStep(1);
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-xl"
              >
                Close
              </button>

            </div>

            {/* Progress Bar */}
            <div className="p-6 border-b">

              <div className="flex justify-between">

                {steps.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold

                ${step >= index + 1
                          ? "bg-orange-500 text-white"
                          : "bg-slate-200 text-slate-500"
                        }
                `}
                    >
                      {index + 1}
                    </div>

                    <p className="text-xs mt-2">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto p-8">
              {step === 1 && (
                <div>

                  <h2 className="text-3xl font-bold mb-8">
                    🩺 History Review
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-semibold mb-2">
                        🍖 Diet Type
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Select Diet Type</option>
                        <option>Commercial Dry</option>
                        <option>Commercial Wet</option>
                        <option>Home Cooked</option>
                        <option>Raw</option>
                        <option>Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🍽️ Diet Frequency (Meals Per Day)
                      </label>

                      <input
                        type="number"
                        placeholder="Enter Meals Per Day"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        💧 Water Intake
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Select Water Intake</option>
                        <option>Normal</option>
                        <option>Reduced</option>
                        <option>Increased</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🐾 Behavioral Habits
                      </label>

                      <textarea
                        rows="3"
                        placeholder="Behavioral Habits"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🏃 Exercise Level
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Select Exercise Level</option>
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Free Roaming</option>
                        <option>Chained</option>
                        <option>Socialized</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        💊 Current Medications
                      </label>

                      <textarea
                        rows="3"
                        placeholder="Current Medications"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        💉 Vaccination Status
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Verified</option>
                        <option>Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        ⚠️ Known Allergies
                      </label>

                      <textarea
                        rows="3"
                        placeholder="Known Allergies"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                  </div>

                </div>
              )}
              {step === 2 && (
                <div>

                  <h2 className="text-3xl font-bold mb-8">
                    🔬 Clinical Observation
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>
                      <label className="block font-semibold mb-2">
                        ❤️ Cardiovascular System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter cardiovascular observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🫁 Respiratory System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter respiratory observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🍖 Digestive System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter digestive observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🦴 Musculoskeletal System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter musculoskeletal observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🧠 Neurological System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter neurological observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🚻 Urogenital System
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter urogenital observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🐕 Skin & Coat
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter skin and coat observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        👀 Eyes
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter eye observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        👂 Ears
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter ear observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        👃 Nose
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter nose observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🗣️ Throat
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter throat observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🩻 Lymph Nodes
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter lymph node observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                  </div>

                  <div className="mt-6">
                    <label className="block font-semibold mb-2">
                      📝 Doctor's Detailed Notes
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Enter detailed clinical notes..."
                      className="w-full border border-slate-300 p-3 rounded-2xl"
                    />
                  </div>

                </div>
              )}
              {step === 3 && (
                <div>

                  <h2 className="text-3xl font-bold mb-8">
                    🧾 Diagnosis
                  </h2>

                  <div className="space-y-6">

                    {/* Provisional Diagnosis */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🔍 Provisional Diagnosis
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter provisional diagnosis (ICD / VeNom Code if available)..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Differential Diagnosis */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📋 Differential Diagnosis
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter differential diagnosis..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Confirmed Diagnosis */}
                    <div>
                      <label className="block font-semibold mb-2">
                        ✅ Confirmed Diagnosis
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter confirmed diagnosis after reports..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Lab Requisition Toggle */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">

                      <label className="flex items-center gap-3 font-semibold">

                        <input
                          type="checkbox"
                          className="w-5 h-5"
                        />

                        🧪 Raise Lab Requisition

                      </label>

                    </div>

                    {/* Important Note */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">

                      <h3 className="font-bold text-red-600 mb-2">
                        ⚠️ Important Note
                      </h3>

                      <p className="text-sm text-slate-700">
                        If Lab Requisition is raised, the doctor must select
                        required tests. A Lab Order will be generated and
                        treatment/prescription may be held until reports
                        are uploaded and reviewed.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {step === 4 && (
                <div>

                  <h2 className="text-3xl font-bold">
                    🧪 Lab Requisition
                  </h2>

                  <p className="text-slate-500 mt-2 mb-8">
                    Select required laboratory tests and sample types for the pet.
                  </p>

                  <div className="grid lg:grid-cols-2 gap-8">

                    {/* Tests Required */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">

                      <label className="block font-bold text-lg mb-5">
                        🔬 Tests Required
                      </label>

                      <div className="grid grid-cols-2 gap-3">

                        {[
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
                        ].map((test) => (
                          <label
                            key={test}
                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-orange-500"
                            />

                            <span className="font-medium">
                              {test}
                            </span>
                          </label>
                        ))}

                      </div>

                    </div>

                    {/* Sample Type */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">

                      <label className="block font-bold text-lg mb-5">
                        🧫 Sample Type
                      </label>

                      <div className="grid grid-cols-2 gap-3">

                        {[
                          "Blood",
                          "Urine",
                          "Stool",
                          "Swab",
                          "Biopsy",
                        ].map((sample) => (
                          <label
                            key={sample}
                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-orange-500"
                            />

                            <span className="font-medium">
                              {sample}
                            </span>
                          </label>
                        ))}

                      </div>

                    </div>

                  </div>

                  {/* Special Instructions */}
                  <div className="mt-8">

                    <label className="block font-bold text-lg mb-3">
                      📝 Special Instructions For Lab
                    </label>

                    <textarea
                      rows="5"
                      placeholder="Enter any special instructions for laboratory..."
                      className="w-full border border-slate-300 rounded-3xl p-4 focus:outline-none focus:border-orange-500"
                    />

                  </div>

                  {/* Lab Order ID */}
                  <div className="mt-8">

                    <label className="block font-bold text-lg mb-3">
                      🏷️ Lab Order ID
                    </label>

                    <div className="bg-slate-100 border border-slate-200 rounded-3xl p-4 text-orange-600 font-bold text-lg">
                      LAB-2026-001
                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      Auto generated by system
                    </p>

                  </div>

                  {/* Info Box */}
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-3xl p-6">

                    <h3 className="font-bold text-blue-700 text-lg mb-3">
                      ℹ️ Laboratory Workflow
                    </h3>

                    <p className="text-slate-700 leading-7">
                      Selected laboratory tests will automatically generate
                      a Lab Order. Reports uploaded by the laboratory team
                      will be linked directly with this consultation case.
                    </p>

                  </div>

                </div>
              )}
              {step === 5 && (
                <div>

                  <h2 className="text-3xl font-bold mb-8">
                    💉 Treatment
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    {/* Medications */}
                    <div>
                      <label className="block font-semibold mb-2">
                        💊 Medications Prescribed
                      </label>

                      <textarea
                        rows="5"
                        placeholder="Enter medications with dosage..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Procedures */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🩺 Procedures Performed
                      </label>

                      <textarea
                        rows="5"
                        placeholder="Enter procedures performed..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Vaccination */}
                    <div>
                      <label className="block font-semibold mb-2">
                        💉 Vaccination Administered
                      </label>

                      <input
                        type="text"
                        placeholder="Vaccination Name"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Deworming */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🪱 Deworming Administered
                      </label>

                      <input
                        type="text"
                        placeholder="Deworming Details"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* IV Fluids */}
                    <div>
                      <label className="block font-semibold mb-2">
                        💧 IV Fluids Given
                      </label>

                      <input
                        type="text"
                        placeholder="IV Fluid Details"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Follow-up */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📅 Follow-Up Required
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                  </div>

                  <div className="mt-6">

                    <label className="block font-semibold mb-2">
                      📝 Treatment Notes
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Additional treatment notes..."
                      className="w-full border border-slate-300 p-3 rounded-2xl"
                    />

                  </div>

                </div>
              )}
              {step === 6 && (
                <div>

                  <h2 className="text-3xl font-bold mb-8">
                    📋 Suggestions & Plans
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    {/* Dietary Advice */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🍖 Dietary Advice
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter dietary recommendations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Activity Restriction */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🏃 Activity Restriction
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Activity restrictions..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Home Care */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🏠 Home Care Instructions
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Enter home care instructions..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Preventive Care */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🛡️ Preventive Care Recommendations
                      </label>

                      <textarea
                        rows="4"
                        placeholder="Preventive care recommendations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Prognosis */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📈 Prognosis
                      </label>

                      <select className="w-full border border-slate-300 p-3 rounded-2xl">
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Guarded</option>
                        <option>Poor</option>
                      </select>
                    </div>

                    {/* Follow-up Date */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📅 Follow-Up Date
                      </label>

                      <input
                        type="date"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                  </div>

                  <div className="mt-6">

                    <label className="block font-semibold mb-2">
                      📌 Final Doctor Notes
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Final recommendations and notes..."
                      className="w-full border border-slate-300 p-3 rounded-2xl"
                    />

                  </div>

                  <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5">

                    <h3 className="font-bold text-green-700 mb-2">
                      ✅ Case Ready For Completion
                    </h3>

                    <p className="text-sm text-slate-700">
                      All consultation steps are completed. Review information before clicking
                      "Complete Case".
                    </p>

                  </div>

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-between">

              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-slate-200 rounded-xl"
              >
                Previous
              </button>

              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl"
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-6 py-3 bg-green-500 text-white rounded-xl"
                >
                  Complete Case
                </button>
              )}

            </div>

          </div>

        </div>
      )}
    </div>

  );
}