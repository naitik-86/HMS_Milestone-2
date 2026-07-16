import {
    Building2,
    Stethoscope,
    DollarSign,
    CreditCard,
    ShieldCheck,
    BarChart3,
} from "lucide-react";

export default function ReportCategories({
    categories,
    selected,
    setSelected,
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => {
                const Icon = category.icon;

                return (
                    <button
                        key={category.id}
                        onClick={() => setSelected(category)}
                        className={`
                            text-left
                            bg-white
                            border
                            rounded-2xl
                            p-4 md:p-6
                            shadow-sm
                            transition-all
                            duration-200
                            w-full

                            ${
                                selected?.id === category.id
                                    ? "border-orange-500 ring-2 ring-orange-100"
                                    : "hover:border-orange-300 hover:shadow-md"
                            }
                        `}
                    >
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                                <Icon
                                    size={22}
                                    className="text-orange-600"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base md:text-lg text-black">
                                    {category.title}
                                </h3>

                                <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export const reportCategories = [
    {
        id: "clinic",
        title: "Clinic Reports",
        description: "Live clinic registration, verification and performance data",
        icon: Building2,
        reports: [
            { key: "clinic-registration", title: "Clinic Registration Report" },
            { key: "clinic-approved", title: "Approved Clinics Report" },
            { key: "clinic-rejected", title: "Rejected Clinics Report" },
            { key: "clinic-performance", title: "Clinic Performance Report" },
        ],
    },
    {
        id: "doctor",
        title: "Doctor Reports",
        description: "Doctor registry, compliance, activity and consultations",
        icon: Stethoscope,
        reports: [
            { key: "doctor-registration", title: "Doctor Registration Report" },
            { key: "doctor-compliance", title: "Doctor Compliance Report" },
            { key: "doctor-activity", title: "Doctor Activity Report" },
            { key: "doctor-consultation", title: "Doctor Consultation Report" },
        ],
    },
    {
        id: "revenue",
        title: "Revenue Reports",
        description: "Revenue breakdowns derived from completed appointments",
        icon: DollarSign,
        reports: [
            { key: "revenue-monthly", title: "Monthly Revenue Report" },
            { key: "revenue-quarterly", title: "Quarterly Revenue Report" },
            { key: "revenue-annual", title: "Annual Revenue Report" },
        ],
    },
    {
        id: "subscription",
        title: "Subscription Reports",
        description: "Live subscription plans, renewals and expiration data",
        icon: CreditCard,
        reports: [
            { key: "plan-active", title: "Active Plans Report" },
            { key: "plan-expired", title: "Expired Plans Report" },
            { key: "plan-renewal", title: "Renewal Report" },
        ],
    },
    {
        id: "verification",
        title: "Verification Reports",
        description: "Clinic verification queue and review outcomes",
        icon: ShieldCheck,
        reports: [
            { key: "verification-pending", title: "Pending Verification Report" },
            { key: "verification-approved", title: "Approved Verification Report" },
            { key: "verification-rejected", title: "Rejected Verification Report" },
        ],
    },
    {
        id: "coverage",
        title: "Coverage Reports",
        description: "Plan modules, storage limits and feature coverage",
        icon: BarChart3,
        reports: [
            { key: "module-coverage", title: "Module Coverage Report" },
            { key: "storage-limits", title: "Storage Limits Report" },
            { key: "feature-limits", title: "Feature Limits Report" },
        ],
    },
];
