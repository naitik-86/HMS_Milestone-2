import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { downloadReportSnapshot } from "./reportDownload";

function ReportList({ category, catalog, catalogLoading = false }) {
    const [downloadingReport, setDownloadingReport] = useState("");

    const reports = category?.reports ?? [];

    const handleExport = async (report) => {
        if (!catalog) {
            return;
        }

        setDownloadingReport(report.key);

        try {
            downloadReportSnapshot({
                category,
                report,
                catalog,
            });
        } catch (error) {
            console.error("Failed to export backend report:", error);
        } finally {
            setDownloadingReport("");
        }
    };

    return (
        <div className="space-y-4">
            {catalogLoading ? (
                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                    Loading backend report data...
                </div>
            ) : null}

            {reports.map((report) => (
                <div
                    key={report.key}
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
                                {report.title}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Download a backend-backed PDF report
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <button
                        type="button"
                        onClick={() => handleExport(report)}
                        disabled={catalogLoading || !catalog || downloadingReport === report.key}
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
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                        "
                        >
                        <Download size={16} />
                        {downloadingReport === report.key ? "Preparing..." : "Export PDF"}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ReportList;
