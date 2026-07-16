import { Building2, Users, ClipboardList, IndianRupee } from "lucide-react";

const DEFAULT_CARDS = [
    {
        label: "Total Clinics",
        value: "0",
        change: "No data yet",
        bg: "#3b82f6",
        icon: Building2,
    },
    {
        label: "Total Doctors",
        value: "0",
        change: "No data yet",
        bg: "#22c55e",
        icon: Users,
    },
    {
        label: "Active Plans",
        value: "0",
        change: "No data yet",
        bg: "#f97316",
        icon: ClipboardList,
    },
    {
        label: "Total Revenue",
        value: "₹0",
        change: "No data yet",
        bg: "#8b5cf6",
        icon: IndianRupee,
    },
];

const StatsCards = ({ cards = DEFAULT_CARDS }) => {
    const visibleCards = Array.isArray(cards) && cards.length ? cards : DEFAULT_CARDS;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {visibleCards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4 shadow-sm border border-gray-100"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: card.bg }}
                        >
                            <Icon size={22} className="text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-400 truncate">
                                    {card.label}
                                </p>

                                <span className="text-gray-300">⋯</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mt-1 break-words">
                                {card.value}
                            </h3>

                            {card.change ? (
                                <p className="text-xs text-green-500 mt-2">
                                    {card.change}
                                </p>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
