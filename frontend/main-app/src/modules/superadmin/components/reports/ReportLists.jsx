import { Download, FileText } from "lucide-react";

function ReportList({ reports }) {
    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div
                    key={report}
                    className="
                        bg-white
                        border
                        rounded-2xl
                        p-4 md:p-5
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                        hover:shadow-md
                        hover:border-orange-200
                        transition-all
                    "
                >
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <FileText
                                size={20}
                                className="text-orange-500"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3 className="font-medium text-sm md:text-base text-slate-800 break-words">
                                {report}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Export report in PDF, Excel or CSV format
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <button
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
                            py-2.5
                            rounded-xl
                            text-sm
                            font-medium
                            transition
                            shrink-0
                        "
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ReportList;