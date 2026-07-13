import { FileText } from "lucide-react";

export default function LabReportModal({
    open,
    onClose,
    report,
}) {
    if (!open || !report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-[1100px] max-w-[96%] overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between bg-orange-500 px-8 py-5 text-white">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Laboratory Report
                        </h2>
                        <p className="mt-1 text-sm opacity-90">
                            Report Details
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-3xl hover:opacity-80"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] space-y-8 overflow-y-auto p-8">
                    {/* Patient Information */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-orange-600">
                            Patient Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4 rounded-xl border border-orange-200 bg-orange-50 p-5 lg:grid-cols-5">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Pet ID
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.uniquePetId || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Pet Name
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.petName || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Owner
                                </p>

                                <p className="font-semibold">
                                    {report.owner?.ownerName || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Mobile
                                </p>

                                <p className="font-semibold">
                                    {report.owner?.mobileNumber || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${report.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : report.status === "Critical"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {report.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Species
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.species || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Breed
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.breed || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Gender
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.gender || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Age
                                </p>

                                <p className="font-semibold">
                                    {report.pet?.age || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Uploaded On
                                </p>

                                <p className="font-semibold">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Uploaded Reports */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-orange-600">
                            Uploaded Reports
                        </h3>

                        <div className="space-y-4">
                            {report.reports?.length ? (
                                report.reports.map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border p-5 transition hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <FileText
                                                        size={18}
                                                        className="text-orange-500"
                                                    />

                                                    <span className="font-semibold text-orange-600">
                                                        {item.testName}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-gray-600">
                                                    {item.fileName}
                                                </p>
                                            </div>

                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600"
                                            >
                                                View PDF
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-gray-500">
                                    No reports uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-orange-600">
                            Remarks
                        </h3>

                        <div className="rounded-xl border bg-gray-50 p-5">
                            {report.remarks || "No remarks available."}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}