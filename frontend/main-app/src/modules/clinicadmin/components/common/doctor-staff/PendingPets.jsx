/* eslint-disable react-hooks/immutability */
import { useState } from "react";
import {
  getPendingPets,
  updatePatient,
} from "../../../api/doctorModuleApi";
import { useEffect } from "react";

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

  const initialFormData = {

    history: {
      dietType: "",
      dietFrequency: "",
      waterIntake: "",
      behaviour: "",
      exercise: "",
      currentMedication: "",
      vaccinationStatus: "",
      allergies: "",
    },

    clinicalObservation: {
      cardiovascular: "",
      respiratory: "",
      digestive: "",
      musculoskeletal: "",
      neurological: "",
      urogenital: "",
      skin: "",
      eyes: "",
      ears: "",
      nose: "",
      throat: "",
      lymphNodes: "",
      doctorNotes: "",
    },

    diagnosis: {
      provisionalDiagnosis: "",
      differentialDiagnosis: "",
      confirmedDiagnosis: "",
      raiseLab: false,
    },

    labRequisition: {
      tests: [],
      sampleType: [],
      instructions: "",
      labOrderId: "",
    },

    treatment: {
      medicines: "",
      procedures: "",
      vaccinations: "",
      deworming: "",
      fluids: "",
      followUp: "",
      treatmentNotes: "",
    },

    suggestion: {
      dietAdvice: "",
      activityRestriction: "",
      homeCare: "",
      preventiveCare: "",
      prognosis: "",
      followUpDate: "",
      finalNotes: "",
    },


  }
  const [formData, setFormData] = useState(initialFormData);


  const handleChange = (section, field, value) => {

    setFormData((prev) => ({

      ...prev,

      [section]: {

        ...prev[section],

        [field]: value

      }

    }));

  };
  const [pendingPets, setPendingPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPets();
  }, []);


  const fetchPendingPets = async () => {
    try {
      const res = await getPendingPets();
      console.log(res);

      setPendingPets(res.data);
      console.log(pendingPets);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendToLab = async () => {
    if (!selectedPet?._id) {
      alert("Please select a pet");
      return;
    }

    try {
      const response = await updatePatient(
        selectedPet._id,
        {
          ...formData,
          diagnosis: {
            ...formData.diagnosis,
            raiseLab: true,
          },
          labRequisition: {
            ...formData.labRequisition,
            status: "PENDING",
          },
        }
      );

      if (response.data.success) {
        alert("Case Sent To Lab Successfully");

        await fetchPendingPets();

        setShowModal(false);
        setSelectedPet(null);
        setStep(1);
        setFormData(initialFormData);
      }
    } catch (err) {
      console.log(err);
    }
  };



  const completeCase = async () => {

    if (!selectedPet?._id) {
      alert("Please select a pet first");
      return;
    }

    try {

      const response = await updatePatient(
        selectedPet._id,
        {
          ...formData,
          status: "COMPLETED",
        }
      );

      if (response.data.success) {

        alert("Case Completed Successfully");

        // Refresh Pending List
        await fetchPendingPets();

        // Close Modal
        setShowModal(false);

        // Reset States
        setSelectedPet(null);
        setStep(1);

        // Reset Form
        setFormData(initialFormData);

      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  }

  const filteredPets = pendingPets.filter((visit) =>
    (visit.tokenNumber?.toString() || "").includes(search) ||
    (visit.owner?.ownerName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (visit.owner?.mobileNumber || "").includes(search) ||
    (visit.pet?.petName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  return (


    <div className="space-y-5 sm:space-y-8 pt-16 md:pt-8">



      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6 lg:rounded-[30px]">

        <input
          type="text"
          placeholder="Search by Phone Number, Owner Name or Pet ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-orange-500 sm:h-14 sm:rounded-2xl sm:px-5 sm:text-base"
        />

      </div>

      {/* Table */}
      <div className="md:hidden space-y-4">
        {/* Mobile Heading */}
        <div className="md:hidden">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Pending Cases
          </h2>
        </div>

        {filteredPets.map((pet) => (
          <div
            key={pet._id}
            className="bg-slate-50 border rounded-2xl p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">
                  {pet.pet?.petName}
                </h3>

                <p className="text-sm text-slate-500">
                  Token #{pet.tokenNumber}
                </p>
              </div>

              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs">
                {pet.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">
                  Owner:
                </span>{" "}
                {pet.owner?.ownerName}
              </p>

              <p>
                <span className="font-semibold">
                  Phone:
                </span>{" "}
                {pet.owner?.mobileNumber}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedPet(pet);

                setFormData((prev) => ({
                  ...prev,
                  ...pet,
                  history: {
                    ...prev.history,
                    ...(pet.history || {})
                  },
                  clinicalObservation: {
                    ...prev.clinicalObservation,
                    ...(pet.clinicalObservation || {})
                  },
                  diagnosis: {
                    ...prev.diagnosis,
                    ...(pet.diagnosis || {})
                  },
                  labRequisition: {
                    ...prev.labRequisition,
                    ...(pet.labRequisition || {})
                  },
                  treatment: {
                    ...prev.treatment,
                    ...(pet.treatment || {})
                  },
                  suggestion: {
                    ...prev.suggestion,
                    ...(pet.suggestion || {})
                  }
                }));

                setShowModal(true);
              }}
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl"
            >
              Edit
            </button>
          </div>
        ))}

      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">

        <h2 className="hidden md:block mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
          Pending Cases
        </h2>

        <div className="hidden md:block overflow-x-auto">

          <table className="min-w-[760px] w-full text-sm sm:text-base">

            <thead>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left">
                  Token
                </th>

                <th className="py-4 pr-4 text-left">
                  Pet Name
                </th>

                <th className="py-4 pr-4 text-left">
                  Owner
                </th>

                <th className="py-4 pr-4 text-left">
                  Phone
                </th>

                <th className="py-4 pr-4 text-left">
                  Status
                </th>

                <th className="py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredPets.map((pet) => (
                <tr
                  key={pet._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-4 pr-4">
                    {pet.tokenNumber}
                  </td>

                  <td className="pr-4">
                    {pet.pet?.petName}
                  </td>

                  <td className="pr-4">
                    {pet.owner?.ownerName}
                  </td>

                  <td className="pr-4">
                    {pet.owner?.mobileNumber}
                  </td>

                  <td className="pr-4">
                    <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
                      {pet.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedPet(pet);

                        setFormData({
                          history: {
                            ...initialFormData.history,
                            ...(pet.history || {}),
                          },
                          clinicalObservation: {
                            ...initialFormData.clinicalObservation,
                            ...(pet.clinicalObservation || {}),
                          },
                          diagnosis: {
                            ...initialFormData.diagnosis,
                            ...(pet.diagnosis || {}),
                          },
                          labRequisition: {
                            ...initialFormData.labRequisition,
                            ...(pet.labRequisition || {}),
                          },
                          treatment: {
                            ...initialFormData.treatment,
                            ...(pet.treatment || {}),
                          },
                          suggestion: {
                            ...initialFormData.suggestion,
                            ...(pet.suggestion || {}),
                          },
                        });

                        setShowModal(true);
                      }}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 sm:px-5 sm:text-base"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-3 pt-20 sm:p-5 sm:pt-5">

          <div className="flex h-[92vh] w-full max-w-7xl flex-col rounded-2xl bg-white shadow-2xl sm:h-[90vh] lg:rounded-[30px]">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {selectedPet?.pet?.petName}
                </h1>

                <p className="text-slate-500">
                  {selectedPet?.owner?.ownerName}• {selectedPet?.owner?.mobileNumber}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPet(null);
                  setStep(1);
                }}
                className="w-full rounded-xl bg-red-500 px-5 py-2 text-white sm:w-auto"
              >
                Close
              </button>


            </div>

            {/* Progress Bar */}
            <div className="border-b p-4 sm:p-6">

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">

                {steps.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full font-bold text-sm sm:text-base

                ${step >= index + 1
                          ? "bg-orange-500 text-white"
                          : "bg-slate-200 text-slate-500"
                        }
                `}
                    >
                      {index + 1}
                    </div>

                    <p className="mt-1 text-center text-[10px] leading-tight sm:text-xs">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {step === 1 && (
                <div>

                  <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                    🩺 History Review
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">

                    <div>
                      <label className="block font-semibold mb-2">
                        🍖 Diet Type
                      </label>

                      <select

                        value={formData.history.dietType}
                        onChange={(e) =>
                          handleChange("history", "dietType", e.target.value)
                        }
                        className="
    w-full
    h-12 sm:h-14
    rounded-2xl
    border border-slate-300
    bg-white
    px-4
    text-sm sm:text-base
    outline-none
    focus:border-orange-500
    focus:ring-4
    focus:ring-orange-100
    appearance-none
  "
                      >
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
                        value={formData.history.dietFrequency}
                        onChange={(e) =>
                          handleChange("history", "dietFrequency", e.target.value)
                        }
                        placeholder="Enter Meals Per Day"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        💧 Water Intake
                      </label>

                      <div className="relative">
                        <select
                          value={formData.history.waterIntake}
                          onChange={(e) =>
                            handleChange("history", "waterIntake", e.target.value)
                          }
                          className="
        w-full
        h-12 sm:h-14
        rounded-2xl
        border border-slate-300
        bg-white
        px-4
        pr-10
        text-sm sm:text-base
        outline-none
        appearance-none
        focus:border-orange-500
        focus:ring-4
        focus:ring-orange-100
      "
                        >
                          <option>Select Water Intake</option>
                          <option>Normal</option>
                          <option>Reduced</option>
                          <option>Increased</option>
                        </select>

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🐾 Behavioral Habits
                      </label>

                      <textarea
                        rows="3"
                        value={formData.history.behaviour}
                        onChange={(e) =>
                          handleChange("history", "behaviour", e.target.value)
                        }
                        placeholder="Behavioral Habits"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        🏃 Exercise Level
                      </label>

                      <select
                        value={formData.history.exercise}
                        onChange={(e) =>
                          handleChange("history", "exercise", e.target.value)
                        }
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      >
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
                        value={formData.history.currentMedication}
                        onChange={(e) =>
                          handleChange("history", "currentMedication", e.target.value)
                        }
                        placeholder="Current Medications"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        💉 Vaccination Status
                      </label>

                      <select
                        value={formData.history.vaccinationStatus}
                        onChange={(e) =>
                          handleChange("history", "vaccinationStatus", e.target.value)
                        }
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      >
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
                        value={formData.history.allergies}
                        onChange={(e) =>
                          handleChange("history", "allergies", e.target.value)
                        }
                        placeholder="Known Allergies"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                  </div>

                </div>
              )}
              {step === 2 && (
                <div>

                  <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                    🔬 Clinical Observation
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">

                    <div>
                      <label className="block font-semibold mb-2">
                        ❤️ Cardiovascular System
                      </label>

                      <textarea
                        rows="4"
                        value={formData.clinicalObservation.cardiovascular || ""}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "cardiovascular",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.respiratory}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "respiratory",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.digestive}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "digestive",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.musculoskeletal}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "musculoskeletal",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.neurological}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "neurological",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.urogenital}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "urogenital",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.skin}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "skin",
                            e.target.value
                          )
                        }
                        placeholder="Enter skin observations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        👀 Eyes
                      </label>

                      <textarea
                        rows="4"
                        value={formData.clinicalObservation.eyes}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "eyes",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.ears}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "ears",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.nose}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "nose",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.throat}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "throat",
                            e.target.value
                          )
                        }
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
                        value={formData.clinicalObservation.lymphNodes}
                        onChange={(e) =>
                          handleChange(
                            "clinicalObservation",
                            "lymphNodes",
                            e.target.value
                          )
                        }
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
                      rows="5"
                      value={formData.clinicalObservation.doctorNotes}
                      onChange={(e) =>
                        handleChange(
                          "clinicalObservation",
                          "doctorNotes",
                          e.target.value
                        )
                      }
                      placeholder="Enter doctor's notes..."
                      className="w-full border border-slate-300 p-3 rounded-2xl"
                    />
                  </div>

                </div>
              )}
              {step === 3 && (
                <div>

                  <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
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
                        value={formData.diagnosis.provisionalDiagnosis}
                        onChange={(e) =>
                          handleChange(
                            "diagnosis",
                            "provisionalDiagnosis",
                            e.target.value
                          )
                        }
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
                        value={formData.diagnosis.differentialDiagnosis}
                        onChange={(e) =>
                          handleChange(
                            "diagnosis",
                            "differentialDiagnosis",
                            e.target.value
                          )
                        }
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
                        value={formData.diagnosis.confirmedDiagnosis}
                        onChange={(e) =>
                          handleChange(
                            "diagnosis",
                            "confirmedDiagnosis",
                            e.target.value
                          )
                        }
                        placeholder="Enter confirmed diagnosis after reports..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Lab Requisition Toggle */}
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">

                      <label className="flex items-center gap-3 font-semibold">

                        <input
                          type="checkbox"
                          checked={formData.diagnosis.raiseLab}
                          onChange={(e) =>
                            handleChange(
                              "diagnosis",
                              "raiseLab",
                              e.target.checked
                            )
                          }
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

                  <h2 className="text-2xl font-bold sm:text-3xl">
                    🧪 Lab Requisition
                  </h2>

                  <p className="text-slate-500 mt-2 mb-8">
                    Select required laboratory tests and sample types for the pet.
                  </p>
                  <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                    <label className="flex items-center gap-4">

                      <input
                        type="checkbox"
                        checked={formData.diagnosis.raiseLab}
                        onChange={(e) =>
                          handleChange(
                            "diagnosis",
                            "raiseLab",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-orange-500"
                      />

                      <span className="text-lg font-semibold text-slate-700">
                        Raise Laboratory Test
                      </span>

                    </label>

                  </div>

                  <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">

                    {/* Tests Required */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:rounded-3xl sm:p-6">

                      <label className="block font-bold text-lg mb-5">
                        🔬 Tests Required
                      </label>

                      <div className="grid gap-3 sm:grid-cols-2">

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
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-orange-500 hover:bg-orange-50 sm:p-4"
                          >
                            <input
                              type="checkbox"
                              checked={formData.labRequisition.tests.includes(test)}
                              onChange={(e) => {

                                if (e.target.checked) {

                                  handleChange(
                                    "labRequisition",
                                    "tests",
                                    [...formData.labRequisition.tests, test]
                                  );

                                } else {

                                  handleChange(
                                    "labRequisition",
                                    "tests",
                                    formData.labRequisition.tests.filter(
                                      (t) => t !== test
                                    )
                                  );

                                }

                              }}
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
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:rounded-3xl sm:p-6">

                      <label className="block font-bold text-lg mb-5">
                        🧫 Sample Type
                      </label>

                      <div className="grid gap-3 sm:grid-cols-2">

                        {[
                          "Blood",
                          "Urine",
                          "Stool",
                          "Swab",
                          "Biopsy",
                        ].map((sample) => (
                          <label
                            key={sample}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-orange-500 hover:bg-orange-50 sm:p-4"
                          >
                            <input
                              type="checkbox"
                              checked={formData.labRequisition.sampleType.includes(sample)}
                              onChange={(e) => {

                                if (e.target.checked) {

                                  handleChange(
                                    "labRequisition",
                                    "sampleType",
                                    [
                                      ...formData.labRequisition.sampleType,
                                      sample
                                    ]
                                  );

                                } else {

                                  handleChange(
                                    "labRequisition",
                                    "sampleType",
                                    formData.labRequisition.sampleType.filter(
                                      (s) => s !== sample
                                    )
                                  );

                                }

                              }}
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
                      value={formData.labRequisition.instructions}
                      onChange={(e) =>
                        handleChange(
                          "labRequisition",
                          "instructions",
                          e.target.value
                        )}
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
                      {formData.labRequisition.labOrderId || "LAB-2026-001"}
                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      Auto generated by system
                    </p>

                  </div>

                  {/* Info Box */}
                  <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:rounded-3xl sm:p-6">

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

                  <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                    💉 Treatment
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">

                    {/* Medications */}
                    <div>
                      <label className="block font-semibold mb-2">
                        💊 Medications Prescribed
                      </label>

                      <textarea
                        rows="5"
                        value={formData.treatment.medicines}
                        onChange={(e) =>
                          handleChange(
                            "treatment",
                            "medicines",
                            e.target.value
                          )}
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
                        value={formData.treatment.procedures}
                        onChange={(e) =>
                          handleChange(
                            "treatment",
                            "procedures",
                            e.target.value
                          )}
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
                        value={formData.treatment.vaccinations}
                        onChange={(e) =>
                          handleChange(
                            "treatment",
                            "vaccinations",
                            e.target.value
                          )}
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
                        value={formData.treatment.deworming}

                        onChange={(e) =>

                          handleChange(
                            "treatment",
                            "deworming",
                            e.target.value
                          )}
                        placeholder="Vaccination Name"
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
                        value={formData.treatment.fluids}

                        onChange={(e) =>

                          handleChange(
                            "treatment",
                            "fluids",
                            e.target.value
                          )}
                        placeholder="Deworming Details"
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Follow-up */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📅 Follow-Up Required
                      </label>

                      <select
                        value={formData.treatment.followUp}
                        onChange={(e) =>
                          handleChange(
                            "treatment",
                            "followUp",
                            e.target.value
                          )}
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                  </div>

                  <div className="mt-6">

                    <label className="block font-semibold mb-2">
                      📝 Treatment Notes
                    </label>

                    <textarea

                      rows="6"

                      value={formData.treatment.treatmentNotes}

                      onChange={(e) =>

                        handleChange(
                          "treatment",
                          "treatmentNotes",
                          e.target.value
                        )

                      }

                      placeholder="Additional treatment notes..."

                      className="w-full border border-slate-300 p-3 rounded-2xl"

                    />

                  </div>

                </div>
              )}
              {step === 6 && (
                <div>

                  <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                    📋 Suggestions & Plans
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">

                    {/* Dietary Advice */}
                    <div>
                      <label className="block font-semibold mb-2">
                        🍖 Dietary Advice
                      </label>

                      <textarea
                        rows="4"
                        value={formData.suggestion.dietAdvice}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "dietAdvice",
                            e.target.value
                          )
                        }
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
                        value={formData.suggestion.activityRestriction}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "activityRestriction",
                            e.target.value
                          )
                        }
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
                        value={formData.suggestion.homeCare}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "homeCare",
                            e.target.value
                          )
                        }
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
                        value={formData.suggestion.preventiveCare}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "preventiveCare",
                            e.target.value
                          )
                        }
                        placeholder="Preventive care recommendations..."
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      />
                    </div>

                    {/* Prognosis */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📈 Prognosis
                      </label>
                      <select
                        value={formData.suggestion.prognosis}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "prognosis",
                            e.target.value
                          )
                        }
                        className="w-full border border-slate-300 p-3 rounded-2xl"
                      >
                        <option value="">Select Prognosis</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Guarded">Guarded</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>

                    {/* Follow-up Date */}
                    <div>
                      <label className="block font-semibold mb-2">
                        📅 Follow-Up Date
                      </label>

                      <input
                        type="date"
                        value={formData.suggestion.followUpDate}
                        onChange={(e) =>
                          handleChange(
                            "suggestion",
                            "followUpDate",
                            e.target.value
                          )
                        }
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
                      value={formData.suggestion.finalNotes}
                      onChange={(e) =>
                        handleChange(
                          "suggestion",
                          "finalNotes",
                          e.target.value
                        )
                      }
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
            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:justify-between sm:p-6">

              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="w-full rounded-xl bg-slate-200 px-6 py-3 sm:w-auto"
              >
                Previous
              </button>

              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="w-full rounded-xl bg-orange-500 px-6 py-3 text-white sm:w-auto"
                >
                  Next
                </button>
              ) : formData.diagnosis.raiseLab ? (
                <button
                  onClick={sendToLab}
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white sm:w-auto"
                >
                  Send To Lab
                </button>
              ) : (
                <button
                  onClick={completeCase}
                  className="w-full rounded-xl bg-green-500 px-6 py-3 text-white sm:w-auto"
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
