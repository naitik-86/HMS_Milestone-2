import { useEffect, useState } from "react";
import {
    ClipboardCheck,
    Eye,
    Mail,
    MapPin,
    Pencil,
} from "lucide-react";
import { showToast } from "../../../shared/components/toast";
import { getClinics } from "../api/clinicApi";

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
    "N/A";

const getContactEmail = (clinic) =>
    clinic.contactEmail || clinic.email || clinic.adminEmail || "N/A";

const getDisplayStatus = (clinic) =>
    clinic.verificationStatus || clinic.subscriptionStatus || "Unknown";

export default function LatestClinicApprovals() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await getClinics();

                if (response.success) {
                    setClinics(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch clinics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    const handleClinicAction = (action, clinic) => {
        showToast({
            type: "success",
            title: `${action} Clinic`,
            description: `${clinic.name || "Clinic"} selected.`,
        });
    };

    return (
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

                                <span className="truncate text-sm font-medium text-blue-600" title={getClinicType(clinic)}>
                                    <span className="mr-2 text-xs font-semibold text-gray-400 md:hidden">Type:</span>
                                    {getClinicType(clinic)}
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
                                        onClick={() => handleClinicAction("View", clinic)}
                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 md:flex-none"
                                    >
                                        <Eye size={15} />
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleClinicAction("Edit", clinic)}
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
    );
}
