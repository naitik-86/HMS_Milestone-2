import { useEffect, useMemo, useState } from "react";
import { getPlans } from "../api/planApi";

export default function ActivePlans({ refreshKey = 0 }) {
    const [checked, setChecked] = useState({});
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadPlans = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await getPlans();
                if (active) setPlans(res.data || []);
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
        const activePlans = plans.filter((plan) => plan.status === "Active").length;
        const maxTrial = plans.reduce((max, plan) => Math.max(max, Number(plan.trialPeriodDays || 0)), 0);
        const maxStorage = plans.reduce((max, plan) => Math.max(max, Number(plan.featureLimits?.storageLimitGb || 0)), 0);
        return { activePlans, maxTrial, maxStorage };
    }, [plans]);

    const formatDate = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString("en-IN");
    };

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-800">
                        Active Subscription Plans
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Currently available plans for clinics
                    </p>
                </div>

                <button className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                    View All Plans
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-5 mb-4 border-b border-gray-100">
                {[
                    { num: stats.activePlans, label: "Active Plans", bg: "#fff7ed", iconColor: "#f97316" },
                    { num: `${stats.maxStorage} GB`, label: "Max Storage", bg: "#eff6ff", iconColor: "#3b82f6" },
                    { num: stats.maxTrial, label: "Max Trial Days", bg: "#f0fdf4", iconColor: "#22c55e" },
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
                <table className="min-w-[1250px] w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-3 px-3 text-left w-8">
                                <input type="checkbox" className="accent-orange-500" />
                            </th>
                            <Header>Plan ID</Header>
                            <Header>Subscription Plan</Header>
                            <Header>Billing</Header>
                            <Header>Renewal</Header>
                            <Header>Doctors</Header>
                            <Header>Staff</Header>
                            <Header>Pet Records</Header>
                            <Header>Storage</Header>
                            <Header>Trial</Header>
                            <Header>Modules</Header>
                            <Header>Status</Header>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={12} className="py-8 px-3 text-center text-gray-500">
                                    Loading plans...
                                </td>
                            </tr>
                        )}

                        {!loading && plans.length === 0 && (
                            <tr>
                                <td colSpan={12} className="py-8 px-3 text-center text-gray-500">
                                    No subscription plans created yet.
                                </td>
                            </tr>
                        )}

                        {plans.map((plan) => (
                            <tr key={plan._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="py-3 px-3">
                                    <input
                                        type="checkbox"
                                        className="accent-orange-500"
                                        checked={!!checked[plan._id]}
                                        onChange={() => setChecked((prev) => ({ ...prev, [plan._id]: !prev[plan._id] }))}
                                    />
                                </td>

                                <td className="py-3 px-3 text-orange-500 font-semibold">
                                    #{plan.planCode || plan._id?.slice(-6)}
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
                                <Cell>{formatDate(plan.planEndRenewalDate)}</Cell>
                                <Cell>{plan.featureLimits?.maxDoctors}</Cell>
                                <Cell>{plan.featureLimits?.maxStaffAccounts}</Cell>
                                <Cell>{plan.featureLimits?.maxPetRecordsUnlimited ? "Unlimited" : plan.featureLimits?.maxPetRecords}</Cell>
                                <Cell>{plan.featureLimits?.storageLimitGb} GB</Cell>
                                <Cell>{plan.trialPeriodDays || 0} days</Cell>
                                <Cell>{Object.values(plan.modules || {}).filter(Boolean).length}</Cell>

                                <td className="py-3 px-3">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        {plan.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
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
