import { useEffect, useState } from "react";
import {
    ClipboardCheck,
    Eye,
    Mail,
    MapPin,
    Pencil,
    X,
} from "lucide-react";
import { showToast } from "../../../shared/components/toast";
import { calculateEndDate, getTodayDate } from "../../../shared/utils/calculateEndDate ";
import { getClinics, updateClinic } from "../api/clinicApi";
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
    "md:grid-cols-[minmax(0,1.2fr)_minmax(72px,.65fr)_minmax(0,1.35fr)_minmax(0,1.25fr)_minmax(74px,.65fr)_minmax(100px,.8fr)_minmax(132px,.85fr)]";

const getClinicType = (clinic) =>
    clinic.facilityType ||
    clinic.type ||
    clinic.clinicType ||
    clinic.facility_type ||
    "";

const getContactEmail = (clinic) =>
    clinic.contactEmail || clinic.email || clinic.adminEmail || "N/A";

const getDisplayStatus = (clinic) =>
    clinic.verificationStatus || clinic.subscriptionStatus || "Unknown";

const filePlaceholder = (name) => name ? { name, type: "application/pdf" } : null;

const getAddressDetails = (clinic) => clinic.addressDetails || clinic.address_details || {};

const getPlanValue = (clinic) =>
    clinic.plan || clinic.subscriptionPlan || clinic.subscriptionType || "Basic";

const getBillingValue = (clinic) =>
    clinic.billing || clinic.billingCycle || (clinic.subscriptionType === "12_MONTHS" ? "Annual" : "Monthly");

const getClinicForm = (clinic = {}) => {
    const today = getTodayDate();
    const billing = getBillingValue(clinic);
    const addressDetails = getAddressDetails(clinic);
    const docs = clinic.documents || clinic.documentDetails || {};

    return {
        clinicName: clinic.clinicName || clinic.name || "",
        facilityType: getClinicType(clinic),
        year: clinic.year || clinic.establishedYear || clinic.yearOfEstablishment || "",
        email: clinic.email || clinic.contactEmail || "",
        phone: clinic.phone || clinic.contactPhone || clinic.primaryContact || "",
        altPhone: clinic.altPhone || clinic.alternateContact || "",
        website: clinic.website || "",
        address1: addressDetails.addressLine1 || clinic.address1 || clinic.address || "",
        address2: addressDetails.addressLine2 || clinic.address2 || "",
        city: addressDetails.city || clinic.city || "",
        district: addressDetails.district || clinic.district || "",
        state: addressDetails.state || clinic.state || "",
        pincode: addressDetails.pincode || clinic.pincode || "",
        latitude: clinic.latitude || addressDetails.latitude || "",
        longitude: clinic.longitude || addressDetails.longitude || "",
        gst: clinic.gst || clinic.gstNumber || "",
        pan: clinic.pan || clinic.panNumber || "",
        bankName: clinic.bankName || "",
        accountNumber: clinic.accountNumber || "",
        ifsc: clinic.ifsc || clinic.ifscCode || "",
        adminName: clinic.adminName || "",
        adminPhone: clinic.adminPhone || "",
        adminEmail: clinic.adminEmail || "",
        plan: getPlanValue(clinic),
        billing,
        startDate: clinic.startDate || clinic.planStartDate || today,
        endDate: clinic.endDate || clinic.planEndDate || calculateEndDate(today, billing),
        trialDays: clinic.trialDays || clinic.trialPeriodDays || 0,
        discountCode: clinic.discountCode || "",
        notes: clinic.notes || "",
        maxStaff: clinic.maxStaff || "",
        maxDoctors: clinic.maxDoctors || "",
        maxPets: clinic.maxPets || "",
        storageLimit: clinic.storageLimit || "",
        labModule: Boolean(clinic.labModule),
        groomingModule: Boolean(clinic.groomingModule),
        kennelModule: Boolean(clinic.kennelModule),
        pharmacyModule: Boolean(clinic.pharmacyModule),
        inventoryModule: Boolean(clinic.inventoryModule),
        telemedicineModule: Boolean(clinic.telemedicineModule),
        apiAccess: Boolean(clinic.apiAccess),
        whiteLabel: Boolean(clinic.whiteLabel),
        serviceAreas: addressDetails.serviceAreas || clinic.serviceAreas || [addressDetails.serviceArea || ""],
        vetReg: clinic.vetReg || clinic.vetRegistrationNumber || "",
        stateCouncil: clinic.stateCouncil || clinic.vetCouncil || "",
        expiry: clinic.expiry || "",
        vetExpiry: clinic.vetExpiry || "",
        tradeLicense: clinic.tradeLicense || clinic.tradeLicenseNumber || "",
        tradeExpiry: clinic.tradeExpiry || "",
        drugLicense: clinic.drugLicense || clinic.drugLicenseNumber || "",
        drugExpiry: clinic.drugExpiry || "",
        designation: clinic.designation || clinic.adminDesignation || "",
        govtIdType: clinic.govtIdType || "Aadhar",
        govtIdNumber: clinic.govtIdNumber || "",
        logo: filePlaceholder(docs.clinicLogo || clinic.logoName),
        vetCert: filePlaceholder(docs.vetCouncilCertificate || clinic.vetCertName),
        tradeDoc: filePlaceholder(docs.tradeLicense || clinic.tradeDocName),
        drugDoc: filePlaceholder(docs.drugLicense || clinic.drugDocName),
        cheque: filePlaceholder(docs.cancelledCheque || clinic.chequeName),
        idDoc: filePlaceholder(docs.idDocument || clinic.idDocName),
        profile: filePlaceholder(docs.adminProfile || clinic.profileName),
    };
};

const getUpdatePayload = (form) => ({
    name: form.clinicName,
    facilityType: form.facilityType,
    address: [form.address1, form.city, form.state].filter(Boolean).join(", "),
    email: form.email,
    phone: form.phone,
    altPhone: form.altPhone,
    website: form.website,
    adminName: form.adminName,
    adminEmail: form.adminEmail,
    adminPhone: form.adminPhone,
    adminDesignation: form.designation,
    latitude: form.latitude,
    longitude: form.longitude,
    subscriptionType: form.plan,
    billingCycle: form.billing,
    startDate: form.startDate,
    endDate: form.endDate,
    trialDays: form.trialDays,
    discountCode: form.discountCode,
    notes: form.notes,
    maxDoctors: form.maxDoctors,
    maxStaff: form.maxStaff,
    maxPets: form.maxPets,
    storageLimit: form.storageLimit,
    gst: form.gst,
    pan: form.pan,
    bankName: form.bankName,
    accountNumber: form.accountNumber,
    ifsc: form.ifsc,
    vetRegistrationNumber: form.vetReg,
    stateCouncil: form.stateCouncil,
    vetExpiry: form.vetExpiry,
    tradeLicenseNumber: form.tradeLicense,
    tradeExpiry: form.tradeExpiry,
    drugLicenseNumber: form.drugLicense,
    drugExpiry: form.drugExpiry,
    govtIdType: form.govtIdType,
    govtIdNumber: form.govtIdNumber,
    labModule: form.labModule,
    groomingModule: form.groomingModule,
    kennelModule: form.kennelModule,
    pharmacyModule: form.pharmacyModule,
    inventoryModule: form.inventoryModule,
    telemedicineModule: form.telemedicineModule,
    apiAccess: form.apiAccess,
    whiteLabel: form.whiteLabel,
    addressDetails: {
        addressLine1: form.address1,
        addressLine2: form.address2,
        city: form.city,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        serviceAreas: form.serviceAreas,
    },
});





export default function LatestClinicApprovals() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [modalMode, setModalMode] = useState("");
    const [activeTab, setActiveTab] = useState("identity");
    const [form, setForm] = useState(getClinicForm());
    const [saving, setSaving] = useState(false);

    const fetchClinics = async () => {
        try {
            const response = await getClinics();
            console.log(response.data);
            if (response.success) {
                console.log(response.data[0]);
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
    };

    useEffect(() => {
        let active = true;

        const loadClinics = async () => {
            try {
                const response = await getClinics();

                if (active && response.success) {
                    setClinics(response.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch clinics", error);

                if (active) {
                    showToast({
                        type: "error",
                        title: "Clinics Unavailable",
                        description: error.response?.data?.message || "Unable to load clinics.",
                    });
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadClinics();

        return () => {
            active = false;
        };
    }, []);

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
                                        {clinic.subscriptionType
                                            ? clinic.subscriptionType.replace("_", " ")
                                            : "-"}
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

                                    <div className="flex gap-2 md:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openClinicModal("view", clinic)}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 md:flex-none"
                                        >
                                            <Eye size={15} />
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openClinicModal("edit", clinic)}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 md:flex-none"
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {modalMode && selectedClinic && (
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

function FullClinicModal({
    mode,
    clinic,
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

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-orange-50 text-slate-500 hover:text-orange-500 inline-flex items-center justify-center"
                        aria-label="Close"
                    >
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