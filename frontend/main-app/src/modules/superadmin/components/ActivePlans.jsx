import { useState } from "react";

export default function ActivePlans() {
    const [checked, setChecked] = useState({});

    const plans = [
        {
            id: "#PL001",
            name: "Starter Clinic",
            tier: "Basic",
            monthly: 999,
            doctors: 2,
            staff: 5,
            storage: "5 GB",
            trial: 14,
            status: "Active",
            color: "#f97316",
        },
        {
            id: "#PL002",
            name: "Growth Clinic",
            tier: "Standard",
            monthly: 2499,
            doctors: 5,
            staff: 15,
            storage: "20 GB",
            trial: 14,
            status: "Active",
            color: "#3b82f6",
        },
        {
            id: "#PL003",
            name: "Enterprise Vet",
            tier: "Premium",
            monthly: 4999,
            doctors: 15,
            staff: 50,
            storage: "100 GB",
            trial: 30,
            status: "Active",
            color: "#10b981",
        },
        {
            id: "#PL004",
            name: "Solo Vet",
            tier: "Basic",
            monthly: 699,
            doctors: 1,
            staff: 2,
            storage: "2 GB",
            trial: 7,
            status: "Active",
            color: "#8b5cf6",
        },
        {
            id: "#PL005",
            name: "Multi Branch",
            tier: "Premium",
            monthly: 7999,
            doctors: 25,
            staff: 100,
            storage: "250 GB",
            trial: 30,
            status: "Active",
            color: "#ef4444",
        },
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-800">
                        Active Subscription Plans
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Currently available plans for clinics
                    </p>
                </div>

                <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                    View All Plans
                </button>
            </div>

            {/* Mini Stats */}

            <div className="flex gap-10 pb-5 mb-4 border-b border-gray-100">
                {[
                    {
                        num: 5,
                        label: "Active Plans",
                        bg: "#fff7ed",
                        iconColor: "#f97316",
                    },
                    {
                        num: "₹7,999",
                        label: "Highest Plan",
                        bg: "#eff6ff",
                        iconColor: "#3b82f6",
                    },
                    {
                        num: "30",
                        label: "Max Trial Days",
                        bg: "#f0fdf4",
                        iconColor: "#22c55e",
                    },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: item.bg }}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={item.iconColor}
                                strokeWidth={2}
                            >
                                <path d="M12 8v8m-4-4h8" />
                            </svg>
                        </div>

                        <div>
                            <div className="text-xl font-extrabold text-gray-800">
                                {item.num}
                            </div>

                            <div className="text-xs text-gray-400">
                                {item.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}

            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="py-3 px-3 text-left w-8">
                            <input
                                type="checkbox"
                                className="accent-orange-500"
                            />
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Plan ID
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Plan Name
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Tier
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Monthly
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Doctors
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Staff
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Storage
                        </th>

                        <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400">
                            Status
                        </th>

                        <th />
                    </tr>
                </thead>

                <tbody>
                    {plans.map((plan) => (
                        <tr
                            key={plan.id}
                            className="border-b border-gray-50 hover:bg-gray-50"
                        >
                            <td className="py-3 px-3">
                                <input
                                    type="checkbox"
                                    className="accent-orange-500"
                                    checked={!!checked[plan.id]}
                                    onChange={() =>
                                        setChecked((prev) => ({
                                            ...prev,
                                            [plan.id]: !prev[plan.id],
                                        }))
                                    }
                                />
                            </td>

                            <td className="py-3 px-3 text-orange-500 font-semibold">
                                {plan.id}
                            </td>

                            <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                        style={{
                                            background: plan.color,
                                        }}
                                    >
                                        {plan.name
                                            .split(" ")
                                            .map((w) => w[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>

                                    <span className="font-medium text-gray-800">
                                        {plan.name}
                                    </span>
                                </div>
                            </td>

                            <td className="py-3 px-3 text-gray-600">
                                {plan.tier}
                            </td>

                            <td className="py-3 px-3 font-semibold text-gray-700">
                                ₹{plan.monthly}
                            </td>

                            <td className="py-3 px-3 text-gray-600">
                                {plan.doctors}
                            </td>

                            <td className="py-3 px-3 text-gray-600">
                                {plan.staff}
                            </td>

                            <td className="py-3 px-3 text-gray-600">
                                {plan.storage}
                            </td>

                            <td className="py-3 px-3">
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    Active
                                </span>
                            </td>

                            <td className="py-3 px-3">
                                <button className="text-gray-400 hover:text-gray-600 text-lg">
                                    ⋮
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}