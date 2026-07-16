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

const formatCurrency = (value) =>
    `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Number(value || 0)
    )}`;

const formatYAxisValue = (value) => {
    const numericValue = Number(value || 0);

    if (numericValue >= 1000) {
        return `₹${(numericValue / 1000).toFixed(0)}K`;
    }

    return `₹${numericValue}`;
};

function BottomGrid({
    verificationData = [],
    revenueData = [],
}) {
    const visibleVerificationData = Array.isArray(verificationData)
        ? verificationData
        : [];
    const visibleRevenueData = Array.isArray(revenueData) ? revenueData : [];

    const totalVerification = visibleVerificationData.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
    );

    const approvedCount =
        visibleVerificationData.find((item) => item.name === "Approved")?.value || 0;
    const approvalRate = totalVerification
        ? Math.round((Number(approvedCount || 0) / totalVerification) * 100)
        : 0;

    const chartData =
        visibleVerificationData.length > 0
            ? visibleVerificationData
            : [{ name: "No Data", value: 1, color: "#e5e7eb" }];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 my-2">
            <div className="xl:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col gap-1 mb-4">
                    <h2 className="text-base font-bold text-[#1a1a2e]">
                        Verification Status
                    </h2>
                    <p className="text-xs text-gray-400">
                        Clinic onboarding health from the backend.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-32 h-32 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={42}
                                    outerRadius={62}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`${entry.name}-${index}`}
                                            fill={entry.color || "#e5e7eb"}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold text-[#1a1a2e]">
                                {approvalRate}%
                            </span>

                            <span className="text-[10px] text-gray-400">
                                Approval Rate
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                        {visibleVerificationData.length ? (
                            visibleVerificationData.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ background: item.color }}
                                        />
                                        {item.name}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1a1a2e] text-sm">
                                            {item.value}
                                        </span>

                                        <span className="text-gray-400 text-xs">
                                            ({totalVerification ? Math.round((Number(item.value || 0) / totalVerification) * 100) : 0}%)
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">
                                No verification data available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="xl:col-span-3 bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-[#1a1a2e]">
                            Monthly Revenue Overview
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Completed consultation revenue for the last 12 months.
                        </p>
                    </div>
                </div>

                {visibleRevenueData.length ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                            data={visibleRevenueData}
                            margin={{
                                top: 20,
                                right: 10,
                                left: -10,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="revGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#f97316"
                                        stopOpacity={0.18}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#f97316"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="month"
                                tick={{
                                    fontSize: 11,
                                    fill: "#aaa",
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{
                                    fontSize: 11,
                                    fill: "#aaa",
                                }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatYAxisValue}
                            />

                            <Tooltip
                                formatter={(value) => [formatCurrency(value), "Revenue"]}
                                contentStyle={{
                                    borderRadius: 8,
                                    border: "1px solid #f0f0f0",
                                    fontSize: 12,
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#f97316"
                                strokeWidth={2.5}
                                fill="url(#revGrad)"
                                dot={{
                                    r: 4,
                                    fill: "#f97316",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[250px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                        No revenue trend available yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default BottomGrid;
