export default function PreConsultationReportModal({
    open,
    onClose,
    data,
}) {

    if (!open) return null;
    console.log(data);


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white w-[1100px] max-w-[96%] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}

                <div className="bg-orange-500 text-white px-8 py-5 flex justify-between items-center">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Pre-Consultation Report
                        </h2>

                        <p className="text-sm opacity-90 mt-1">
                            Token : {data?.tokenNumber || "--"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl hover:opacity-80"
                    >
                        ✕
                    </button>

                </div>

                {/* BODY */}

                <div className="p-8 max-h-[78vh] overflow-y-auto space-y-8">

                    {/* ================= Patient Information ================= */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Patient Information
                        </h3>

                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-5">

                            <div>
                                <p className="text-xs text-gray-500">
                                    Token
                                </p>

                                <p className="font-semibold">
                                    {data?.tokenNumber || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Pet ID
                                </p>

                                <p className="font-semibold">
                                    {data?.uniquePetId || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Owner</p>
                                <p className="font-semibold">{data?.owner?.ownerName}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Recorded By
                                </p>

                                <p className="font-semibold">
                                    {data?.recordedBy || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                                    {data?.status}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ================= Vitals ================= */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Vitals & Initial Assessment
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                            <InfoCard
                                label="Temperature"
                                value={`${data?.bodyTemperature} °C`}
                            />

                            <InfoCard
                                label="Heart Rate"
                                value={`${data?.heartRate} bpm`}
                            />

                            <InfoCard
                                label="Respiratory Rate"
                                value={`${data?.respiratoryRate} bpm`}
                            />

                            <InfoCard
                                label="Blood Pressure"
                                value={data?.bloodPressure}
                            />

                            <InfoCard
                                label="SpO₂"
                                value={`${data?.spo2}%`}
                            />

                            <InfoCard
                                label="Weight"
                                value={`${data?.bodyWeight} kg`}
                            />

                            <InfoCard
                                label="BCS"
                                value={data?.bcs}
                            />

                            <InfoCard
                                label="Recorded At"
                                value={
                                    data?.vitalsRecordedAt
                                        ? new Date(data.vitalsRecordedAt).toLocaleString()
                                        : "-"
                                }
                            />

                        </div>

                    </div>

                    {/* ================= History ================= */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Medical History
                        </h3>

                        <div className="bg-white border rounded-xl p-5 grid grid-cols-2 md:grid-cols-3 gap-5">

                            <InfoCard
                                label="Duration"
                                value={`${data?.durationOfIllness?.value || "-"} ${data?.durationOfIllness?.unit || ""}`}
                            />

                            <InfoCard
                                label="Onset"
                                value={data?.onset}
                            />

                            <InfoCard
                                label="Progression"
                                value={data?.progression}
                            />

                            <InfoCard
                                label="Previous Episodes"
                                value={
                                    data?.previousEpisodes?.hasPreviousEpisodes
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <InfoCard
                                label="Animal Contact"
                                value={data?.animalContact ? "Yes" : "No"}
                            />

                            <InfoCard
                                label="Recent Travel"
                                value={data?.recentTravel ? "Yes" : "No"}
                            />

                        </div>

                        {data?.previousEpisodes?.description && (

                            <div className="mt-5 bg-gray-50 border rounded-xl p-4">

                                <p className="font-semibold mb-2">
                                    Previous Episode Description
                                </p>

                                <p className="text-gray-700">
                                    {data.previousEpisodes.description}
                                </p>

                            </div>

                        )}

                    </div>

                    {/* ================= Clinical Assessment ================= */}

                    <div>

                        <h3 className="text-lg font-semibold text-orange-600 mb-4">
                            Clinical Assessment
                        </h3>

                        <div className="space-y-5">

                            <Section
                                title="Primary Complaint"
                                value={data?.primaryComplaint}
                            />

                            <Section
                                title="Severity"
                                value={data?.severity}
                            />

                            <Section
                                title="General Demeanour"
                                value={data?.generalDemeanour}
                            />

                            <Section
                                title="Associated Symptoms"
                                value={
                                    data?.associatedSymptoms?.length
                                        ? data.associatedSymptoms.join(", ")
                                        : "-"
                                }
                            />

                            <Section
                                title="Gait & Posture"
                                value={data?.gaitAndPosture}
                            />

                            <Section
                                title="Visible Lesions"
                                value={data?.visibleLesions}
                            />

                            <Section
                                title="Eyes"
                                value={data?.eyesAbnormality}
                            />

                            <Section
                                title="Nose"
                                value={data?.noseAbnormality}
                            />

                            <Section
                                title="Ears"
                                value={data?.earAbnormality}
                            />

                            <Section
                                title="Skin"
                                value={data?.skinCondition}
                            />

                            <Section
                                title="Staff Notes"
                                value={data?.staffNotes}
                            />

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="bg-gray-50 border-t px-6 py-4 flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border hover:bg-gray-100"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold mt-1">{value || "-"}</p>
        </div>
    );
}

function Section({ title, value }) {
    return (
        <div className="bg-gray-50 border rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-2">
                {title}
            </p>

            <p className="text-gray-600">
                {value || "-"}
            </p>
        </div>
    );
}