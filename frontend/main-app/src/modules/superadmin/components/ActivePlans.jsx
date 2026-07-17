import { useEffect, useMemo, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deletePlan, getPlans } from "../api/planApi";
import { showToast } from "../../../shared/components/toast";

const SOLO_DOCTOR_PLAN_NAMES = new Set(["Solo Basic", "Solo Pro"]);

const resolvePlanType = (plan) => {
    if (plan?.planType === "Solo Doctor") return "Solo Doctor";
    if (SOLO_DOCTOR_PLAN_NAMES.has(plan?.subscriptionPlan)) return "Solo Doctor";
    return "Clinic";
};

const FILTER_OPTIONS = ["All", "Clinic", "Solo Doctor"];

const getStatusClassName = (status) => {
    switch (status) {
        case "Inactive":
            return "bg-amber-100 text-amber-700";
        case "Archived":
            return "bg-slate-100 text-slate-600";
        default:
            return "bg-green-100 text-green-700";
    }
};

export default function ActivePlans({ refreshKey = 0, onEditPlan, onChanged }) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadPlans = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getPlans();
                if (active) setPlans(response.data || []);
            } catch (err) {
                if (active) setError(err.response?.data?.message || "Unable to load plans");
            } finally {
                if (active) setLoading(false);
            }
        };

        loadPlans();

        return () => {
            active = false;
        };
    }, [refreshKey]);

    const stats = useMemo(() => {
        const typeCounts = plans.reduce(
            (accumulator, plan) => {
                const planType = resolvePlanType(plan);
                accumulator.total += 1;
                accumulator.active += !plan.status || plan.status === "Active" ? 1 : 0;
                accumulator[planType === "Solo Doctor" ? "soloDoctor" : "clinic"] += 1;
                return accumulator;
            },
            {
                total: 0,
                active: 0,
                clinic: 0,
                soloDoctor: 0,
            }
        );

        return typeCounts;
    }, [plans]);

    const visiblePlans = useMemo(
        () =>
            plans.filter((plan) => {
                const planType = resolvePlanType(plan);
                return selectedFilter === "All" || selectedFilter === planType;
            }),
        [plans, selectedFilter]
    );

    const formatDate = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("en-IN");
    };

    const formatPrice = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));

    const handleDelete = async (plan) => {
        const confirmed = window.confirm(
            `Delete ${plan.subscriptionPlan} (${resolvePlanType(plan)})? This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await deletePlan(plan._id);
            showToast({
                type: "success",
                title: "Plan Deleted",
                description: `${plan.subscriptionPlan} was removed successfully.`,
            });
            onChanged?.();
        } catch (err) {
            showToast({
                type: "error",
                title: "Delete Failed",
                description: err.response?.data?.message || "Unable to delete plan",
            });
        } finally {
            setOpenMenuId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-800">
                        Active Subscription Plans
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage clinic and solo doctor plan definitions from one place
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.map((option) => {
                        const count = option === "All"
                            ? stats.total
                            : option === "Solo Doctor"
                                ? stats.soloDoctor
                                : stats.clinic;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setSelectedFilter(option)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                    selectedFilter === option
                                        ? "border-orange-500 bg-orange-50 text-orange-600"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {option} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-5 mb-4 border-b border-gray-100">
                {[
                    { num: stats.total, label: "Total Plans", bg: "#fff7ed", iconColor: "#f97316" },
                    { num: stats.active, label: "Active Plans", bg: "#eff6ff", iconColor: "#3b82f6" },
                    { num: stats.clinic, label: "Clinic Plans", bg: "#f0fdf4", iconColor: "#22c55e" },
                    { num: stats.soloDoctor, label: "Solo Doctor Plans", bg: "#faf5ff", iconColor: "#a855f7" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={item.iconColor} strokeWidth={2}>
                                <path d="M12 8v8m-4-4h8" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-extrabold text-gray-800">{item.num}</div>
                            <div className="text-xs text-gray-400">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-[1350px] w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <Header>Plan ID</Header>
                            <Header>Type</Header>
                            <Header>Subscription Plan</Header>
                            <Header>Billing</Header>
                            <Header>Price</Header>
                            <Header>Renewal</Header>
                            <Header>Doctors</Header>
                            <Header>Staff</Header>
                            <Header>Pet Records</Header>
                            <Header>Storage</Header>
                            <Header>Trial</Header>
                            <Header>Modules</Header>
                            <Header>Status</Header>
                            <Header>Actions</Header>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                {/* colSpan updated to 14 because checkbox column is removed */}
                                <td colSpan={14} className="py-8 px-3 text-center text-gray-500">
                                    Loading plans...
                                </td>
                            </tr>
                        )}

                        {!loading && visiblePlans.length === 0 && (
                            <tr>
                                {/* colSpan updated to 14 because checkbox column is removed */}
                                <td colSpan={14} className="py-8 px-3 text-center text-gray-500">
                                    No {selectedFilter === "All" ? "" : `${selectedFilter.toLowerCase()} `}plans found.
                                </td>
                            </tr>
                        )}

                        {visiblePlans.map((plan) => {
                            const planType = resolvePlanType(plan);
                            const isActiveMenu = openMenuId === plan._id;

                            return (
                                <tr key={plan._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="py-3 px-3 text-orange-500 font-semibold">
                                        #{plan.planCode || plan._id?.slice(-6)}
                                    </td>

                                    <td className="py-3 px-3">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${planType === "Solo Doctor" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
                                            {planType}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-orange-500">
                                                {plan.subscriptionPlan?.slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800 whitespace-nowrap">
                                                {plan.subscriptionPlan}
                                            </span>
                                        </div>
                                    </td>

                                    <Cell>{plan.billingCycle}</Cell>
                                    <Cell>{formatPrice(plan.price)}</Cell>
                                    <Cell>{formatDate(plan.planEndRenewalDate)}</Cell>
                                    <Cell>{plan.featureLimits?.maxDoctors}</Cell>
                                    <Cell>{plan.featureLimits?.maxStaffAccounts}</Cell>
                                    <Cell>{plan.featureLimits?.maxPetRecordsUnlimited ? "Unlimited" : plan.featureLimits?.maxPetRecords}</Cell>
                                    <Cell>{plan.featureLimits?.storageLimitGb} GB</Cell>
                                    <Cell>{plan.trialPeriodDays || 0} days</Cell>
                                    <Cell>{Object.values(plan.modules || {}).filter(Boolean).length}</Cell>

                                    <td className="py-3 px-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClassName(plan.status)}`}>
                                            {plan.status}
                                        </span>
                                    </td>

                                    <td className="relative py-3 px-3">
                                        <button
                                            type="button"
                                            onClick={() => setOpenMenuId(isActiveMenu ? null : plan._id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                                            aria-label="Plan actions"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {isActiveMenu && (
                                            <div className="absolute right-3 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onEditPlan?.(plan);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                                                >
                                                    <Pencil size={16} className="text-orange-600" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(plan)}
                                                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} className="text-red-600" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Header({ children }) {
    return (
        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
            {children}
        </th>
    );
}

function Cell({ children }) {
    return <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{children}</td>;
}