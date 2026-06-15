import { useState } from "react";

function ClientActivity() {
    const [activeTab, setActiveTab] = useState("Recent Clients");
    const [checked, setChecked] = useState({});

    const clients = [
        { id: "#001", name: "Aarav Sharma", email: "aarav@acme.com", phone: "(201) 555-0124", joined: "12 May 2024", initials: "AS", color: "#f97316" },
        { id: "#002", name: "Rohan Verma", email: "rohan@summit.com", phone: "(907) 555-0101", joined: "11 May 2024", initials: "RV", color: "#3b82f6" },
        { id: "#003", name: "Ananya Iyer", email: "ananya@brightstar.com", phone: "(209) 555-0104", joined: "10 May 2024", initials: "AI", color: "#ef4444" },
        { id: "#004", name: "Vikram Malhotra", email: "vikram@zenith.com", phone: "(207) 555-0119", joined: "10 May 2024", initials: "VM", color: "#8b5cf6" },
        { id: "#005", name: "Esha Patel", email: "esha@abstergo.com", phone: "(316) 555-0116", joined: "09 May 2024", initials: "EP", color: "#06b6d4" },
    ];

    return (
        <>
            <div className="bg-white rounded-xl p-6 shadow-sm my-2 ">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-[#1a1a2e]">Client Activity</h2>
                    <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 flex items-center gap-1">
                        View All Clients
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>

                {/* Mini Stats */}
                <div className="flex gap-10 pb-5 mb-4 border-b border-gray-100">
                    {[
                        { num: 5, label: "New Clients (This Week)", bg: "#eff6ff", iconColor: "#3b82f6" },
                        { num: 12, label: "New Clients (This Month)", bg: "#f0fdf4", iconColor: "#22c55e" },
                        { num: 24, label: "Active Clients", bg: "#fff7ed", iconColor: "#f97316" },
                    ].map((a, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={a.iconColor} strokeWidth={2}>
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-[#1a1a2e]">{a.num}</div>
                                <div className="text-xs text-gray-400">{a.label}</div>
                            </div>
                        </div>
                    ))}
                </div>



                <div className="flex gap-0 border-b-2 border-gray-100 mb-4">
                    {["Recent Clients", "Order Activity", "Client Engagement"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-0.5 transition-all
                    ${activeTab === t ? "text-orange-500 border-orange-500 font-bold" : "text-gray-400 border-transparent"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-2 px-3 text-left w-8">
                                <input type="checkbox" className="accent-orange-500 w-3.5 h-3.5" />
                            </th>
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Client ID</th>
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Client Name</th>
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Email</th>
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Phone Number</th>
                            <th className="py-2 px-3 text-left text-xs font-semibold text-gray-400">Joined On</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-3">
                                    <input
                                        type="checkbox"
                                        className="accent-orange-500 w-3.5 h-3.5"
                                        checked={!!checked[c.id]}
                                        onChange={() => setChecked((p) => ({ ...p, [c.id]: !p[c.id] }))}
                                    />
                                </td>
                                <td className="py-2.5 px-3 text-orange-500 font-semibold">{c.id}</td>
                                <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                            style={{ background: c.color }}
                                        >
                                            {c.initials}
                                        </div>
                                        <span className="text-gray-800 font-medium">{c.name}</span>
                                    </div>
                                </td>
                                <td className="py-2.5 px-3 text-gray-500">{c.email}</td>
                                <td className="py-2.5 px-3 text-gray-500">{c.phone}</td>
                                <td className="py-2.5 px-3 text-gray-500">{c.joined}</td>
                                <td className="py-2.5 px-3">
                                    <button className="text-gray-300 hover:text-gray-500 text-lg px-1">⋮</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
        // <>
        //     testing
        // </>
    )
}

export default ClientActivity;