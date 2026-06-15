import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

function BottomGrid() {
    const fleetData = [
        { name: "Active", value: 75, count: 30, color: "#22c55e" },
        { name: "In Transit", value: 15, count: 6, color: "#3b82f6" },
        { name: "Maintenance", value: 10, count: 4, color: "#f97316" },
    ];

    const revenueData = [
        { month: "Jan", value: 20000 }, { month: "Feb", value: 45000 },
        { month: "Mar", value: 35000 }, { month: "Apr", value: 70000 },
        { month: "May", value: 55000 }, { month: "Jun", value: 80000 },
        { month: "Jul", value: 65000 }, { month: "Aug", value: 90000 },
        { month: "Sep", value: 85000 }, { month: "Oct", value: 95000 },
        { month: "Nov", value: 105000 }, { month: "Dec", value: 120000 },
    ];

    return (
        <>
            <div className="grid grid-cols-5 gap-5 my-2">
                {/* Fleet Status */}
                <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-base font-bold text-[#1a1a2e] mb-4">Fleet Status</h2>
                    <div className="flex items-center gap-6">
                        {/* Donut */}
                        <div className="relative w-32 h-32 shrink-0">
                            <PieChart width={128} height={128}>
                                <Pie data={fleetData} cx={60} cy={60} innerRadius={42} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={2}>
                                    {fleetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-extrabold text-[#1a1a2e]">75%</span>
                                <span className="text-[10px] text-gray-400">Total Fleet</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex-1 space-y-3">
                            {fleetData.map((f, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: f.color }}></div>
                                        {f.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1a1a2e] text-sm">{f.value}%</span>
                                        <span className="text-gray-400 text-xs">({f.count})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="col-span-3 bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#1a1a2e]">Monthly Revenue Overview</h2>
                        <button className="bg-orange-50 text-orange-500 border border-orange-200 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
                            This Month
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={revenueData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                            <Tooltip
                                formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                                contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", fontSize: 12 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#f97316"
                                strokeWidth={2.5}
                                fill="url(#revGrad)"
                                dot={{ r: 4, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </>
    )
}

export default BottomGrid;