import { useState } from "react";

import { DoctorForm, Stepper } from "../../index"

const tabs = [
    ["personal", "Personal Information"],
    ["qualification", "Qualifications"],
    ["vet", "Vet Council"],
    ["practice", "Practice Details"],
    ["bank", "Banking & Plan"],
];

export default function DoctorModal({ onClose }) {
    const [activeTab, setActiveTab] = useState("personal");

    // const [activeTab, setActiveTab] = useState("personal");

    const currentStep =
        tabs.findIndex(([key]) => key === activeTab) + 1;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[95%] h-[95vh] rounded-3xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}

                <div className="flex justify-between items-center px-8 py-3  bg-white">
                    <div>
                        <h2 className="text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            Add Veterinarian
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Complete the details to register a new veterinarian.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 text-slate-500 hover:text-orange-500 transition"
                    >
                        ✕
                    </button>
                </div>


                <Stepper
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* TABS */}
                <div className="bg-slate-100 py-3">
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                        {tabs.map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200
                ${activeTab === key
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-500"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* FORM */}
                <div className="flex-1 overflow-y-auto">
                    <DoctorForm activeTab={activeTab} />
                </div>
            </div>
        </div>
    );
}