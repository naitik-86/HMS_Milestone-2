import { useState, useEffect } from "react";
import {
    MapPin,
    Phone,
    MoreHorizontal,
    ClipboardCheck,
} from "lucide-react";
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

    return (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-500 p-2 rounded-xl">
                        <ClipboardCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Latest Clinic Approvals
                        </h2>
                        <p className="text-sm text-gray-500">
                            Review the most recent clinic registration requests.
                        </p>
                    </div>
                </div>

                <button className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-100 text-orange-500 border-orange-200">
                    View All Clinics →
                </button>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-7 px-6 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
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
                        className="grid grid-cols-7 items-center px-6 py-4 border-b hover:bg-gray-50 transition"
                    >
                        {/* CLINIC */}
                        <div>
                            <p className="font-medium text-gray-800 truncate" title={c.name}>{c.name}</p>
                            <p className="text-xs text-gray-400 truncate" title={c._id}>{c._id.slice(-6).toUpperCase()}</p>
                        </div>

                        {/* TYPE */}
                        <span className="text-blue-600 font-medium">Hospital</span>

                        {/* LOCATION */}
                        <div className="flex items-center gap-2 text-gray-700 truncate" title={c.address}>
                            <MapPin size={14} className="text-orange-500 shrink-0" />
                            <span className="truncate">{c.address || "N/A"}</span>
                        </div>

                        {/* CONTACT */}
                        <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={14} className="text-orange-500" />
                            N/A
                        </div>

                        {/* PLAN */}
                        <span className="text-blue-600 text-xs font-medium">
                            {c.subscriptionType ? c.subscriptionType.replace("_", " ") : "—"}
                        </span>

                        {/* STATUS */}
                        <span
                            className={`px-3 py-1 text-xs rounded-full w-fit ${statusStyles[c.verificationStatus] || statusStyles[c.subscriptionStatus] || "bg-gray-100 text-gray-600"}`}
                        >
                            {c.verificationStatus || c.subscriptionStatus || "Unknown"}
                        </span>

                        {/* ACTION */}
                        <div className="flex justify-end">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}