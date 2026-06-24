import { Building2, Users, ClipboardList, IndianRupee } from "lucide-react";

const statCards = [
    {
        label: "Total Clinics",
        value: "12",
        change: "+2 this month",
        bg: "#3b82f6",
        icon: Building2,
    },
    {
        label: "Total Doctors",
        value: "45",
        change: "+7 this month",
        bg: "#22c55e",
        icon: Users,
    },
    {
        label: "Active Plans",
        value: "8",
        change: "+1 this month",
        bg: "#f97316",
        icon: ClipboardList,
    },
    {
        label: "Total Revenue",
        value: "₹1,20,000",
        change: "+18.4% this month",
        bg: "#8b5cf6",
        icon: IndianRupee,
    },
];

const StatsCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((s, i) => {
                const Icon = s.icon;

                return (
                    <div
                        key={i}
                        className="
                            bg-white
                            rounded-2xl
                            p-4 md:p-5
                            flex
                            items-start
                            gap-4
                            shadow-sm
                            border
                            border-gray-100
                        "
                    >
                        <div
                            className="
                                w-12 h-12
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                            style={{ background: s.bg }}
                        >
                            <Icon
                                size={22}
                                className="text-white"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-400 truncate">
                                    {s.label}
                                </p>

                                <span className="text-gray-300 cursor-pointer">
                                    •••
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mt-1 break-words">
                                {s.value}
                            </h3>

                            <p className="text-xs text-green-500 mt-2">
                                {s.change}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;