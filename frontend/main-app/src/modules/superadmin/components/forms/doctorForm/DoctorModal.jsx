import { useEffect, useMemo, useState } from "react";

import DoctorForm from "./DoctorForm";
import Stepper from "../Stepper";
import { getPlans } from "../../../api/planApi";

const SOLO_DOCTOR_PLAN_NAMES = new Set(["Solo Basic", "Solo Pro"]);
const DEFAULT_SOLO_DOCTOR_PLAN_OPTIONS = ["Solo Basic", "Solo Pro"];

const resolvePlanType = (plan) => {
    if (plan?.planType === "Solo Doctor") return "Solo Doctor";
    if (SOLO_DOCTOR_PLAN_NAMES.has(plan?.subscriptionPlan)) return "Solo Doctor";
    return "Clinic";
};

const tabs = [
    ["personal", "Personal Information"],
    ["qualification", "Qualifications"],
    ["vet", "Vet Council"],
    ["practice", "Practice Details"],
    ["bank", "Banking & Plan"],
];

const toDateInputValue = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
};

const buildQualifications = (doctor) => {
    const qualifications = Array.isArray(doctor?.qualifications) ? doctor.qualifications : [];

    if (!qualifications.length) {
        return [{ degree: "", institution: "", year: "" }];
    }

    return qualifications.map((qualification) => ({
        degree: qualification?.degree || "",
        institution: qualification?.institution || "",
        year: String(qualification?.year || ""),
    }));
};

const buildFormState = (doctor) => ({
    fullName: doctor?.fullName || doctor?.name || "",
    gender: doctor?.gender || "",
    dob: toDateInputValue(doctor?.dob || doctor?.dateOfBirth),
    mobile: doctor?.mobile || "",
    email: doctor?.email || "",
    languages: Array.isArray(doctor?.languages) ? doctor.languages : [],
    address: doctor?.address || "",
    city: doctor?.city || "",
    state: doctor?.state || "",
    pincode: doctor?.pincode || "",
    govtIdType: doctor?.govtIdType || "",
    govtIdNumber: doctor?.govtIdNumber || "",
    govtIdDocument: doctor?.govtIdDocument || null,
    degreeCertificates: Array.isArray(doctor?.degreeCertificates) ? doctor.degreeCertificates[0] || null : doctor?.degreeCertificates || null,
    registrationCertificate: doctor?.registrationCertificate || null,
    profilePhoto: doctor?.profilePhoto || null,
    experience: doctor?.experienceValue || doctor?.experience || "",
    specializations: Array.isArray(doctor?.specializations)
        ? doctor.specializations
        : doctor?.specialization
            ? [doctor.specialization]
            : [],
    vetCouncilRegistrationNumber: doctor?.vetCouncilRegistrationNumber || "",
    stateVetCouncil: doctor?.stateVetCouncil || "",
    certificateValidityDate: toDateInputValue(doctor?.certificateValidityDate || doctor?.certificateValidityRaw),
    isRenewable: Boolean(doctor?.isRenewable),
    practiceType: doctor?.practiceType || "",
    consultationFee: doctor?.consultationFee || "",
    emergencyAvailable: Boolean(doctor?.emergencyAvailable),
    serviceAreas: Array.isArray(doctor?.serviceAreas) ? doctor.serviceAreas.join(", ") : doctor?.serviceAreasText || "",
    gstPan: doctor?.gstPan || "",
    accountName: doctor?.accountName || doctor?.bankDetails?.accountName || "",
    accountNumber: doctor?.accountNumber || doctor?.bankDetails?.accountNumber || "",
    ifsc: doctor?.ifsc || doctor?.bankDetails?.ifsc || "",
    bankName: doctor?.bankName || doctor?.bankDetails?.bankName || "",
    branch: doctor?.branch || doctor?.bankDetails?.branch || "",
    plan: doctor?.plan || "",
});

export default function DoctorModal({ onClose, onCreated, onSaved, mode = "create", doctor = null }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [planOptions, setPlanOptions] = useState([]);
    const [plansLoaded, setPlansLoaded] = useState(false);

    const [form, setForm] = useState(() => buildFormState(doctor));

    const [qualifications, setQualifications] = useState([
        { degree: "", institution: "", year: "" },
    ]);

    const availablePlanOptions = planOptions.length
        ? planOptions
        : DEFAULT_SOLO_DOCTOR_PLAN_OPTIONS;
    const planChoices = useMemo(() => {
        if (doctor?.plan && !availablePlanOptions.includes(doctor.plan)) {
            return [doctor.plan, ...availablePlanOptions];
        }

        return availablePlanOptions;
    }, [availablePlanOptions, doctor?.plan]);

    useEffect(() => {
        let active = true;

        const loadPlans = async () => {
            try {
                const response = await getPlans();
                const soloDoctorPlans = (Array.isArray(response.data) ? response.data : [])
                    .filter((plan) => resolvePlanType(plan) === "Solo Doctor" && (!plan.status || plan.status === "Active"))
                    .map((plan) => plan.subscriptionPlan)
                    .filter(Boolean);

                if (active) {
                    setPlanOptions([...new Set(soloDoctorPlans)]);
                }
            } catch (error) {
                if (active) {
                    setPlanOptions([]);
                }
            } finally {
                if (active) {
                    setPlansLoaded(true);
                }
            }
        };

        loadPlans();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!plansLoaded) return;

        const nextPlan = planChoices.includes(form.plan)
            ? form.plan
            : planChoices[0];

        if (nextPlan && nextPlan !== form.plan) {
            setForm((previous) => ({
                ...previous,
                plan: nextPlan,
            }));
        }
    }, [form.plan, planChoices, plansLoaded]);

    useEffect(() => {
        setActiveTab("personal");
        setForm(buildFormState(doctor));
        setQualifications(buildQualifications(doctor));
    }, [doctor, mode]);

    const title = mode === "edit" ? "Edit Veterinarian" : "Add Veterinarian";
    const description = mode === "edit"
        ? "Update the veterinarian profile and save the changes."
        : "Complete the details to register a new veterinarian.";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:w-[95%] h-screen sm:h-[95vh] rounded-none sm:rounded-3xl shadow-xl flex flex-col overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 py-4 bg-white">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            {title}
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 text-slate-500 hover:text-orange-500 transition border-none bg-transparent"
                        aria-label="Close veterinarian onboarding"
                    >
                        X
                    </button>
                </div>

                <Stepper
                    tabs={tabs}
                    activeTab={activeTab}
                />

                <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-6">
                    <DoctorForm
                        activeTab={activeTab}
                        tabs={tabs}
                        setActiveTab={setActiveTab}
                        form={form}
                        setForm={setForm}
                        qualifications={qualifications}
                        setQualifications={setQualifications}
                        planOptions={planChoices}
                        onClose={onClose}
                        onCreated={onCreated}
                        onSaved={onSaved}
                        mode={mode}
                        doctorId={doctor?.id}
                    />
                </div>
            </div>
        </div>
    );
}
