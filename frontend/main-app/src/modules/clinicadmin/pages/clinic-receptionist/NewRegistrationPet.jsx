import { useState } from "react";

export default function NewRegistrationPet() {
    const [showModal, setShowModal] = useState(true);
    const [step, setStep] = useState(1);

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">

                    <div className="bg-gradient-to-br from-white to-slate-50 w-[96%] h-[94vh] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center px-10 py-6 border-b bg-white">

                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">
                                    New Pet Registration
                                </h1>

                                <p className="text-slate-500 mt-1">
                                    Veterinary Registration Management
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-3xl font-bold"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Progress Bar */}
                        <div className="px-12 py-8 bg-white border-b">

                            <div className="flex items-center">

                                {[
                                    "Owner Verification",
                                    "Pet Registration",
                                    "Pet History",
                                    "Reason For Visit",
                                ].map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex items-center flex-1"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div
                                                className={`
              w-14 h-14 rounded-full
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
                                                className={`mt-3 text-sm font-semibold ${step >= index + 1
                                                    ? "text-orange-500"
                                                    : "text-slate-400"
                                                    }`}
                                            >
                                                {item}
                                            </span>

                                        </div>

                                        {index !== 3 && (
                                            <div
                                                className={`h-1 flex-1 mx-4 rounded-full ${step > index + 1
                                                    ? "bg-orange-500"
                                                    : "bg-slate-200"
                                                    }`}
                                            />
                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-8">

                            {step === 1 && (
                                <div className="bg-white rounded-[28px] p-8 shadow-lg border border-slate-100">

                                    <h2 className="text-3xl font-bold text-slate-800 mb-8">
                                        Owner Verification
                                    </h2>

                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Mobile Number */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Mobile Number *
                                            </label>

                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Mobile Number"
                                                    className="flex-1 border rounded-xl p-3"
                                                />

                                                <button className="
bg-orange-500
hover:bg-orange-600
text-white
px-6
rounded-2xl
font-semibold
shadow-md
transition
">

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
                                                placeholder="Enter 6 Digit OTP"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Visit Type */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Visit Type *
                                            </label>

                                            <select className="w-full border border-slate-200 rounded-2xl p-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition">
                                                <option>New</option>
                                                <option>Follow-up</option>
                                            </select>
                                        </div>

                                        {/* Owner Name */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Owner Name *
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Owner Name"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Owner ID Type */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Owner ID Type *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Aadhaar Card</option>
                                                <option>PAN Card</option>
                                                <option>Other Govt ID</option>
                                            </select>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Full Address *
                                            </label>

                                            <textarea
                                                rows="3"
                                                placeholder="Enter Full Address"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                State *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Select State</option>
                                            </select>
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                City *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Select City</option>
                                            </select>
                                        </div>

                                        {/* District */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                District *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Select District</option>
                                            </select>
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Pincode *
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Pincode"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                    </div>

                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm">

                                    <h2 className="text-2xl font-bold mb-6">
                                        Pet Registration
                                    </h2>

                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Pet Name */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Pet Name *
                                            </label>

                                            <input
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

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Dog</option>
                                                <option>Cat</option>
                                                <option>Rabbit</option>
                                                <option>Bird</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        {/* Breed */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Breed *
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Breed"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Gender *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
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
                                                type="date"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Age */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Age
                                            </label>

                                            <input
                                                type="number"
                                                placeholder="Age"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Color */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Color
                                            </label>

                                            <input
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
                                                type="text"
                                                placeholder="RFID Number"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Identification Area */}
                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Identification Area
                                            </label>

                                            <textarea
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
                                                type="file"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Sterilized */}
                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Is Sterilized?
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
                                                <option>No</option>
                                                <option>Yes</option>
                                            </select>
                                        </div>

                                        {/* Pet ID */}
                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Unique Pet ID
                                            </label>

                                            <input
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
                                <div className="bg-white rounded-3xl p-8 shadow-sm">

                                    <h2 className="text-2xl font-bold mb-6">
                                        Pet History
                                    </h2>

                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Previous Vaccination */}

                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Vaccine Name
                                            </label>

                                            <input
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
                                                type="date"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Batch Number
                                            </label>

                                            <input
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
                                                type="date"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Dose
                                            </label>

                                            <input
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
                                                type="date"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Hospital
                                            </label>

                                            <input
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
                                                type="date"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Allergies */}

                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Known Allergies
                                            </label>

                                            <textarea
                                                rows="3"
                                                placeholder="Known Allergies"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                        {/* Medication */}

                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Current Medications
                                            </label>

                                            <textarea
                                                rows="3"
                                                placeholder="Current Medications"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                    </div>

                                </div>
                            )}

                            {step === 4 && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm">

                                    <h2 className="text-2xl font-bold mb-6">
                                        Reason For Visit
                                    </h2>

                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Primary Reason */}

                                        <div>
                                            <label className="block mb-2 font-medium">
                                                Primary Reason *
                                            </label>

                                            <select className="w-full border rounded-xl p-3">
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

                                            <select className="w-full border rounded-xl p-3">
                                                <option>Dr. Sharma</option>
                                                <option>Dr. Verma</option>
                                                <option>Dr. Singh</option>
                                            </select>
                                        </div>

                                        {/* Complaint */}

                                        <div className="col-span-2">
                                            <label className="block mb-2 font-medium">
                                                Specific Complaint
                                            </label>

                                            <textarea
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
                                                type="time"
                                                className="w-full border rounded-xl p-3"
                                            />
                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="border-t p-5 flex justify-between">

                            <button
                                disabled={step === 1}
                                onClick={() => setStep(step - 1)}
                                className="bg-slate-100 hover:bg-slate-200 px-8 py-3 rounded-2xl font-semibold "
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
                                    className="
bg-green-500
hover:bg-green-600
text-white
px-8
py-3
rounded-2xl
font-semibold
shadow-lg
"
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