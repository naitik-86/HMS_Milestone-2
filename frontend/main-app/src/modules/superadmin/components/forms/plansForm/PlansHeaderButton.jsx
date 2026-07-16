import { Plus } from "lucide-react";

export default function PlansHeaderButton({ onAdd }) {
    return (
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">

            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Clinic and Solo Doctor Plans
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage the plan catalogue for clinics and independent doctors
                </p>
            </div>

            <button
                onClick={onAdd}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow-sm transition"
            >
                <Plus size={18} />
                Add Plan
            </button>
        </div>
    );
}
