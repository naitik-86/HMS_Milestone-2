import React from "react";
import { MoreVertical } from "lucide-react";

const doctors = [
    {
        id: "DOC-1A2B",
        name: "Dr. Rajesh Sharma",
        mobile: "9876543210",
        location: "Mumbai, Maharashtra",
        practice: "PetCare Hospital",
        experience: "8 yrs",
        status: "Active",
    },
    {
        id: "DOC-2B3C",
        name: "Dr. Priya Verma",
        mobile: "9123456789",
        location: "Delhi, India",
        practice: "Happy Paws Clinic",
        experience: "5 yrs",
        status: "Pending",
    },
    {
        id: "DOC-3C4D",
        name: "Dr. Amit Kulkarni",
        mobile: "8765432109",
        location: "Pune, Maharashtra",
        practice: "Animal World Clinic",
        experience: "10 yrs",
        status: "Active",
    },
    {
        id: "DOC-4D5E",
        name: "Dr. Sneha Iyer",
        mobile: "7654321098",
        location: "Chennai, Tamil Nadu",
        practice: "PetZone Clinic",
        experience: "6 yrs",
        status: "Suspended",
    },
    {
        id: "DOC-5E6F",
        name: "Dr. Arjun Reddy",
        mobile: "6543210987",
        location: "Hyderabad, Telangana",
        practice: "CareVet Hospital",
        experience: "7 yrs",
        status: "Active",
    },
];

const statusStyles = {
    Active: "bg-blue-100 text-blue-600",
    Pending: "bg-orange-100 text-orange-600",
    Suspended: "bg-red-100 text-red-600",
};

const DoctorsTable = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">

                {/* LEFT CONTENT */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-3">

                        {/* Gradient Dot */}
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shadow-sm"></span>

                        Latest Doctors Activity
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                        Track recent approvals, rejections & updates
                    </p>
                </div>

                {/* RIGHT ACTION */}
                <button className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-200 text-orange-500 border-orange-200">
                    View All Veterinarian →
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Veterinarian</th>
                            <th className="px-6 py-3">Mobile</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Practice</th>
                            <th className="px-6 py-3">Exp.</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {doctors.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50 transition">
                                {/* Doctor */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-800">
                                        {doc.name}
                                    </div>
                                    <div className="text-xs text-gray-400">{doc.id}</div>
                                </td>

                                {/* Mobile */}
                                <td className="px-6 py-4 text-gray-700">
                                    {doc.mobile}
                                </td>

                                {/* Location */}
                                <td className="px-6 py-4 text-gray-700">
                                    {doc.location}
                                </td>

                                {/* Practice */}
                                <td className="px-6 py-4 text-gray-700">
                                    {doc.practice}
                                </td>

                                {/* Experience */}
                                <td className="px-6 py-4 text-gray-700">
                                    {doc.experience}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyles[doc.status]}`}
                                    >
                                        {doc.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 rounded-lg hover:bg-gray-100">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorsTable;