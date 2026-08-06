/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { getClinics, updateClinicVerification } from "../../api/clinicApi";
import { showToast } from "../../../../shared/components/toast";

// Self-registered clinics (Testing server's public "Register your clinic"
// sign-up) land here just like Super-Admin-created ones - every clinic
// defaults to verificationStatus "SUBMITTED" (see Clinic.js) and is
// blocked from the dashboard by the shared getClinicGateError check until
// approved here, regardless of how it was created.
const STATUS_LABELS = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    DOCS_VERIFIED: "Docs Verified",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

const STATUS_STYLES = {
    SUBMITTED: "bg-orange-100 text-orange-600",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-600",
    DOCS_VERIFIED: "bg-blue-100 text-blue-600",
    APPROVED: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-600",
};

const SOLO_DOCTOR_PLAN_NAMES = new Set(["Solo Basic", "Solo Pro"]);
const getClinicType = (clinic) => (SOLO_DOCTOR_PLAN_NAMES.has(clinic.plan) ? "Solo Veterinarian" : "Clinic");

const tabs = [
    { key: "all", label: "All" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "UNDER_REVIEW", label: "Under Review" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
];

const VerificationCenter = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const loadClinics = async () => {
        setLoading(true);
        try {
            const res = await getClinics();
            setClinics(res.data || []);
        } catch (error) {
            showToast({
                type: "error",
                title: "Failed to load clinics",
                description: error.response?.data?.message || "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClinics();
    }, []);

    const counts = tabs.reduce((acc, tab) => {
        acc[tab.key] = tab.key === "all"
            ? clinics.length
            : clinics.filter((c) => (c.verificationStatus || "SUBMITTED") === tab.key).length;
        return acc;
    }, {});

    const filtered = clinics.filter((clinic) => {
        const status = clinic.verificationStatus || "SUBMITTED";
        const matchTab = activeTab === "all" || status === activeTab;
        const matchSearch = (clinic.name || "").toLowerCase().includes(search.toLowerCase())
            || (clinic.contactEmail || clinic.email || "").toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const handleUpdate = async (clinic, status) => {
        let rejectionReason;
        if (status === "REJECTED") {
            rejectionReason = window.prompt(`Reason for rejecting ${clinic.name}?`) || "";
            if (rejectionReason === null) return;
        }

        setBusyId(clinic._id);
        try {
            await updateClinicVerification(clinic._id, status, rejectionReason);
            showToast({
                type: "success",
                title: status === "APPROVED" ? "Clinic approved" : status === "REJECTED" ? "Clinic rejected" : "Status updated",
                description: `${clinic.name} is now ${STATUS_LABELS[status]}.`,
            });
            loadClinics();
        } catch (error) {
            showToast({
                type: "error",
                title: "Could not update status",
                description: error.response?.data?.message || "Please try again.",
            });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-orange-600">
                    Verification Center
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                    Review and approve clinic / solo veterinarian registrations before they can access the dashboard.
                </p>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 px-4 py-2 rounded-xl text-sm border transition ${
                            activeTab === tab.key ? "bg-white shadow text-black" : "text-gray-500 bg-white"
                        }`}
                    >
                        {tab.label} ({counts[tab.key] || 0})
                    </button>
                ))}
            </div>

            <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-left">
                            <tr>
                                <th className="p-4">ENTITY</th>
                                <th>TYPE</th>
                                <th>PLAN</th>
                                <th>CONTACT</th>
                                <th>STATUS</th>
                                <th className="text-right pr-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400">No results found</td></tr>
                            ) : (
                                filtered.map((clinic) => {
                                    const status = clinic.verificationStatus || "SUBMITTED";
                                    return (
                                        <tr key={clinic._id} className="border-t hover:bg-gray-50 transition">
                                            <td className="p-4 font-medium whitespace-nowrap">{clinic.name}</td>
                                            <td>{getClinicType(clinic)}</td>
                                            <td>{clinic.plan || "-"}</td>
                                            <td className="text-gray-500">{clinic.contactEmail || clinic.email || "-"}</td>
                                            <td>
                                                <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
                                                    {STATUS_LABELS[status] || status}
                                                </span>
                                            </td>
                                            <td className="text-right pr-4">
                                                <div className="flex justify-end gap-2">
                                                    {status !== "APPROVED" && (
                                                        <button
                                                            onClick={() => handleUpdate(clinic, "APPROVED")}
                                                            disabled={busyId === clinic._id}
                                                            title="Approve"
                                                            className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                    {status !== "UNDER_REVIEW" && status !== "APPROVED" && status !== "REJECTED" && (
                                                        <button
                                                            onClick={() => handleUpdate(clinic, "UNDER_REVIEW")}
                                                            disabled={busyId === clinic._id}
                                                            title="Mark Under Review"
                                                            className="rounded-lg p-1.5 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
                                                        >
                                                            <Clock3 size={16} />
                                                        </button>
                                                    )}
                                                    {status !== "REJECTED" && (
                                                        <button
                                                            onClick={() => handleUpdate(clinic, "REJECTED")}
                                                            disabled={busyId === clinic._id}
                                                            title="Reject"
                                                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VerificationCenter;
