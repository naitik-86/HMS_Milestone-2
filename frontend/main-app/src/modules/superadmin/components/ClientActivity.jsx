import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
};

const getBadgeClass = (value, tone) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold";

    const toneMap = {
        green: "bg-green-50 text-green-700",
        amber: "bg-amber-50 text-amber-700",
        rose: "bg-rose-50 text-rose-700",
        blue: "bg-blue-50 text-blue-700",
        slate: "bg-slate-100 text-slate-600",
    };

    return `${base} ${toneMap[tone] || toneMap.slate}`;
};

const getSubscriptionTone = (status) => {
    if (status === "ACTIVE") return "green";
    if (status === "SUSPENDED") return "amber";
    if (status === "EXPIRED") return "rose";
    return "slate";
};

const getVerificationTone = (status) => {
    if (status === "APPROVED") return "green";
    if (status === "REJECTED") return "rose";
    if (status === "DOCS_VERIFIED") return "blue";
    if (status === "UNDER_REVIEW") return "amber";
    return "slate";
};

const getInitials = (name) => {
    const parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) return "C";

    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
};

function ClientActivity({ summary = {}, clinics = [] }) {
    const navigate = useNavigate();
    const [checked, setChecked] = useState({});

    const visibleClinics = Array.isArray(clinics) ? clinics : [];

    const metricCards = useMemo(
        () => [
            {
                num: summary.newClinicsThisWeek || 0,
                label: "New Clinics (This Week)",
                bg: "#eff6ff",
                iconColor: "#3b82f6",
            },
            {
                num: summary.newClinicsThisMonth || 0,
                label: "New Clinics (This Month)",
                bg: "#f0fdf4",
                iconColor: "#22c55e",
            },
            {
                num: summary.activeClinics || 0,
                label: "Active Clinics",
                bg: "#fff7ed",
                iconColor: "#f97316",
            },
        ],
        [summary]
    );

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm my-2 overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-[#1a1a2e]">
                        Clinic Activity
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Pending reviews: {summary.pendingReviews || 0}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/superadmin/clinics")}
                    className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 flex items-center justify-center gap-1 hover:border-orange-200 hover:text-orange-500 transition"
                >
                    View All Clinics
                    <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-5 mb-4 border-b border-gray-100">
                {metricCards.map((metric, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: metric.bg }}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={metric.iconColor}
                                strokeWidth={2}
                            >
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div>
                            <div className="text-xl font-extrabold text-[#1a1a2e]">
                                {metric.num}
                            </div>
                            <div className="text-xs text-gray-400">
                                {metric.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-2 px-3 text-left w-8">
                                <input
                                    type="checkbox"
                                    className="accent-orange-500 w-3.5 h-3.5"
                                />
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Clinic ID
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Clinic Name
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Email
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Subscription
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Verification
                            </th>

                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">
                                Joined On
                            </th>

                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleClinics.length ? (
                            visibleClinics.map((clinic) => {
                                const rowKey =
                                    clinic.displayId ||
                                    clinic._id ||
                                    clinic.name ||
                                    clinic.contactEmail;

                                return (
                                    <tr
                                        key={rowKey}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-2.5 px-3">
                                            <input
                                                type="checkbox"
                                                className="accent-orange-500 w-3.5 h-3.5"
                                                checked={!!checked[rowKey]}
                                                onChange={() =>
                                                    setChecked((current) => ({
                                                        ...current,
                                                        [rowKey]: !current[rowKey],
                                                    }))
                                                }
                                            />
                                        </td>

                                        <td className="py-2.5 px-3 text-orange-500 font-semibold">
                                            {clinic.displayId || "#---"}
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br from-orange-500 to-orange-700"
                                                >
                                                    {getInitials(clinic.name)}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="text-gray-800 font-medium truncate">
                                                        {clinic.name}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 truncate">
                                                        {clinic.subscriptionStatus || "Unknown subscription"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-2.5 px-3 text-gray-500">
                                            {clinic.contactEmail || "-"}
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <span className={getBadgeClass(clinic.subscriptionStatus, getSubscriptionTone(clinic.subscriptionStatus))}>
                                                {clinic.subscriptionStatus || "Unknown"}
                                            </span>
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <span className={getBadgeClass(clinic.verificationStatus, getVerificationTone(clinic.verificationStatus))}>
                                                {clinic.verificationStatus || "Unknown"}
                                            </span>
                                        </td>

                                        <td className="py-2.5 px-3 text-gray-500">
                                            {formatDate(clinic.createdAt)}
                                        </td>

                                        <td className="py-2.5 px-3">
                                            <button
                                                type="button"
                                                className="text-gray-300 hover:text-gray-500 text-lg px-1"
                                            >
                                                ⋮
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="py-8 text-center text-sm text-gray-400"
                                >
                                    No recent clinic records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientActivity;
