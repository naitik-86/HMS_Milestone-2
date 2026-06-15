import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";

const VerificationCenter = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const tabs = [
        { key: "all", label: "All", count: 5 },
        { key: "pending", label: "Pending", count: 1 },
        { key: "review", label: "Under Review", count: 1 },
        { key: "verified", label: "Verified", count: 2 },
        { key: "rejected", label: "Rejected", count: 1 },
    ];

    const data = [
        {
            entity: "Dr. Rajesh Sharma",
            type: "License",
            doc: "license.pdf",
            status: "Verified",
            reviewedBy: "Admin",
        },
        {
            entity: "Dr. Priya Verma",
            type: "ID Proof",
            doc: "aadhaar.pdf",
            status: "Pending",
            reviewedBy: "-",
        },
        {
            entity: "Dr. Amit Kulkarni",
            type: "Degree",
            doc: "degree.pdf",
            status: "Under Review",
            reviewedBy: "Manager",
        },
        {
            entity: "Dr. Sneha Iyer",
            type: "License",
            doc: "license.pdf",
            status: "Rejected",
            reviewedBy: "Admin",
        },
        {
            entity: "Dr. Arjun Reddy",
            type: "ID Proof",
            doc: "pan.pdf",
            status: "Verified",
            reviewedBy: "Admin",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Verified":
                return "bg-blue-100 text-blue-600";
            case "Pending":
                return "bg-orange-100 text-orange-600";
            case "Rejected":
                return "bg-red-100 text-red-600";
            case "Under Review":
                return "bg-yellow-100 text-yellow-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const filteredData = data.filter((item) => {
        const matchTab =
            activeTab === "all" ||
            item.status.toLowerCase().includes(activeTab);

        const matchSearch = item.entity
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchTab && matchSearch;
    });

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-orange-600">
                    Verification Center
                </h1>                <p className="text-gray-500">
                    Review and verify documents
                </p>
            </div>

            {/* TABS */}
            <div className="flex gap-3 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm border ${activeTab === tab.key
                            ? "bg-white shadow text-black"
                            : "text-gray-500"
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* SEARCH */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>
                            <th className="p-4">ENTITY</th>
                            <th>DOCUMENT TYPE</th>
                            <th>DOCUMENT</th>
                            <th>STATUS</th>
                            <th>REVIEWED BY</th>
                            <th className="text-right pr-4">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-10 text-gray-400"
                                >
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, i) => (
                                <tr
                                    key={i}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium">
                                        {item.entity}
                                    </td>
                                    <td>{item.type}</td>
                                    <td className="text-blue-600 cursor-pointer">
                                        {item.doc}
                                    </td>
                                    <td>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.reviewedBy}</td>
                                    <td className="text-right pr-4">
                                        <MoreVertical className="w-4 h-4 cursor-pointer text-gray-500" />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerificationCenter;