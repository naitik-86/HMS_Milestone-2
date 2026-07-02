import { useState } from "react";
import { showToast } from "../../../../shared/components/toast";
import { useNavigate } from "react-router-dom";
import { registerOwnerAndPet } from "../../api/receptionApi";

export default function NewRegistrationPet() {
  const [showModal, setShowModal] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Owner Verification
    mobileNumber: "",
    otp: "",
    visitType: "New",
    ownerName: "",
    ownerIdType: "Aadhaar Card",
    email: "",
    address: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    petId: "",
    tokenNumber: "",

    // Pet Registration
    petName: "",
    species: "Dog",
    breed: "",
    gender: "Male",
    dob: "",
    age: "",
    color: "",
    rfid: "",
    identificationArea: "",
    petPhoto: null,
    sterilized: "No",

    // Pet History
    vaccineName: "",
    vaccinationDate: "",
    batchNumber: "",
    clinicName: "",
    dewormingProduct: "",
    dewormingDate: "",
    dose: "",
    surgicalProcedure: "",
    surgeryDate: "",
    hospital: "",
    condition: "",
    treatment: "",
    treatmentDate: "",
    allergies: "",
    medications: "",

    // Reason For Visit
    primaryReason: "Treatment",
    assignedDoctor: "",
    complaint: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerOwnerAndPet(formData);

      console.log("Registration Success:", response);

      showToast({
        type: "success",
        title: "Registration Success",
        description: "Registration  have been done successfully.",
      });

      navigate("/clinic/reception");
    } catch (error) {
      console.error("Registration Failed:", error);

      showToast({
        type: "error",
        title: "Operation Failed",
        description: "Unable to register pet. Please try again.",
      });
    }
  };

  return (
    <>
      {showModal && (
        <div className="min-h-[calc(100vh-4rem)] md:min-h-screen bg-slate-100 p-3 sm:p-4">
          <div className="bg-linear-to-br from-white to-slate-50 w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] rounded-2xl sm:rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start sm:items-center gap-4 px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-b bg-white">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                  New Pet Registration
                </h1>

                <p className="text-slate-500 mt-1">
                  Veterinary Registration Management
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 bg-white border-b overflow-x-auto">
              <div className="flex items-center min-w-170">
                {[
                  "Owner Verification",
                  "Pet Registration",
                  "Pet History",
                  "Reason For Visit",
                ].map((item, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
              w-10 h-10 sm:w-14 sm:h-14 rounded-full
              flex items-center justify-center
              font-bold text-lg text-white
              transition-all duration-300
              ${step >= index + 1
                            ? "bg-orange-500 shadow-lg shadow-orange-300"
                            : "bg-slate-300"
                          }
            `}
                      >
                        {index + 1}
                      </div>

                      <span
                        className={`mt-3 text-xs sm:text-sm font-semibold ${step >= index + 1
                            ? "text-orange-500"
                            : "text-slate-400"
                          }`}
                      >
                        {item}
                      </span>
                    </div>

                    {index !== 3 && (
                      <div
                        className={`h-1 flex-1 mx-4 rounded-full ${step > index + 1 ? "bg-orange-500" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {step === 1 && (
                <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">
                    Owner Verification
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Mobile Number */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Mobile Number *
                      </label>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter Mobile Number"
                          className="flex-1 border rounded-xl p-3"
                        />

                        <button
                          className="
                            bg-orange-500
                            hover:bg-orange-600
                            text-white
                            px-6
                            rounded-2xl
                            font-semibold
                            shadow-md
                            transition
                            "
                        >
                          Send OTP
                        </button>
                      </div>
                    </div>

                    {/* OTP */}
                    <div>
                      <label className="block mb-2 font-medium">
                        OTP Verification *
                      </label>

                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter 6 Digit OTP"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Visit Type */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Visit Type *
                      </label>

                      <select
                        name="visitType"
                        value={formData.visitType}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl p-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                      >
                        <option value="New">New</option>
                        <option value="Follow-up">Follow-up</option>
                      </select>
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Owner Name *
                      </label>

                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Owner Name"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Owner ID Type */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Owner ID Type *
                      </label>

                      <select
                        name="ownerIdType"
                        value={formData.ownerIdType}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>Aadhaar Card</option>
                        <option>PAN Card</option>
                        <option>Other Govt ID</option>
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Email Address :
                      </label>

                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email Address"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Full Address *
                      </label>

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter Full Address"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block mb-2 font-medium">State *</label>

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter State"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">City *</label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter City"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block mb-2 font-medium">
                        District *
                      </label>

                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter District"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Pincode *
                      </label>

                      <input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        type="text"
                        placeholder="Pincode"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">
                    Pet Registration
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Pet Name */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Pet Name *
                      </label>

                      <input
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Pet Name"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Species */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Species *
                      </label>

                      <select
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Rabbit</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Breed */}
                    <div>
                      <label className="block mb-2 font-medium">Breed *</label>

                      <input
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        type="text"
                        placeholder="Breed"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block mb-2 font-medium">Gender *</label>

                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Date Of Birth
                      </label>

                      <input
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block mb-2 font-medium">Age</label>

                      <input
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        type="number"
                        placeholder="Age"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block mb-2 font-medium">Color</label>

                      <input
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        type="text"
                        placeholder="Pet Color"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* RFID */}
                    <div>
                      <label className="block mb-2 font-medium">
                        RFID / Microchip Tag No
                      </label>

                      <input
                        name="rfid"
                        value={formData.rfid}
                        onChange={handleChange}
                        type="text"
                        placeholder="RFID Number"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Identification Area */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Identification Area
                      </label>

                      <textarea
                        name="identificationArea"
                        value={formData.identificationArea}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter Identification Marks"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Pet Photo */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Pet Photo
                      </label>

                      <input
                        name="petPhoto"
                        onChange={handleChange}
                        type="file"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Sterilized */}
                    <div>
                      <label className="block mb-2 font-medium">
                        Is Sterilized?
                      </label>

                      <select
                        name="sterilized"
                        value={formData.sterilized}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    {/* Pet ID */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Unique Pet ID
                      </label>

                      <input
                        name="petId"
                        value={formData.petId}
                        onChange={handleChange}
                        type="text"
                        value="PET-2026-001"
                        readOnly
                        className="w-full border rounded-xl p-3 bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">
                    Pet History
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Previous Vaccination */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Vaccine Name
                      </label>

                      <input
                        name="vaccineName"
                        value={formData.vaccineName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Vaccine Name"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Vaccination Date
                      </label>

                      <input
                        name="vaccinationDate"
                        value={formData.vaccinationDate}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Batch Number
                      </label>

                      <input
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        type="text"
                        placeholder="Batch Number"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Clinic Name
                      </label>

                      <input
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Clinic Name"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Deworming */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Deworming Product
                      </label>

                      <input
                        name="dewormingProduct"
                        value={formData.dewormingProduct}
                        onChange={handleChange}
                        type="text"
                        placeholder="Product"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Deworming Date
                      </label>

                      <input
                        name="dewormingDate"
                        value={formData.dewormingDate}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Dose</label>

                      <input
                        name="dose"
                        value={formData.dose}
                        onChange={handleChange}
                        type="text"
                        placeholder="Dose"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Surgery */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Surgical Procedure
                      </label>

                      <input
                        name="surgicalProcedure"
                        value={formData.surgicalProcedure}
                        onChange={handleChange}
                        type="text"
                        placeholder="Procedure"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Surgery Date
                      </label>

                      <input
                        name="surgeryDate"
                        value={formData.surgeryDate}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Hospital</label>

                      <input
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        type="text"
                        placeholder="Hospital"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Past Treatment */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Condition
                      </label>

                      <input
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        type="text"
                        placeholder="Condition"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Treatment
                      </label>

                      <input
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        type="text"
                        placeholder="Treatment"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">
                        Treatment Date
                      </label>

                      <input
                        name="treatmentDate"
                        value={formData.treatmentDate}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Allergies */}

                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Known Allergies
                      </label>

                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Known Allergies"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Medication */}

                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Current Medications
                      </label>

                      <textarea
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Current Medications"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6">
                    Reason For Visit
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Primary Reason */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Primary Reason *
                      </label>

                      <select
                        name="primaryReason"
                        value={formData.primaryReason}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>Treatment</option>
                        <option>Vaccination</option>
                        <option>Checkup</option>
                        <option>Certificate</option>
                      </select>
                    </div>

                    {/* Assigned Doctor */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Assigned Doctor *
                      </label>

                      <select
                        name="assignedDoctor"
                        value={formData.assignedDoctor}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3"
                      >
                        <option>Dr. Sharma</option>
                        <option>Dr. Verma</option>
                        <option>Dr. Singh</option>
                      </select>
                    </div>

                    {/* Complaint */}

                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium">
                        Specific Complaint
                      </label>

                      <textarea
                        name="complaint"
                        value={formData.complaint}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe Problem"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Token */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Token Number
                      </label>

                      <input
                        name="tokenNumber"
                        value={formData.tokenNumber}
                        onChange={handleChange}
                        value="TK-001"
                        readOnly
                        className="w-full border rounded-xl p-3 bg-slate-100"
                      />
                    </div>

                    {/* Appointment Date */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Appointment Date
                      </label>

                      <input
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        type="date"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>

                    {/* Appointment Time */}

                    <div>
                      <label className="block mb-2 font-medium">
                        Appointment Time
                      </label>

                      <input
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        type="time"
                        className="w-full border rounded-xl p-3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 sm:p-5 flex justify-between gap-3">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="bg-slate-100 hover:bg-slate-200 px-5 sm:px-8 py-3 rounded-2xl font-semibold disabled:opacity-50"
              >
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="
                                        bg-orange-500
                                        hover:bg-orange-600
                                        text-white
                                        px-8
                                        py-3
                                        rounded-2xl
                                        font-semibold
                                        shadow-lg
                                        shadow-orange-200
                                        transition
                                        "
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
