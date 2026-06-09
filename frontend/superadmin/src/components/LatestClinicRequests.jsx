import {
    MapPin,
    Phone,
    MoreHorizontal,
    ClipboardCheck,
} from "lucide-react";

const clinics = [
    {
        name: "CareVet Hospital",
        id: "CLN-P7Q8R9",
        type: "Hospital",
        location: "Hyderabad, Telangana",
        contact: "5432109876",
        plan: null,
        status: "Rejected",
    },
    {
        name: "PetCare Hospital",
        id: "CLN-A1B2C3",
        type: "Hospital",
        location: "Mumbai, Maharashtra",
        contact: "9876543210",
        plan: "Professional",
        status: "Active",
    },
    {
        name: "VetCure Center",
        id: "CLN-V4W5X6",
        type: "Clinic",
        location: "Kolkata, West Bengal",
        contact: "3210987654",
        plan: null,
        status: "Pending",
    },
    {
        name: "Happy Paws Clinic",
        id: "CLN-D4E5F6",
        type: "Clinic",
        location: "Delhi, Delhi",
        contact: "9123456789",
        plan: "Standard",
        status: "Active",
    },
    {
        name: "PetZone Clinic",
        id: "CLN-M4N5O6",
        type: "Clinic",
        location: "Chennai, Tamil Nadu",
        contact: "6543210987",
        plan: "Basic",
        status: "Suspended",
    },
];

const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-orange-100 text-orange-600",
    Rejected: "bg-red-100 text-red-600",
    Suspended: "bg-red-100 text-red-600",
};

export default function LatestClinicApprovals() {
    return (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-500 p-2 rounded-xl">
                        <ClipboardCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Latest Clinic Approvals
                        </h2>
                        <p className="text-sm text-gray-500">
                            Review the most recent clinic registration requests.
                        </p>
                    </div>
                </div>

                <button className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-100 text-orange-500 border-orange-200">
                    View All Clinics →
                </button>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-7 px-6 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
                <span>CLINIC</span>
                <span>TYPE</span>
                <span>LOCATION</span>
                <span>CONTACT</span>
                <span>PLAN</span>
                <span>STATUS</span>
                <span className="text-right">ACTIONS</span>
            </div>

            {/* TABLE BODY */}
            {clinics.map((c, i) => (
                <div
                    key={i}
                    className="grid grid-cols-7 items-center px-6 py-4 border-b hover:bg-gray-50 transition"
                >
                    {/* CLINIC */}
                    <div>
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.id}</p>
                    </div>

                    {/* TYPE */}
                    <span className="text-blue-600 font-medium">{c.type}</span>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={14} className="text-orange-500" />
                        {c.location}
                    </div>

                    {/* CONTACT */}
                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={14} className="text-orange-500" />
                        {c.contact}
                    </div>

                    {/* PLAN */}
                    <span className="text-blue-600">
                        {c.plan || "—"}
                    </span>

                    {/* STATUS */}
                    <span
                        className={`px-3 py-1 text-xs rounded-full w-fit ${statusStyles[c.status]}`}
                    >
                        {c.status}
                    </span>

                    {/* ACTION */}
                    <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}