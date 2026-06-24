import { Plus } from "lucide-react";

export default function VeterinarianHeader({ onAdd }) {
    return (
        <div
            className="
                bg-white
                p-4 md:p-6
                rounded-2xl
                shadow-sm
                border
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
            "
        >
            {/* LEFT */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Veterinarian Management
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage individual veterinarians
                </p>
            </div>

            {/* RIGHT BUTTON */}
            <button
                onClick={onAdd}
                className="
                    w-full
                    sm:w-auto
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    shadow-sm
                    transition
                "
            >
                <Plus size={18} />
                Add Veterinarian
            </button>
        </div>
    );
}