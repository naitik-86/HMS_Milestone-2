import { X } from "lucide-react";
import ReportList from "./ReportLists";
function ReportModal({ category, onClose }) {
    if (!category) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

            <div className="bg-white w-[95%] h-[90vh] rounded-3xl shadow-xl overflow-hidden">

                <div className="flex justify-between items-center px-8 py-5 border-b">

                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                            {category.title}
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Available reports
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-orange-50 flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div className="p-8 overflow-y-auto h-full">
                    <ReportList reports={category.reports} />
                </div>

            </div>
        </div>
    );
}

export default ReportModal;