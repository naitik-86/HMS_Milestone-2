import {
    BadgeCheck,
    CalendarDays,
    CreditCard,
    IndianRupee,
} from "lucide-react";

export default function CurrentSubscriptionCard({ subscription }) {
    const sub = subscription;
    const plan = subscription.plan;


    console.log("=========", subscription);


    const formatBillingCycle = (cycle) =>
        cycle.replace("_", " ").toLowerCase();

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">

            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                            Current Subscription
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                            {plan.subscriptionPlan}
                        </h2>

                        <p className="mt-2 flex items-center gap-1 text-gray-500">
                            <IndianRupee size={16} />
                            {plan.price.toLocaleString()} /{" "}
                            {formatBillingCycle(plan.billingCycle)}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                        <BadgeCheck size={17} />
                        {sub.status}
                    </div>

                </div>
            </div>

            {/* Details */}
            <div className="grid gap-5 p-6 md:grid-cols-2">

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays
                            size={18}
                            className="text-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Subscription Started
                        </span>
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        {new Date(
                            sub.planStartDate
                        ).toLocaleDateString()}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays
                            size={18}
                            className="text-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Remaining Days
                        </span>
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        {sub.remainingDays}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <CreditCard
                            size={18}
                            className="text-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Plan Status
                        </span>
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        {
                            sub.status
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase()) || "Expired"
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <IndianRupee
                            size={18}
                            className="text-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Amount Paid
                        </span>
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                        ₹{sub.amountPaid?.toLocaleString()}
                    </p>
                </div>

            </div>

        </div>
    );
}