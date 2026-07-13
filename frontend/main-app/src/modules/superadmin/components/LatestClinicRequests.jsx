import { useState, useEffect } from "react";
import {
    MapPin,
    Mail,
    ClipboardCheck,
    Trash2,
} from "lucide-react";
import { showToast } from "../../../shared/components/toast";

import { deleteClinic, getClinics } from "../api/clinicApi";

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

export default function LatestClinicApprovals() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingClinicId, setDeletingClinicId] = useState(null);

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

    const handleDeleteClinic = async (clinic) => {
        const confirmed = window.confirm(
            `Delete "${clinic.name}"? This will remove the clinic, its admin, staff, and related records.`
        );

        if (!confirmed) {
            return;
        }

        setDeletingClinicId(clinic._id);

        try {
            await deleteClinic(clinic._id);
            setClinics((prev) => prev.filter((item) => item._id !== clinic._id));

            showToast({
                type: "success",
                title: "Clinic deleted",
                description: `${clinic.name} has been removed.`,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Delete failed",
                description:
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to delete clinic.",
            });
        } finally {
            setDeletingClinicId(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 border-b bg-gray-50">

                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-500 p-2 rounded-xl">
                        <ClipboardCheck size={20} />
                    </div>

                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">
                            Latest Clinic Approvals
                        </h2>

                        <p className="text-xs md:text-sm text-gray-500">
                            Review the most recent clinic registration requests.
                        </p>
                    </div>
                </div>

                <button className="w-full sm:w-auto text-sm border px-4 py-2 rounded-lg hover:bg-gray-100 text-orange-500 border-orange-200 transition">
                    View All Clinics →
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                <div className="min-w-[950px]">

                    {/* TABLE HEADER */}
                    <div className="grid grid-cols-7 px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
                        <span>CLINIC</span>
                        <span>TYPE</span>
                        <span>LOCATION</span>
                        <span>CONTACT</span>
                        <span>PLAN</span>
                        <span>STATUS</span>
                        <span className="text-right">ACTIONS</span>
                    </div>

                    {/* TABLE BODY */}
                    {loading ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            Loading clinics...
                        </div>
                    ) : clinics.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No clinics found.
                        </div>
                    ) : (
                        clinics.map((c) => (
                            <div
                                key={c._id}
                                className="grid grid-cols-7 items-center px-4 md:px-6 py-4 border-b hover:bg-gray-50 transition"
                            >
                                {/* CLINIC */}
                                <div>
                                    <p
                                        className="font-medium text-gray-800 truncate"
                                        title={c.name}
                                    >
                                        {c.name}
                                    </p>

                                    <p
                                        className="text-xs text-gray-400 truncate"
                                        title={c._id}
                                    >
                                        {c._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>

                                {/* TYPE */}
                                <span className="text-blue-600 font-medium">
                                    Hospital
                                </span>

                                {/* LOCATION */}
                                <div
                                    className="flex items-center gap-2 text-gray-700"
                                    title={c.address}
                                >
                                    <MapPin
                                        size={14}
                                        className="text-orange-500 shrink-0"
                                    />

                                    <span className="truncate">
                                        {c.address || "N/A"}
                                    </span>
                                </div>

                                {/* CONTACT */}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Mail
                                        size={14}
                                        className="text-orange-500 shrink-0"
                                    />
                                    <span className="truncate">
                                        {c.contactEmail || "N/A"}
                                    </span>
                                </div>

                                {/* PLAN */}
                                <span className="text-blue-600 text-xs font-medium">
                                    {c.subscriptionType
                                        ? c.subscriptionType.replace("_", " ")
                                        : "—"}
                                </span>

                                {/* STATUS */}
                                <span
                                    className={`px-3 py-1 text-xs rounded-full w-fit ${
                                        statusStyles[c.verificationStatus] ||
                                        statusStyles[c.subscriptionStatus] ||
                                        "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {c.verificationStatus ||
                                        c.subscriptionStatus ||
                                        "Unknown"}
                                </span>

                                {/* ACTION */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClinic(c)}
                                        disabled={deletingClinicId === c._id}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Trash2 size={16} />
                                        {deletingClinicId === c._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}
