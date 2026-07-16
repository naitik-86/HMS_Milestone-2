import {
    Check,
    Crown,
    Users,
    Stethoscope,
} from "lucide-react";

export default function SubscriptionPlanCard({
    status,
    plan,
    isCurrent,
}) {
    const features = [];

    if (plan.modules.lab) features.push("Lab Module");
    if (plan.modules.grooming) features.push("Grooming");
    if (plan.modules.kennel) features.push("Kennel");
    if (plan.modules.onlinePharmacy)
        features.push("Online Pharmacy");
    if (plan.modules.apiAccess)
        features.push("API Access");
    if (plan.modules.whiteLabelBranding)
        features.push("White Label Branding");

    return (
        <div
            className={`relative flex min-w-[330px] flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isCurrent
                ? "border-orange-500 ring-2 ring-orange-100"
                : "border-gray-200"
                }`}
        >
            {isCurrent && status !== "TRIAL" && (
                <div className="absolute right-5 top-5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                    Current Plan
                </div>
            )}

            <div>
                {/* Header */}

                <div className="flex items-center gap-3">

                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${isCurrent
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-slate-700"
                            }`}
                    >
                        <Crown size={22} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {plan.subscriptionPlan}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {plan.billingCycle.replace("_", " ")}
                        </p>
                    </div>

                </div>

                {/* Price */}

                <div className="mt-6">

                    <span className="text-4xl font-bold text-slate-900">
                        ₹{plan.price.toLocaleString()}
                    </span>

                    <span className="ml-2 text-gray-500">
                        / {plan.billingCycle.replace("_", " ").toLowerCase()}
                    </span>

                </div>

                {/* Limits */}

                <div className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center gap-3 text-gray-700">
                        <Stethoscope
                            size={18}
                            className="text-orange-500"
                        />
                        <span>
                            Up to{" "}
                            <strong>
                                {plan.featureLimits.maxDoctors}
                            </strong>{" "}
                            Doctors
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <Users
                            size={18}
                            className="text-orange-500"
                        />
                        <span>
                            Up to{" "}
                            <strong>
                                {
                                    plan.featureLimits
                                        .maxStaffAccounts
                                }
                            </strong>{" "}
                            Staff Members
                        </span>
                    </div>

                </div>

                {/* Features */}

                <div className="mt-6">

                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Included Modules
                    </h4>

                    <div className="space-y-3">

                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="flex items-center gap-3 text-sm text-gray-700"
                            >
                                <Check
                                    size={16}
                                    className="text-green-600"
                                />

                                {feature}
                            </div>
                        ))}

                    </div>

                </div>

            </div>

            {/* Button */}

            <button
                disabled={isCurrent && status !== "TRIAL"}
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${isCurrent && status !== "TRIAL"
                        ? "cursor-not-allowed border border-orange-200 bg-orange-50 text-orange-600"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
            >
                {isCurrent && status !== "TRIAL"
                    ? "Current Plan"
                    : "Upgrade Plan"}
            </button>

        </div>
    );
}