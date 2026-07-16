import { X } from "lucide-react";
import ReportList from "./ReportLists";

function ReportModal({ category, catalog, catalogLoading, onClose }) {
    if (!category) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">

            <div
                className="
                    bg-white
                    w-full
                    md:w-[95%]
                    h-screen
                    md:h-[90vh]
                    rounded-none
                    md:rounded-3xl
                    shadow-2xl
                    overflow-hidden
                    flex
                    flex-col
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 md:px-8 py-4 bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            {category.title}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            Available reports for export
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            w-10 h-10
                            rounded-full
                            flex items-center justify-center
                            hover:bg-orange-50
                            transition
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    <ReportList
                        category={category}
                        catalog={catalog}
                        catalogLoading={catalogLoading}
                    />
                </div>
            </div>

        </div>
    );
}

export default ReportModal;
