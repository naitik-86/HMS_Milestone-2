import { Plus } from "lucide-react";

export default function ClinicHeader({ onAdd }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 md:p-6 rounded-2xl shadow-sm border">

            {/* LEFT */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Clinic Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage all registered clinics
                </p>
            </div>

            {/* RIGHT BUTTON */}
            <button
                onClick={onAdd}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow-sm transition"
            >
                <Plus size={18} />
                Add Clinic
            </button>

        </div>
    );
}