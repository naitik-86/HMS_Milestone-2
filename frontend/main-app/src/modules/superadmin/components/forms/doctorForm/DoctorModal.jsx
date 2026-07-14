import { useState } from "react";
import { showToast } from "../../../../../shared/components/toast";

import DoctorForm from "./DoctorForm";
import Stepper from "../Stepper";

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

    const [form, setForm] = useState({
        fullName: "",
        gender: "",
        dob: "",
        mobile: "",
        email: "",
        languages: [],
        address: "",
        city: "",
        state: "",
        pincode: "",
        govtIdType: "",
        govtIdNumber: "",


        govtIdDocument: null,
        degreeCertificates: null,
        registrationCertificate: null,
        profilePhoto: null,

        experience: "",
        specializations: [],
        vetCouncilRegistrationNumber: "",
        stateVetCouncil: "",
        certificateValidityDate: "",
        isRenewable: false,
        practiceType: "",
        consultationFee: "",
        emergencyAvailable: false,
        serviceAreas: "",
        gstPan: "",
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        branch: "",
        plan: "",
    });



    const [qualifications, setQualifications] = useState([
        { degree: "", institution: "", year: "" },
    ]);

    const validateTab = () => {
        switch (activeTab) {

            case "personal":
                return (
                    form.fullName &&
                    form.gender &&
                    form.dob &&
                    form.mobile &&
                    form.email &&
                    form.languages.length > 0 &&
                    form.address &&
                    form.city &&
                    form.state &&
                    form.pincode &&
                    form.govtIdType &&
                    form.govtIdNumber &&
                    form.govtIdDocument
                );

            case "qualification":
                // console.log("Before validation:", form.degreeCertificates);
                return (
                    form.degreeCertificates != null &&
                    qualifications.length > 0 &&
                    qualifications.every(q =>
                        q.degree &&
                        q.institution &&
                        q.year
                    )
                );

            case "vet":
                return (
                    form.vetCouncilRegistrationNumber &&
                    form.stateVetCouncil &&
                    form.certificateValidityDate &&
                    form.registrationCertificate
                );

            case "practice":
                return (
                    form.practiceType &&
                    form.consultationFee &&
                    form.serviceAreas &&
                    form.gstPan
                );

            case "bank":
                return (
                    form.accountName &&
                    form.accountNumber &&
                    form.ifsc &&
                    form.bankName &&
                    form.branch &&
                    form.plan
                );

            default:
                return true;
        }
    };

    const currentStep =
        tabs.findIndex(([key]) => key === activeTab) + 1;

    return (
       <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-0 sm:p-4">
    <div className="bg-white w-full sm:w-[95%] h-screen sm:h-[95vh] rounded-none sm:rounded-3xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 py-4 bg-white">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
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
                    <div className="flex gap-2 px-3 sm:px-6 overflow-x-auto whitespace-nowrap">
                        {tabs.map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (!validateTab()) {
                                        showToast({
                                            type: "error",
                                            title: "Validation Error",
                                            description: "Please fill all required fields.",
                                        });
                                        console.log("Fill all fields to continue");
                                        console.log(activeTab + " this is from tabs from doctor form");

                                        return;
                                    }

                                    setActiveTab(key);
                                }}
className={`
shrink-0
px-4 sm:px-5
py-2 sm:py-2.5
rounded-xl sm:rounded-2xl
text-xs sm:text-sm
font-medium
transition-all duration-200
${activeTab === key
    ? "bg-orange-500 text-white shadow-md"
    : "bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-500"
}
`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* FORM */}
               <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-6">
                    <DoctorForm
                        activeTab={activeTab}
                        form={form}
                        setForm={setForm}
                        qualifications={qualifications}
                        setQualifications={setQualifications}


                    />
                </div>
            </div>
        </div>
    );
}
