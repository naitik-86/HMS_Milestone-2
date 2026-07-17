import { Loader2, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";

const statusStyles = {
    Active: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Suspended: "bg-rose-100 text-rose-700",
};

export default function DoctorsTable({
    doctors = [],
    loading = false,
    error = "",
    onRefresh,
    onView,
    onEdit,
    onDelete,
}) {
    const handleDoctorAction = (action, doctor) => {
        switch (action) {
            case "View":
                console.log("View", doctor);
                break;
            case "Edit":
                console.log("Edit", doctor);
                break;
            case "Delete":
                console.log("Delete", doctor);
                break;
            default:
                break;
        }
    };

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
                            const status = doctor.status || "Active";

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
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                statusStyles[status] || "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </td>

                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex justify-end gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView
                                                        ? onView(doctor)
                                                        : handleDoctorAction("View", doctor)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit
                                                        ? onEdit(doctor)
                                                        : handleDoctorAction("Edit", doctor)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete
                                                        ? onDelete(doctor)
                                                        : handleDoctorAction("Delete", doctor)
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                            >
                                                <Trash2 size={14} />
                                                Delete
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
