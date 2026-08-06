/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, ShieldCheck, X } from "lucide-react";
import { getSuperAdminTeam, createSuperAdminTeamMember, deleteSuperAdminTeamMember } from "../api/teamApi";
import { showToast } from "../../../shared/components/toast";

const getStoredSelf = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
};

export default function Team() {
    const self = getStoredSelf();
    // Only an original super admin (one with no createdBy) can remove a
    // team member - same rule the backend enforces. Hiding the button for
    // a sub super admin here is just UX; the real gate is server-side.
    const isOriginal = !self?.createdBy;

    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const loadTeam = async () => {
        setLoading(true);
        try {
            const res = await getSuperAdminTeam();
            setTeam(res.data || []);
        } catch (error) {
            showToast({
                type: "error",
                title: "Failed to load team",
                description: error.response?.data?.message || "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim() || form.name.trim().length < 3) {
            nextErrors.name = "Name must be at least 3 characters.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const res = await createSuperAdminTeamMember({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
            });
            showToast({
                type: "success",
                title: "Super admin created",
                description: res.message,
            });
            setShowAddModal(false);
            setForm({ name: "", email: "" });
            setErrors({});
            loadTeam();
        } catch (error) {
            showToast({
                type: "error",
                title: "Could not create super admin",
                description: error.response?.data?.message || "Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (member) => {
        if (!window.confirm(`Remove ${member.name || member.email} from the super admin team? This cannot be undone.`)) return;

        try {
            await deleteSuperAdminTeamMember(member._id);
            showToast({ type: "success", title: "Removed", description: `${member.name || member.email} has been removed.` });
            loadTeam();
        } catch (error) {
            showToast({
                type: "error",
                title: "Could not remove",
                description: error.response?.data?.message || "Please try again.",
            });
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                            <Users size={22} className="text-[#F7931E]" />
                            Super Admin Team
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Internal-ops accounts with full super admin access.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C3D2E] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#092E23]"
                    >
                        <UserPlus size={16} />
                        Add Super Admin
                    </button>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
                    ) : team.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">No super admin accounts found.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {team.map((member) => (
                                <div key={member._id} className="flex items-center justify-between gap-4 p-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0C3D2E]/10 text-[#0C3D2E]">
                                            <ShieldCheck size={18} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {member.name || "Unnamed"}
                                                {!member.createdBy && (
                                                    <span className="ml-2 rounded-full bg-[#0C3D2E]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0C3D2E]">
                                                        Original
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                        </div>
                                    </div>

                                    {isOriginal && member._id !== self._id && (
                                        <button
                                            onClick={() => handleDelete(member)}
                                            className="shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                            title="Remove from team"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Add Super Admin</h2>
                            <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#F7931E] focus:ring-2 focus:ring-[#F7931E]/20"
                                    placeholder="Full name"
                                />
                                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#F7931E] focus:ring-2 focus:ring-[#F7931E]/20"
                                    placeholder="name@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
                            </div>

                            <p className="text-xs text-gray-400">
                                A temporary password will be generated and emailed to this address.
                            </p>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-xl bg-[#F7931E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e08319] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
