export default function LabReportModal({
    open,
    onClose,
    report,
}) {

    if (!open) return null;
    console.log(report);


    return (

        <>

            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white w-[1000px] max-w-[96%] rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="bg-orange-500 text-white px-8 py-5 flex justify-between items-center">

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Laboratory Reports
                                </h2>

                                <p className="text-sm opacity-90 mt-1">
                                    {report?.petId?.name} • {report?.petId?.ownerId?.ownerName}
                                </p>
                            </div>

                            <button
                                onClick={() => onClose(false)}
                                className="text-2xl hover:opacity-80"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Body */}
                        <div className="p-8 max-h-[75vh] overflow-y-auto space-y-6">

                            {/* Patient Card */}

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                                    <div>
                                        <p className="text-xs text-gray-500">Token</p>
                                        <p className="font-semibold">{report?.visitId?.tokenNumber}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Owner</p>
                                        <p className="font-semibold"> {report?.petId?.ownerId?.ownerName}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Pet</p>
                                        <p className="font-semibold">      {report?.petId?.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                            Completed
                                        </span>
                                    </div>

                                </div>

                            </div>


                            <h3 className="font-semibold text-lg">
                                Uploaded Reports
                            </h3>

                            <div className="space-y-4">

                                {report?.reports?.map((report, index) => (

                                    <div
                                        key={index}
                                        className="border rounded-xl p-5 hover:shadow-md transition"
                                    >

                                        <div className="flex justify-between">

                                            <div>

                                                <h4 className="font-semibold text-orange-600">
                                                    {report.testName}
                                                </h4>

                                                <p className="text-sm text-gray-600 mt-2">
                                                    <span className="font-medium">
                                                        File :
                                                    </span>{" "}
                                                    {report.fileName}
                                                </p>

                                            </div>
                                            <a
                                                href={report.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                                            >
                                                View PDF
                                            </a>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            <div>

                                <label className="font-semibold">
                                    Remarks
                                </label>

                                <div className="mt-2 bg-gray-50 border rounded-xl p-4">
                                    {report?.remarks || "No Remarks"}
                                </div>

                            </div>

                        </div>

                        <div className="bg-gray-50 border-t px-6 py-4 flex justify-end">

                            <button
                                onClick={() => onClose(false)}
                                className="px-5 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}