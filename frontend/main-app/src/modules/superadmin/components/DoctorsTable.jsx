import { Loader2, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";

const statusStyles = {
    Submitted: "bg-blue-100 text-blue-700",
    Pending: "bg-slate-100 text-slate-600",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
};

const statusOptions = [
    ["SUBMITTED", "Submitted"],
    ["PENDING", "Pending"],
    ["APPROVED", "Approved"],
    ["REJECTED", "Rejected"],
];

export default function DoctorsTable({
    doctors = [],
    loading = false,
    error = "",
    onRefresh,
    onView,
    onEdit,
    onDelete,
    onStatusChange,
    updatingStatusId = "",
}) {
    const renderBody = () => {
        if (loading) {
            return (
                <div className="px-4 md:px-6 py-14 text-center text-gray-500">
                    <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-orange-500" />
                    Loading veterinarians...
                </div>
            );
        }

        if (error) {
            return (
                <div className="px-4 md:px-6 py-14 text-center">
                    <p className="text-sm font-medium text-gray-700">
                        {error}
                    </p>

                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    )}
                </div>
            );
        }

        if (!doctors.length) {
            return (
                <div className="px-4 md:px-6 py-14 text-center text-gray-500">
                    No veterinarians found. Add a new veterinarian to get started.
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 md:px-6 py-3">Veterinarian</th>
                            <th className="px-4 md:px-6 py-3">Mobile</th>
                            <th className="px-4 md:px-6 py-3">Location</th>
                            <th className="px-4 md:px-6 py-3">Practice</th>
                            <th className="px-4 md:px-6 py-3">Exp.</th>
                            <th className="px-4 md:px-6 py-3">Status</th>
                            <th className="px-4 md:px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {doctors.map((doctor) => {
                            const status = doctor.status || "Submitted";

                            return (
                                <tr
                                    key={doctor.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="font-medium text-gray-800">
                                            {doctor.name}
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            {doctor.displayId || doctor.id}
                                        </div>
                                    </td>

                                    <td className="px-4 md:px-6 py-4 text-gray-700">
                                        {doctor.mobile}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 text-gray-700">
                                        {doctor.location}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 text-gray-700">
                                        {doctor.practice}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 text-gray-700">
                                        {doctor.experience}
                                    </td>

                                    <td className="px-4 md:px-6 py-4">
                                        <select
                                            value={doctor.veterinarianStatus || status.toUpperCase()}
                                            onChange={(event) => onStatusChange?.(doctor, event.target.value)}
                                            disabled={updatingStatusId === doctor.id}
                                            aria-label={`Update status for ${doctor.name}`}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium outline-none disabled:cursor-wait disabled:opacity-60 ${
                                                statusStyles[status] || "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                        </select>
                                    </td>

                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => onView?.(doctor)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                                title="View veterinarian"
                                                aria-label="View veterinarian"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(doctor)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600 transition hover:bg-orange-100"
                                                title="Edit veterinarian"
                                                aria-label="Edit veterinarian"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(doctor)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                                                title="Delete veterinarian"
                                                aria-label="Delete veterinarian"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 shadow-sm"></span>
                        Veterinarian Registry
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                        Live veterinarians from the super-admin onboarding database
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {doctors.length} {doctors.length === 1 ? "Veterinarian" : "Veterinarians"}
                    </span>

                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    )}
                </div>
            </div>

            {renderBody()}
        </div>
    );
}
