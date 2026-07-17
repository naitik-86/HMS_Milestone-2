import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import AddDoctor from "../components/forms/doctorForm/AddDoctor";
import DoctorDetailsModal from "../components/forms/doctorForm/DoctorDetailsModal";
import DoctorModal from "../components/forms/doctorForm/DoctorModal";
import DoctorsTable from "../components/DoctorsTable";
import { deleteDoctor, getDoctors } from "../api/doctorApi";
import { showToast } from "../../../shared/components/toast";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewDoctor, setViewDoctor] = useState(null);
    const [editDoctor, setEditDoctor] = useState(null);

    const loadDoctors = useCallback(async (query = "") => {
        setLoading(true);
        setError("");

        try {
            const response = await getDoctors(query ? { search: query } : {});
            const records = Array.isArray(response.data) ? response.data : [];
            setDoctors(records);
        } catch (err) {
            setDoctors([]);
            setError(
                err.response?.data?.message ||
                "Unable to load veterinarians right now."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        loadDoctors(searchTerm);
    }, [loadDoctors, searchTerm]);

    const handleCreated = () => {
        loadDoctors(searchTerm);
    };

    const handleViewDoctor = (doctor) => {
        setEditDoctor(null);
        setViewDoctor(doctor);
    };

    const handleEditDoctor = (doctor) => {
        setViewDoctor(null);
        setEditDoctor(doctor);
    };

    const handleDeleteDoctor = async (doctor) => {
        if (!doctor?.id) return;

        const confirmed = window.confirm(
            `Delete veterinarian ${doctor.name}? This will remove the record from the registry.`
        );

        if (!confirmed) return;

        try {
            await deleteDoctor(doctor.id);
            showToast({
                type: "success",
                title: "Veterinarian deleted",
                description: `${doctor.name} was removed from the registry.`,
            });
            setViewDoctor((current) => (current?.id === doctor.id ? null : current));
            setEditDoctor((current) => (current?.id === doctor.id ? null : current));
            loadDoctors(searchTerm);
        } catch (err) {
            showToast({
                type: "error",
                title: "Delete failed",
                description:
                    err.response?.data?.message ||
                    "Unable to delete the veterinarian right now.",
            });
        }
    };

    const handleDoctorSaved = () => {
        setEditDoctor(null);
        loadDoctors(searchTerm);
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <AddDoctor onCreated={handleCreated} />

            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            Live Veterinarian Registry
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Search and manage veterinarians synced from the backend.
                        </p>
                    </div>

                    <div className="w-full sm:max-w-sm">
                        <label htmlFor="veterinarian-search" className="sr-only">
                            Search veterinarians
                        </label>

                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                            <Search size={18} className="text-gray-400" />

                            <input
                                id="veterinarian-search"
                                type="search"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search by name, mobile, city, or specialization"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <DoctorsTable
                doctors={doctors}
                loading={loading}
                error={error}
                onRefresh={() => loadDoctors(searchTerm)}
                onView={handleViewDoctor}
                onEdit={handleEditDoctor}
                onDelete={handleDeleteDoctor}
            />

            {viewDoctor && (
                <DoctorDetailsModal
                    doctor={viewDoctor}
                    onClose={() => setViewDoctor(null)}
                    onEdit={(doctor) => {
                        setViewDoctor(null);
                        setEditDoctor(doctor);
                    }}
                    onDelete={handleDeleteDoctor}
                />
            )}

            {editDoctor && (
                <DoctorModal
                    mode="edit"
                    doctor={editDoctor}
                    onClose={() => setEditDoctor(null)}
                    onSaved={handleDoctorSaved}
                />
            )}
        </div>
    );
}
