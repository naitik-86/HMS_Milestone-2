import { useState } from "react";
import PetOwnerSidebar from "../../components/pet-owner/PetOwnerSidebar";
import { FaDownload, FaFilePdf } from "react-icons/fa";

const pets = [
    {
        id: 1,
        name: "Bruno",
        breed: "Golden Retriever",
        age: "4 Years",
        gender: "Male",
        weight: "28 KG",
    },
    {
        id: 2,
        name: "Milo",
        breed: "Persian Cat",
        age: "2 Years",
        gender: "Female",
        weight: "5 KG",
    },
];

const PetOwnerHistory = () => {
    const [selectedPet, setSelectedPet] = useState(1);

    const pet = pets.find((p) => p.id === selectedPet);


    return (
        <div className="min-h-screen bg-slate-50">
            <PetOwnerSidebar />

            <div className="ml-[280px] p-8">
                {/* Header */}
                <div className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-blue-900 to-blue-600 p-8 text-white shadow-2xl">
                    <h1 className="text-4xl font-bold">
                        Pet Medical Records
                    </h1>

                    <p className="mt-2 text-white/70">
                        Complete healthcare history, prescriptions, lab reports and vaccination records.
                    </p>
                </div>

                {/* Pet Select */}
                <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-orange-500">🐾</span>
                        <h2 className="font-bold text-slate-800">
                            Select Pet
                        </h2>
                    </div>

                    <select
                        value={selectedPet}
                        onChange={(e) =>
                            setSelectedPet(Number(e.target.value))
                        }
                        className="
                                w-full max-w-md
                                rounded-2xl
                                border border-slate-200
                                bg-slate-50
                                px-4 py-3
                                focus:border-orange-500
                                focus:outline-none
                                "
                    >
                        {pets.map((pet) => (
                            <option key={pet.id} value={pet.id}>
                                {pet.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Profile */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
                                🐾
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    {pet.name}
                                </h2>

                                <p className="text-white/80">
                                    {pet.breed}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 p-6 md:grid-cols-4">
                        <Info title="Age" value={pet.age} />
                        <Info title="Gender" value={pet.gender} />
                        <Info title="Weight" value={pet.weight} />
                        <Info title="Status" value="Healthy" />
                    </div>
                </div>

                {/* Vitals */}
                <div className="mb-8 grid md:grid-cols-4 gap-5">
                    <VitalCard
                        title="Weight"
                        value={pet.weight}
                        icon="⚖️"
                    />

                    <VitalCard
                        title="Temperature"
                        value="101°F"
                        icon="🌡️"
                    />

                    <VitalCard
                        title="Heart Rate"
                        value="82 bpm"
                        icon="❤️"
                    />

                    <VitalCard
                        title="Respiratory"
                        value="18/min"
                        icon="🫁"
                    />
                </div>

                {/* Diagnosis */}
                <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-bold">
                        Doctor Observation & Diagnosis
                    </h2>

                    <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-5">
                        Pet is healthy and active.
                        Mild seasonal allergy observed.
                        Continue medication for 5 days.
                    </div>
                </div>

                {/* Prescription + Lab */}
                <div className="mb-8 grid lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold">
                            Prescriptions
                        </h2>

                        <div
                            className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    p-4
                                    transition-all
                                    hover:bg-slate-100
                                    hover:shadow-md
                                    "
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">
                                        Prescription June 2025
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Dr Sharma
                                    </p>
                                </div>

                                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white">
                                    <FaDownload />
                                    PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-bold">
                            Lab Reports
                        </h2>

                        <div className="rounded-2xl border p-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">
                                        Blood Report
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        10 June 2025
                                    </p>
                                </div>

                                <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-white">
                                    <FaFilePdf />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reminder */}
                <div className="mb-8 grid lg:grid-cols-2 gap-6">
                    <div
                        className="
                                rounded-3xl
                                bg-gradient-to-r
                                from-orange-500
                                to-orange-600
                                p-6
                                text-white
                                shadow-xl
                                "
                    >
                        <h2 className="text-xl font-bold">
                            Follow-Up Reminder
                        </h2>

                        <p className="mt-3">
                            25 June 2025
                        </p>
                    </div>
                    <div
                        className="
                                rounded-3xl
                                bg-gradient-to-r
                                from-blue-500
                                to-blue-700
                                p-6
                                text-white
                                shadow-xl
                                "
                    >
                        <h2 className="text-xl font-bold">
                            Next Vaccination
                        </h2>

                        <p className="mt-3">
                            Rabies - 15 July 2025
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-xl font-bold">
                        Treatment History
                    </h2>

                    <div className="space-y-5">
                        <TimelineItem
                            date="12 Jun 2025"
                            text="Doctor Consultation"
                        />

                        <TimelineItem
                            date="10 Jun 2025"
                            text="Blood Test"
                        />

                        <TimelineItem
                            date="05 Jun 2025"
                            text="Vaccination"
                        />

                        <TimelineItem
                            date="01 Jun 2025"
                            text="Prescription Issued"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Info = ({ title, value }) => (
    <div className="rounded-2xl bg-slate-50 p-5 transition-all hover:bg-slate-100 hover:shadow-md">
        <p className="text-xs uppercase tracking-wider text-slate-400">
            {title}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-800">
            {value}
        </p>
    </div>
);

const VitalCard = ({ title, value, icon }) => (
    <div
        className="
    rounded-3xl
    bg-white
    p-6
    shadow-lg
    transition-all
    hover:-translate-y-1
    hover:shadow-xl
  "
    >
        <div className="mb-3 text-2xl">
            {icon}
        </div>

        <p className="text-sm text-slate-500">
            {title}
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
        </h3>
    </div>
);

const TimelineItem = ({ date, text }) => (
    <div className="flex gap-4">
        <div
            className="
                    flex h-12 w-12 items-center justify-center
                    rounded-full
                    bg-orange-500
                    text-white
                    shadow-lg
                    "
        >
            ✓
        </div>

        <div className="flex-1 rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-800">
                {text}
            </p>

            <p className="mt-1 text-sm text-slate-500">
                {date}
            </p>
        </div>
    </div>
);

export default PetOwnerHistory;