import { FileText } from "lucide-react";

export default function ReportsGrid({
    categories,
    selected,
    onSelect,   // ✅ FIXED: was setSelected
}) {
    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category)}   // ✅ FIXED
                    className={`text-left bg-white border rounded-2xl p-6 shadow-sm transition-all duration-200
                    ${selected?.id === category.id
                            ? "border-orange-500 ring-2 ring-orange-100"
                            : "hover:border-orange-300 hover:shadow-md"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <FileText
                                size={24}
                                className="text-orange-600"
                            />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-black">
                                {category.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}