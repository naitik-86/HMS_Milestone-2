import { Building2, Users, ClipboardList, IndianRupee } from "lucide-react";

const statCards = [
    { label: "Total Clinics", value: "12", change: "+2 this month", bg: "#3b82f6" },
    { label: "Total Doctors", value: "45", change: "+7 this month", bg: "#22c55e" },
    { label: "Active Plans", value: "8", change: "+1 this month", bg: "#f97316" },
    { label: "Total Revenue", value: "₹1,20,000", change: "+18.4% this month", bg: "#22c55e" },
];

const StatsCards = () => {
    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                {s.label}
                                <span className="text-gray-300 text-base cursor-pointer">···</span>
                            </div>
                            <div className="text-2xl font-extrabold text-[#1a1a2e]">{s.value}</div>
                            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                {s.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};

export default StatsCards;