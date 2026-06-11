import { useState } from "react";

export default function PetHistoryForm() {
  const [vaccinations, setVaccinations] = useState([
    { vaccine: "", date: "", batch: "", clinic: "" },
  ]);

  const [dewormings, setDewormings] = useState([
    { product: "", date: "", dose: "" },
  ]);

  const [surgeries, setSurgeries] = useState([
    { procedure: "", date: "", hospital: "" },
  ]);

  const [treatments, setTreatments] = useState([
    { condition: "", treatment: "", date: "" },
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          Pet History
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          Previous vaccinations, treatments and medical records
        </p>

        <div className="w-20 h-1 bg-orange-500 rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

        {/* Vaccinations */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Previous Vaccination
            </h3>

            <button
              type="button"
              onClick={() =>
                setVaccinations([
                  ...vaccinations,
                  {
                    vaccine: "",
                    date: "",
                    batch: "",
                    clinic: "",
                  },
                ])
              }
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg"
            >
              + Add Vaccination
            </button>
          </div>

          {vaccinations.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-2 gap-6 border rounded-2xl p-5 mb-4"
            >
              <input
                placeholder="Vaccine Name"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Batch Number"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Clinic Name"
                className="border rounded-xl px-4 py-3"
              />

              {vaccinations.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setVaccinations(
                      vaccinations.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Deworming */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Deworming History
            </h3>

            <button
              type="button"
              onClick={() =>
                setDewormings([
                  ...dewormings,
                  {
                    product: "",
                    date: "",
                    dose: "",
                  },
                ])
              }
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg"
            >
              + Add Deworming
            </button>
          </div>

          {dewormings.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-3 gap-6 border rounded-2xl p-5 mb-4"
            >
              <input
                placeholder="Product Name"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Dose"
                className="border rounded-xl px-4 py-3"
              />

              {dewormings.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setDewormings(
                      dewormings.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Surgery */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Surgical Procedures
            </h3>

            <button
              type="button"
              onClick={() =>
                setSurgeries([
                  ...surgeries,
                  {
                    procedure: "",
                    date: "",
                    hospital: "",
                  },
                ])
              }
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg"
            >
              + Add Surgery
            </button>
          </div>

          {surgeries.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-3 gap-6 border rounded-2xl p-5 mb-4"
            >
              <input
                placeholder="Procedure Name"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Hospital / Clinic"
                className="border rounded-xl px-4 py-3"
              />

              {surgeries.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSurgeries(
                      surgeries.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Treatments */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Past Treatments
            </h3>

            <button
              type="button"
              onClick={() =>
                setTreatments([
                  ...treatments,
                  {
                    condition: "",
                    treatment: "",
                    date: "",
                  },
                ])
              }
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg"
            >
              + Add Treatment
            </button>
          </div>

          {treatments.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-3 gap-6 border rounded-2xl p-5 mb-4"
            >
              <input
                placeholder="Condition"
                className="border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Treatment"
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                className="border rounded-xl px-4 py-3"
              />

              {treatments.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setTreatments(
                      treatments.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Allergies */}
        <div className="mb-8">
          <label className="block text-xl font-semibold mb-3">
            Known Allergies
          </label>

          <textarea
            rows="4"
            placeholder="Enter allergies..."
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        {/* Medications */}
        <div className="mb-8">
          <label className="block text-xl font-semibold mb-3">
            Current Medications
          </label>

          <textarea
            rows="4"
            placeholder="Enter medications..."
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        {/* Save */}
        <div className="flex justify-end border-t pt-6">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md">
            Save & Continue →
          </button>
        </div>

      </div>
    </div>
  );
}