import { Download, FileText } from "lucide-react";

function ReportList({ reports }) {
    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div
                    key={report}
                    className="border rounded-xl p-5 flex justify-between items-center"
                >
                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <FileText
                                size={18}
                                className="text-orange-500"
                            />
                        </div>

                        <span className="font-medium">
                            {report}
                        </span>

                    </div>

                    <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ReportList;