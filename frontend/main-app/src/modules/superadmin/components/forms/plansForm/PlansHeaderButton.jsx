import { Plus } from "lucide-react";

export default function PlansHeaderButton({ onAdd }) {
    return (
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">

            {/* LEFT */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Subscription Plans
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage clinic subscription plans and pricing
                </p>
            </div>

            {/* RIGHT BUTTON */}
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