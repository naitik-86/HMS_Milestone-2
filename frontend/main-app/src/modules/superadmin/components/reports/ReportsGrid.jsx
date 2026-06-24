import { FileText } from "lucide-react";

export default function ReportsGrid({
    categories,
    selected,
    onSelect,
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category)}
                    className={`
                        text-left
                        bg-white
                        border
                        rounded-2xl
                        p-4 md:p-6
                        shadow-sm
                        transition-all
                        duration-200
                        w-full

                        ${
                            selected?.id === category.id
                                ? "border-orange-500 ring-2 ring-orange-100"
                                : "hover:border-orange-300 hover:shadow-md"
                        }
                    `}
                >
                    <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                            <FileText
                                size={22}
                                className="text-orange-600"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base md:text-lg text-black">
                                {category.title}
                            </h3>

                            <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}