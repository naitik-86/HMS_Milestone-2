import { useCallback, useEffect, useState } from "react";
import {
    ClipboardCheck,
    Eye,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { showToast } from "../../../shared/components/toast";
import { calculateEndDate, getTodayDate } from "../../../shared/utils/calculateEndDate ";
import { deleteClinic, getClinics, updateClinic, uploadClinicDocuments } from "../api/clinicApi";
import ClinicForm from "./forms/clinicForm/ClinicForm";
import Stepper from "./forms/Stepper";

const tabs = [
    ["identity", "Clinic Identity"],
    ["address", "Address & Location"],
    ["licenses", "Registrations & Licenses"],
    ["tax", "Tax & Banking"],
    ["admin", "Admin Info"],
    ["plan", "Plan & Features"],
];

const statusStyles = {
    ACTIVE: "bg-green-100 text-green-700",
    SUBMITTED: "bg-orange-100 text-orange-600",
    UNDER_REVIEW: "bg-orange-100 text-orange-600",
    DOCS_VERIFIED: "bg-blue-100 text-blue-600",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-600",
    SUSPENDED: "bg-red-100 text-red-600",
    EXPIRED: "bg-red-100 text-red-600",
};

const tableGrid =
    "md:grid-cols-[minmax(0,1.2fr)_minmax(72px,.65fr)_minmax(0,1.35fr)_minmax(0,1.25fr)_minmax(74px,.65fr)_minmax(100px,.8fr)_minmax(140px,.85fr)]";

const getClinicType = (clinic) =>
    clinic.facilityType ||
    clinic.type ||
    clinic.clinicType ||
    clinic.facility_type ||
    clinic.clinicDetails?.facilityType ||
    "";

const getContactEmail = (clinic) =>
    clinic.contactEmail || clinic.email || clinic.adminEmail || clinic.adminDetails?.emailAddress || "N/A";

const getDisplayStatus = (clinic) =>
    clinic.verificationStatus || clinic.subscriptionStatus || "Unknown";

// Safely format files and URLs for display
const filePlaceholder = (file, fileName) => {
    if (!file) return null;
    if (typeof file === "string") {
        const nameFromUrl = file.split('/').pop()?.split('?')[0];
        return { name: fileName || nameFromUrl || "Uploaded document", type: "application/pdf", url: file };
    }
    return file;
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const valueOrDash = (value) => {
    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "-";
    }
    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }
    if (value && typeof value === "object" && value.name) {
        return value.name;
    }
    if (value === undefined || value === null || String(value).trim() === "") {
        return "-";
    }
    return value;
};

const DetailSection = ({ title, children }) => (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {title}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {children}
        </div>
    </section>
);

const DetailField = ({ label, value, wide = false }) => {
    const isFile = value && typeof value === 'object' && value.name;
    const displayValue = isFile ? value.name : valueOrDash(value);
    const url = isFile ? value.url : null;

    return (
        <div className={wide ? "sm:col-span-2" : ""}>
            <p className="text-xs uppercase tracking-wide text-slate-500">
                {label}
            </p>
            {url && (url.startsWith('http') || url.startsWith('/')) ? (
                <a href={url} target="_blank" rel="noreferrer" className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-words block">
                    {displayValue}
                </a>
            ) : (
                <p className="mt-1 text-sm font-medium text-slate-800 break-words">
                    {displayValue}
                </p>
            )}
        </div>
    );
};

const ClinicDocuments = ({ form }) => {
    const documents = [
        ["Clinic logo", form.logo],
        ["Veterinary council certificate", form.vetCert],
        ["Trade license", form.tradeDoc],
        ["Drug license", form.drugDoc],
        ["Cancelled cheque", form.cheque],
        ["Government ID", form.idDoc],
        ["Admin profile", form.profile],
    ].filter(([, document]) => document?.url);

    return (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Uploaded Documents
            </h3>
            {documents.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {documents.map(([label, document]) => (
                        <div key={label} className="rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                            <p className="mt-1 truncate text-sm font-medium text-slate-800" title={document.name}>
                                {document.name}
                            </p>
                            <a
                                href={document.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                                <FileText size={16} />
                                View document
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-slate-500">No onboarding documents were uploaded.</p>
            )}
        </section>
    );
};

const getPlanValue = (clinic) =>
    clinic.plan || clinic.subscriptionPlan || clinic.subscriptionType || clinic.subscriptionDetails?.planType || "Basic";

const getBillingValue = (clinic) =>
    clinic.billing || clinic.billingCycle || clinic.subscriptionDetails?.billingCycle || (getPlanValue(clinic) === "12_MONTHS" ? "Annual" : "Monthly");

const getClinicForm = (clinic = {}) => {
    const today = getTodayDate();
    const billing = getBillingValue(clinic);

    const address = clinic.addressDetails || clinic.address || {};
    const reg = clinic.registrationDetails || clinic.registrations || clinic.licenses || {};
    const tax = clinic.taxDetails || clinic.tax || clinic.financials || {};
    const admin = clinic.adminDetails || clinic.adminInfo || clinic.admin || {};
    const plan = clinic.subscriptionDetails || clinic.planDetails || clinic.plan || {};
    const limits = clinic.licenseLimits || clinic.limits || clinic.subscriptionDetails?.licenseLimits || {};
    const features = clinic.features || clinic.modules || clinic.subscriptionDetails?.features || {};
    const docs = clinic.documentDetails || clinic.documents || clinic.legalDocuments || {};
    const details = clinic.clinicDetails || clinic.details || {};

    return {
        clinicName: clinic.name || clinic.clinicName || details.clinicName || details.name || "",
        facilityType: getClinicType(clinic) || details.facilityType || "",
        year: clinic.year || clinic.establishedYear || clinic.yearOfEstablishment || details.establishedYear || details.yearOfEstablishment || "",
        email: clinic.email || clinic.contactEmail || details.contactEmail || details.email || "",
        phone: clinic.phone || clinic.contactPhone || clinic.primaryContact || details.phone || details.contactPhone || "",
        altPhone: clinic.altPhone || clinic.alternateContact || clinic.alternatePhone || details.alternateContact || details.altPhone || "",
        website: clinic.website || details.website || "",

        address1: address.addressLine1 || address.line1 || clinic.address1 || clinic.address || "",
        address2: address.addressLine2 || address.line2 || clinic.address2 || "",
        city: address.city || clinic.city || "",
        district: address.district || clinic.district || "",
        state: address.state || clinic.state || "",
        pincode: address.pincode || address.zipcode || clinic.pincode || "",
        latitude: clinic.latitude || address.latitude || "",
        longitude: clinic.longitude || address.longitude || "",
        serviceAreas: address.serviceAreas || clinic.serviceAreas || [address.serviceArea || ""],

        vetReg: clinic.vetReg || clinic.vetRegistrationNumber || reg.vetRegistrationNumber || reg.vetCouncilRegistration || reg.registrationNumber || "",
        stateCouncil: clinic.stateCouncil || clinic.vetCouncil || reg.stateVeterinaryCouncil || reg.stateCouncil || reg.vetCouncil || "",
        expiry: clinic.expiry || reg.registrationExpiryDate || reg.expiryDate || "",
        vetExpiry: clinic.vetExpiry || reg.vetExpiry || reg.registrationExpiryDate || "",

        tradeLicense: clinic.tradeLicense || clinic.tradeLicenseNumber || reg.tradeLicenseNumber || reg.tradeLicense || "",
        tradeExpiry: clinic.tradeExpiry || reg.tradeLicenseExpiryDate || reg.tradeExpiry || "",
        drugLicense: clinic.drugLicense || clinic.drugLicenseNumber || reg.drugLicenseNumber || reg.drugLicense || "",
        drugExpiry: clinic.drugExpiry || reg.drugLicenseExpiryDate || reg.drugExpiry || "",

        gst: clinic.gst || clinic.gstNumber || tax.gstNumber || tax.gst || "",
        pan: clinic.pan || clinic.panNumber || tax.panNumber || tax.pan || "",
        bankName: clinic.bankName || tax.bankName || "",
        accountNumber: clinic.accountNumber || tax.accountNumber || "",
        ifsc: clinic.ifsc || clinic.ifscCode || tax.ifscCode || tax.ifsc || "",

        adminName: clinic.adminName || admin.fullName || admin.name || admin.adminName || "",
        designation: clinic.designation || clinic.adminDesignation || admin.designation || admin.role || "",
        adminPhone: clinic.adminPhone || admin.mobileNumber || admin.phone || admin.adminPhone || "",
        adminEmail: clinic.adminEmail || admin.emailAddress || admin.email || admin.adminEmail || clinic.contactEmail || "",
        govtIdType: clinic.govtIdType || admin.governmentIdType || admin.govtIdType || "Aadhar",
        govtIdNumber: clinic.govtIdNumber || admin.governmentIdNumber || admin.govtIdNumber || "",

        plan: getPlanValue(clinic) || plan.planType || "Basic",
        billing,
        startDate: clinic.startDate || clinic.planStartDate || plan.startDate || today,
        endDate: clinic.endDate || clinic.planEndDate || clinic.expiryDate || plan.endDate || calculateEndDate(today, billing),
        trialDays: clinic.trialDays || clinic.trialPeriodDays || plan.trialDays || 0,
        discountCode: clinic.discountCode || plan.discountCode || "",
        notes: clinic.notes || plan.notes || "",
        
        maxStaff: clinic.maxStaff || limits.maxStaff || "",
        maxDoctors: clinic.maxDoctors || limits.maxDoctors || "",
        maxPets: clinic.maxPets || limits.maxPets || "",
        storageLimit: clinic.storageLimit || limits.storageLimit || limits.storageLimitGB || "",

        labModule: Boolean(clinic.labModule ?? features.labModule ?? false),
        groomingModule: Boolean(clinic.groomingModule ?? features.groomingModule ?? false),
        kennelModule: Boolean(clinic.kennelModule ?? features.kennelModule ?? false),
        pharmacyModule: Boolean(clinic.pharmacyModule ?? features.pharmacyModule ?? false),
        inventoryModule: Boolean(clinic.inventoryModule ?? features.inventoryModule ?? false),
        telemedicineModule: Boolean(clinic.telemedicineModule ?? features.telemedicineModule ?? false),
        apiAccess: Boolean(clinic.apiAccess ?? features.apiAccess ?? false),
        whiteLabel: Boolean(clinic.whiteLabel ?? features.whiteLabel ?? false),

        logo: filePlaceholder(docs.clinicLogo || docs.clinicLogoUrl || clinic.logoName, docs.clinicLogoName),
        vetCert: filePlaceholder(docs.vetCouncilCertificate || docs.vetCouncilCertificateUrl || clinic.vetCertName, docs.vetCouncilCertificateName),
        tradeDoc: filePlaceholder(docs.tradeLicense || docs.tradeLicenseUrl || clinic.tradeDocName, docs.tradeLicenseName),
        drugDoc: filePlaceholder(docs.drugLicense || docs.drugLicenseUrl || clinic.drugDocName, docs.drugLicenseName),
        cheque: filePlaceholder(docs.cancelledCheque || docs.cancelledChequeUrl || clinic.chequeName, docs.cancelledChequeName),
        idDoc: filePlaceholder(docs.idDocument || docs.idDocumentUrl || clinic.idDocName || docs.governmentId || docs.governmentIdUrl, docs.idDocumentName),
        profile: filePlaceholder(docs.adminProfile || docs.adminProfileUrl || clinic.profileName, docs.adminProfileName),
    };
};

const getUpdatePayload = (form) => {
    // FIX: Safely map UI plan names (Standard/Professional) to strict Backend Enums
    let mappedSubscriptionType = "FREE_TIER";
    const planStr = String(form.plan).toUpperCase();
    const billingStr = String(form.billing).toUpperCase();

    if (planStr.includes("STANDARD") || billingStr === "MONTHLY" || planStr === "6_MONTHS") {
        mappedSubscriptionType = "6_MONTHS";
    }
    if (planStr.includes("PROFESSIONAL") || planStr.includes("ENTERPRISE") || billingStr === "ANNUAL" || planStr === "12_MONTHS") {
        mappedSubscriptionType = "12_MONTHS";
    }

    return {
        name: form.clinicName,
        facilityType: form.facilityType,
        yearOfEstablishment: form.year,
        address: [form.address1, form.city, form.state].filter(Boolean).join(", "),
        email: form.email,
        contactEmail: form.email,
        phone: form.phone,
        alternateContact: form.altPhone,
        website: form.website,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPhone: form.adminPhone,
        adminDesignation: form.designation,
        latitude: form.latitude,
        longitude: form.longitude,

        // Apply mapped enum value instead of raw text
        subscriptionType: mappedSubscriptionType, 
        billingCycle: form.billing,
        planStartDate: form.startDate,
        planEndDate: form.endDate,
        trialDays: form.trialDays,
        discountCode: form.discountCode,
        notes: form.notes,
        
        licenseLimits: {
            maxDoctors: form.maxDoctors,
            maxStaff: form.maxStaff,
            maxPets: form.maxPets,
            storageLimit: form.storageLimit,
        },
        taxDetails: {
            gstNumber: form.gst,
            panNumber: form.pan,
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            ifscCode: form.ifsc,
        },
        registrationDetails: {
            vetRegistrationNumber: form.vetReg,
            stateCouncil: form.stateCouncil,
            vetExpiry: form.vetExpiry,
            tradeLicenseNumber: form.tradeLicense,
            tradeExpiry: form.tradeExpiry,
            drugLicenseNumber: form.drugLicense,
            drugExpiry: form.drugExpiry,
        },
        adminDetails: {
            adminName: form.adminName,
            adminEmail: form.adminEmail,
            adminPhone: form.adminPhone,
            designation: form.designation,
            govtIdType: form.govtIdType,
            govtIdNumber: form.govtIdNumber,
        },
        addressDetails: {
            addressLine1: form.address1,
            addressLine2: form.address2,
            city: form.city,
            district: form.district,
            state: form.state,
            pincode: form.pincode,
            serviceAreas: form.serviceAreas,
        },
        features: {
            labModule: form.labModule,
            groomingModule: form.groomingModule,
            kennelModule: form.kennelModule,
            pharmacyModule: form.pharmacyModule,
            inventoryModule: form.inventoryModule,
            telemedicineModule: form.telemedicineModule,
            apiAccess: form.apiAccess,
            whiteLabel: form.whiteLabel,
        }
    };
};

export default function LatestClinicApprovals() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [modalMode, setModalMode] = useState("");
    const [activeTab, setActiveTab] = useState("identity");
    const [form, setForm] = useState(getClinicForm());
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");

    const fetchClinics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getClinics();
            if (response.success) {
                setClinics(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch clinics", error);
            showToast({
                type: "error",
                title: "Clinics Unavailable",
                description: error.response?.data?.message || "Unable to load clinics.",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClinics();
    }, [fetchClinics]);

    const openClinicModal = (mode, clinic) => {
        setSelectedClinic(clinic);
        setForm(getClinicForm(clinic));
        setActiveTab("identity");
        setModalMode(mode);
    };

    const closeModal = () => {
        setSelectedClinic(null);
        setModalMode("");
        setActiveTab("identity");
        setForm(getClinicForm());
        setSaving(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => {
            const updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            if (name === "billing" || name === "startDate") {
                updated.endDate = calculateEndDate(
                    name === "startDate" ? value : updated.startDate,
                    name === "billing" ? value : updated.billing
                );
            }
            return updated;
        });
    };

    const handleUpdateClinic = async (updatedForm) => {
        if (!selectedClinic?._id) return;

        setSaving(true);
        try {
            const response = await updateClinic(selectedClinic._id, getUpdatePayload(updatedForm));
            await uploadClinicDocuments(selectedClinic._id, updatedForm);
            showToast({
                type: "success",
                title: "Clinic Updated",
                description: response.message || "Clinic details updated successfully.",
            });
            closeModal();
            fetchClinics();
        } catch (error) {
            console.error("Failed to update clinic", error);
            showToast({
                type: "error",
                title: "Update Failed",
                description: error.response?.data?.message || "Unable to update clinic.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClinic = async (clinic) => {
        if (!clinic?._id) return;

        const confirmed = window.confirm(
            `Delete ${clinic.name || "this clinic"}? This action cannot be undone.`
        );
        if (!confirmed) return;

        setDeletingId(clinic._id);
        try {
            const response = await deleteClinic(clinic._id);
            showToast({
                type: "success",
                title: "Clinic Deleted",
                description: response.message || "Clinic record removed successfully.",
            });
            await fetchClinics();
        } catch (error) {
            console.error("Failed to delete clinic", error);
            showToast({
                type: "error",
                title: "Delete Failed",
                description: error.response?.data?.message || "Unable to delete clinic.",
            });
        } finally {
            setDeletingId("");
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border bg-white shadow">
                <div className="flex flex-col gap-4 border-b bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-2 text-orange-500">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800 md:text-lg">
                                Latest Clinic Approvals
                            </h2>
                            <p className="text-xs text-gray-500 md:text-sm">
                                Review the most recent clinic registration requests.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className={`hidden ${tableGrid} gap-3 border-b bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 md:grid lg:px-6`}>
                        <span>CLINIC</span>
                        <span>TYPE</span>
                        <span>LOCATION</span>
                        <span>CONTACT</span>
                        <span>PLAN</span>
                        <span>STATUS</span>
                        <span className="text-right">ACTIONS</span>
                    </div>

                    {loading ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            Loading clinics...
                        </div>
                    ) : clinics.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No clinics found.
                        </div>
                    ) : (
                        clinics.map((clinic) => {
                            const status = getDisplayStatus(clinic);
                            const clinicType = getClinicType(clinic);

                            return (
                                <div
                                    key={clinic._id}
                                    className={`grid grid-cols-1 gap-3 border-b px-4 py-4 transition hover:bg-gray-50 ${tableGrid} md:items-center md:gap-3 lg:px-6`}
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-800" title={clinic.name}>
                                            {clinic.name || "Unnamed clinic"}
                                        </p>
                                        <p className="truncate text-xs text-gray-400" title={clinic._id}>
                                            {clinic._id?.slice(-6).toUpperCase() || "N/A"}
                                        </p>
                                    </div>

                                    <span className="truncate text-sm font-medium text-blue-600" title={clinicType}>
                                        <span className="mr-2 text-xs font-semibold text-gray-400 md:hidden">Type:</span>
                                        {clinicType || "N/A"}
                                    </span>

                                    <div className="flex min-w-0 items-center gap-2 text-gray-700" title={clinic.address}>
                                        <MapPin size={14} className="shrink-0 text-orange-500" />
                                        <span className="truncate">{clinic.address || "N/A"}</span>
                                    </div>

                                    <div className="flex min-w-0 items-center gap-2 text-gray-700" title={getContactEmail(clinic)}>
                                        <Mail size={14} className="shrink-0 text-orange-500" />
                                        <span className="truncate">{getContactEmail(clinic)}</span>
                                    </div>

                                    <span className="truncate text-xs font-medium text-blue-600">
                                        <span className="mr-2 font-semibold text-gray-400 md:hidden">Plan:</span>
                                        {getPlanValue(clinic).replace("_", " ")}
                                    </span>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs ${
                                            statusStyles[clinic.verificationStatus] ||
                                            statusStyles[clinic.subscriptionStatus] ||
                                            "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {status}
                                    </span>

                                    <div className="flex flex-wrap gap-2 md:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openClinicModal("view", clinic)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                            title="View clinic"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openClinicModal("edit", clinic)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition hover:bg-orange-100"
                                            title="Edit clinic"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClinic(clinic)}
                                            disabled={deletingId === clinic._id}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            title="Delete clinic"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {modalMode === "view" && selectedClinic && (
                <ClinicDetailsModal
                    clinic={selectedClinic}
                    onClose={closeModal}
                    onEdit={(clinic) => openClinicModal("edit", clinic)}
                    onDelete={handleDeleteClinic}
                />
            )}

            {modalMode === "edit" && selectedClinic && (
                <FullClinicModal
                    mode={modalMode}
                    clinic={selectedClinic}
                    activeTab={activeTab}
                    form={form}
                    saving={saving}
                    setForm={setForm}
                    handleChange={handleChange}
                    setActiveTab={setActiveTab}
                    onClose={closeModal}
                    onSubmitClinic={handleUpdateClinic}
                />
            )}
        </>
    );
}

function ClinicDetailsModal({ clinic, onClose, onEdit, onDelete }) {
    if (!clinic) return null;

    const form = getClinicForm(clinic);
    const status = getDisplayStatus(clinic);

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">
            <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                            Clinic Profile
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-900">
                            {form.clinicName || "Unnamed Clinic"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {clinic._id ? `CLINIC-${clinic._id.slice(-6).toUpperCase()}` : "-"}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="grid gap-4">
                        <DetailSection title="Overview">
                            <DetailField label="Status" value={status} />
                            <DetailField label="Facility Type" value={form.facilityType} />
                            <DetailField label="Contact Email" value={form.email} />
                            <DetailField label="Phone" value={form.phone} />
                            <DetailField label="Subscription Plan" value={form.plan} />
                            <DetailField label="Expiry / Renewal Date" value={formatDate(form.endDate)} />
                        </DetailSection>

                        <DetailSection title="Clinic Identity">
                            <DetailField label="Clinic Name" value={form.clinicName} />
                            <DetailField label="Year of Establishment" value={form.year} />
                            <DetailField label="Alternate Contact" value={form.altPhone} />
                            <DetailField label="Website" value={form.website} />
                        </DetailSection>

                        <DetailSection title="Address & Location">
                            <DetailField label="Address Line 1" value={form.address1} wide />
                            <DetailField label="Address Line 2" value={form.address2} wide />
                            <DetailField label="City" value={form.city} />
                            <DetailField label="District" value={form.district} />
                            <DetailField label="State" value={form.state} />
                            <DetailField label="PIN Code" value={form.pincode} />
                            <DetailField label="Latitude" value={form.latitude} />
                            <DetailField label="Longitude" value={form.longitude} />
                            <DetailField label="Service Areas" value={form.serviceAreas} wide />
                        </DetailSection>

                        <DetailSection title="Registrations & Licenses">
                            <DetailField label="State Vet Council" value={form.stateCouncil} />
                            <DetailField label="Registration Number" value={form.vetReg} />
                            <DetailField label="Registration Expiry" value={formatDate(form.vetExpiry)} />
                            <DetailField label="Drug License Number" value={form.drugLicense} />
                            <DetailField label="Drug License Expiry" value={formatDate(form.drugExpiry)} />
                            <DetailField label="Trade License Number" value={form.tradeLicense} />
                            <DetailField label="Trade License Expiry" value={formatDate(form.tradeExpiry)} />
                        </DetailSection>

                        <DetailSection title="Tax & Banking">
                            <DetailField label="GST Number" value={form.gst} />
                            <DetailField label="PAN Number" value={form.pan} />
                            <DetailField label="Bank Name" value={form.bankName} />
                            <DetailField label="Account Number" value={form.accountNumber} />
                            <DetailField label="IFSC Code" value={form.ifsc} />
                        </DetailSection>

                        <DetailSection title="Admin Info">
                            <DetailField label="Admin Name" value={form.adminName} />
                            <DetailField label="Designation" value={form.designation} />
                            <DetailField label="Admin Mobile" value={form.adminPhone} />
                            <DetailField label="Admin Email" value={form.adminEmail} />
                            <DetailField label="Government ID Type" value={form.govtIdType} />
                            <DetailField label="Government ID Number" value={form.govtIdNumber} />
                        </DetailSection>

                        <ClinicDocuments form={form} />

                        <DetailSection title="Plan & Features">
                            <DetailField label="Plan" value={form.plan} />
                            <DetailField label="Billing Cycle" value={form.billing} />
                            <DetailField label="Start Date" value={formatDate(form.startDate)} />
                            <DetailField label="Trial Days" value={form.trialDays} />
                            <DetailField label="Discount Code" value={form.discountCode} />
                            <DetailField label="Storage Limit (GB)" value={form.storageLimit} />
                            <DetailField label="Max Doctors" value={form.maxDoctors} />
                            <DetailField label="Max Staff" value={form.maxStaff} />
                            <DetailField label="Max Pets" value={form.maxPets} />
                            <DetailField label="Lab Module" value={form.labModule} />
                            <DetailField label="Grooming Module" value={form.groomingModule} />
                            <DetailField label="Kennel Module" value={form.kennelModule} />
                            <DetailField label="Pharmacy Module" value={form.pharmacyModule} />
                            <DetailField label="Inventory Module" value={form.inventoryModule} />
                            <DetailField label="Telemedicine Module" value={form.telemedicineModule} />
                            <DetailField label="API Access" value={form.apiAccess} />
                            <DetailField label="White Label" value={form.whiteLabel} />
                            <DetailField label="Notes" value={form.notes} wide />
                        </DetailSection>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                    {onDelete && (
                        <button onClick={() => onDelete(clinic)} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 sm:w-auto">
                            Delete
                        </button>
                    )}
                    {onEdit && (
                        <button onClick={() => onEdit(clinic)} className="w-full rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 sm:w-auto">
                            Edit
                        </button>
                    )}
                    <button onClick={onClose} className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function FullClinicModal({
    mode,
    activeTab,
    form,
    saving,
    setForm,
    handleChange,
    setActiveTab,
    onClose,
    onSubmitClinic,
}) {
    const isView = mode === "view";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:w-[95%] h-screen sm:h-[95vh] rounded-none sm:rounded-3xl shadow-xl flex flex-col overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 py-4 bg-white">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            {isView ? "View Clinic" : "Edit Clinic"}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isView ? "Complete clinic details in read-only mode." : "Update complete clinic details."}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-orange-50 text-slate-500 hover:text-orange-500 inline-flex items-center justify-center">
                        <X size={18} />
                    </button>
                </div>

                <Stepper
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-6">
                    <ClinicForm
                        activeTab={activeTab}
                        form={form}
                        setForm={setForm}
                        handleChange={handleChange}
                        validateTab={() => true}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                        onClose={onClose}
                        readOnly={isView}
                        skipTabValidation
                        skipSubmitValidation
                        submitLabel={saving ? "Saving..." : "Save Changes"}
                        onSubmitClinic={onSubmitClinic}
                    />
                </div>
            </div>
        </div>
    );
}
