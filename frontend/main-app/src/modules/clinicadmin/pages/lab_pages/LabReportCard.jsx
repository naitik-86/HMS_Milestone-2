import React from "react";
import { FileText, User, PawPrint, Calendar } from "lucide-react";

export default function LabReportModal({
    open,
    onClose,
    report,
}) {

    if (!open || !report) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6">

            <div className="bg-white w-[1050px] max-w-[96%] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}

                <div className="bg-orange-500 text-white px-8 py-5 flex justify-between items-center">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Laboratory Report
                        </h2>

                        <p className="text-sm opacity-90 mt-1">
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

                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">

                    {/* Patient Information */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Patient Information
                        </h3>

                        <div className="grid grid-cols-5 gap-4 bg-orange-50 border border-orange-200 rounded-xl p-5">

                            <div>
                                <p className="text-xs text-gray-500">
                                    Token
                                </p>

                                <p className="font-semibold">
                                    {report?.visitId?.tokenNumber || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Pet Name
                                </p>

                                <p className="font-semibold">
                                    {report?.petId?.name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Owner
                                </p>

                                <p className="font-semibold">
                                    {report?.ownerId?.ownerName || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                    {report?.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Uploaded
                                </p>

                                <p className="font-semibold">
                                    {new Date(report?.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Reports */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Uploaded Reports
                        </h3>

                        <div className="space-y-4">

                            {report?.reports?.length > 0 ? (

                                report.reports.map((item, index) => (

                                    <div
                                        key={index}
                                        className="border rounded-xl p-5 hover:shadow-md transition"
                                    >

                                        <div className="flex justify-between items-center">

                                            <div className="space-y-2">

                                                <div className="flex items-center gap-2">

                                                    <FileText
                                                        size={18}
                                                        className="text-orange-500"
                                                    />

                                                    <span className="font-semibold text-orange-600">
                                                        {item.testName}
                                                    </span>

                                                </div>

                                                <p className="text-gray-600">
                                                    {item.fileName}
                                                </p>

                                            </div>

                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition"
                                            >
                                                View PDF
                                            </a>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="text-center py-10 text-gray-500">

                                    No reports uploaded.

                                </div>

                            )}

                        </div>

                    </div>

                    {/* Remarks */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-3">
                            Remarks
                        </h3>

                        <div className="bg-gray-50 border rounded-xl p-5">

                            {report?.remarks || "No Remarks"}

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="bg-gray-50 border-t px-6 py-4 flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}