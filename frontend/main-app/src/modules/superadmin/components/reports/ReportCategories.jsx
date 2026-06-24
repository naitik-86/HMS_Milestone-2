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
        description: "Clinic registration, status and performance data",
        icon: Building2,
        reports: [
            "Clinic Registration Report",
            "Approved Clinics Report",
            "Rejected Clinics Report",
            "Clinic Performance Report",
        ],
    },
    {
        id: "doctor",
        title: "Doctor Reports",
        description: "Doctor activity and consultations",
        icon: Stethoscope,
        reports: [
            "Doctor Registration Report",
            "Doctor Verification Report",
            "Doctor Activity Report",
            "Doctor Consultation Report",
        ],
    },
    {
        id: "revenue",
        title: "Revenue Reports",
        description: "Income and billing reports",
        icon: DollarSign,
        reports: [
            "Monthly Revenue Report",
            "Quarterly Revenue Report",
            "Annual Revenue Report",
        ],
    },
    {
        id: "subscription",
        title: "Subscription Reports",
        description: "Plans and renewals",
        icon: CreditCard,
        reports: [
            "Active Plans Report",
            "Expired Plans Report",
            "Renewal Report",
        ],
    },
    {
        id: "verification",
        title: "Verification Reports",
        description: "Verification timelines",
        icon: ShieldCheck,
        reports: [
            "Pending Verification Report",
            "Approved Verification Report",
            "Rejected Verification Report",
        ],
    },
    {
        id: "usage",
        title: "Usage Reports",
        description: "API and storage usage",
        icon: BarChart3,
        reports: [
            "API Usage Report",
            "Storage Usage Report",
            "Module Usage Report",
        ],
    },
];