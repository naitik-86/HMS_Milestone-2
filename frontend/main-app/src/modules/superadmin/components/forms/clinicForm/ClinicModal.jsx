import { useState } from "react";
import { showToast } from "../../../../../shared/components/toast";
import { calculateEndDate, getTodayDate } from "../../../../../shared/utils/calculateEndDate "

import { ClinicForm, Stepper } from "../../index"

const tabs = [
    ["identity", "Clinic Identity"],
    ["address", "Address & Location"],
    ["licenses", "Registrations & Licenses"],
    ["tax", "Tax & Banking"],
    ["admin", "Admin Info"],
    ["plan", "Plan & Features"],
];


export default function ClinicModal({ onClose }) {
    const [activeTab, setActiveTab] = useState("identity");

    const today = getTodayDate();

    const [form, setForm] = useState({
        clinicName: "",
        facilityType: "",
        year: "",
        email: "",
        phone: "",
        altPhone: "",
        website: "",
        address1: "",
        address2: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        gst: "",
        pan: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        adminName: "",
        adminPhone: "",
        adminEmail: "",
        plan: "Basic",

        billing: "Monthly",
        startDate: today,
        endDate: calculateEndDate(today, "Monthly"),

        trialDays: 0,
        discountCode: "",
        notes: "",

        maxStaff: "",
        maxDoctors: "",
        maxPets: "",
        storageLimit: "",

        labModule: false,
        groomingModule: false,
        kennelModule: false,
        pharmacyModule: false,
        inventoryModule: false,
        telemedicineModule: false,
        apiAccess: false,
        whiteLabel: false,

        serviceArea: "",

        vetReg: "",
        stateCouncil: "",
        expiry: "",
        tradeLicense: "",
        drugLicense: "",

        designation: "",
        govtIdType: "",
        govtIdNumber: "",

        logo: null,
        vetCert: null,
        tradeDoc: null,
        drugDoc: null,
        cheque: null,
        idDoc: null,
        profile: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => {
            const updated = {
                ...prev,
                [name]: type === "checkbox"
                    ? checked
                    : value,
            };

            if (name === "billing" || name === "startDate") {
                updated.endDate = calculateEndDate(
                    name === "startDate"
                        ? value
                        : updated.startDate,

                    name === "billing"
                        ? value
                        : updated.billing
                );
            }

            return updated;
        });
    };

    const validateTab = () => {
        switch (activeTab) {
            case "identity":
                return (
                    form.clinicName &&
                    form.facilityType &&
                    form.year &&
                    form.email &&
                    form.phone &&
                    form.logo
                );

            case "address":
                return (
                    form.address1 &&
                    form.city &&
                    form.district &&
                    form.state &&
                    form.pincode &&
                    form.serviceArea
                );

            case "licenses":
                return (
                    form.vetReg &&
                    form.stateCouncil &&
                    form.expiry &&
                    form.tradeLicense &&
                    form.drugLicense &&
                    form.vetCert &&
                    form.tradeDoc &&
                    form.drugDoc
                );

            case "tax":
                return (
                    form.gst &&
                    form.pan &&
                    form.bankName &&
                    form.accountNumber &&
                    form.ifsc &&
                    form.cheque
                );

            case "admin":
                return (
                    form.adminName &&
                    form.designation &&
                    form.adminPhone &&
                    form.adminEmail &&
                    form.govtIdNumber &&
                    form.idDoc &&
                    form.profile
                );

            case "plan":
                if (form.plan === "Custom") {
                    return (
                        form.plan &&
                        form.billing &&
                        form.startDate &&
                        form.maxStaff &&
                        form.maxDoctors &&
                        form.maxPets &&
                        form.storageLimit
                    );
                }

                return (
                    form.plan &&
                    form.billing &&
                    form.startDate
                );

            default:
                return true;
        }
    };


    const isFormComplete = () => {
        const originalTab = activeTab;

        const requiredTabs = [
            "identity",
            "address",
            "licenses",
            "tax",
            "admin",
            "plan",
        ];

        for (const tab of requiredTabs) {
            switch (tab) {
                case "identity":
                    if (
                        !form.clinicName ||
                        !form.facilityType ||
                        !form.year ||
                        !form.email ||
                        !form.phone ||
                        !form.logo
                    ) {
                        return false;
                    }
                    break;

                case "address":
                    if (
                        !form.address1 ||
                        !form.city ||
                        !form.district ||
                        !form.state ||
                        !form.pincode ||
                        !form.serviceArea
                    ) {
                        return false;
                    }
                    break;

                case "licenses":
                    if (
                        !form.vetReg ||
                        !form.stateCouncil ||
                        !form.expiry ||
                        !form.tradeLicense ||
                        !form.drugLicense ||
                        !form.vetCert ||
                        !form.tradeDoc ||
                        !form.drugDoc
                    ) {
                        return false;
                    }
                    break;

                case "tax":
                    if (
                        !form.gst ||
                        !form.pan ||
                        !form.bankName ||
                        !form.accountNumber ||
                        !form.ifsc ||
                        !form.cheque
                    ) {
                        return false;
                    }
                    break;

                case "admin":
                    if (
                        !form.adminName ||
                        !form.designation ||
                        !form.adminPhone ||
                        !form.adminEmail ||
                        !form.govtIdNumber ||
                        !form.idDoc ||
                        !form.profile
                    ) {
                        return false;
                    }
                    break;

                case "plan":
                    if (form.plan === "Custom") {
                        if (
                            !form.maxStaff ||
                            !form.maxDoctors ||
                            !form.maxPets ||
                            !form.storageLimit
                        ) {
                            return false;
                        }
                    }
                    break;
            }
        }

        return true;
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[95%] h-[95vh] rounded-3xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-8 py-3 bg-white">
                    <div>
                        <h2 className="text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            Add Clinic
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Register a new clinic/hospital in the system.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-orange-50 text-slate-500 hover:text-orange-500"
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
                    <div className="flex justify-center gap-3 flex-wrap">
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

                                        return;
                                    }

                                    setActiveTab(key);
                                }}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition
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
                    <ClinicForm
                        activeTab={activeTab}
                        form={form}
                        setForm={setForm}
                        handleChange={handleChange}
                        canSave={
                            activeTab === "plan" &&
                            isFormComplete()
                        }
                        validateTab={validateTab}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
}