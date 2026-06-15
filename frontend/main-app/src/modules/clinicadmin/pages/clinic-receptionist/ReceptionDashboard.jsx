import { useState } from "react";

export default function ReceptionDashboard() {
    const [pendingRegistrations, setPendingRegistrations] = useState([
        {
            token: "TK-001",
            owner: "Rahul Sharma",
            pet: "Tommy",
            status: "Pending",
        },
        {
            token: "TK-002",
            owner: "Aman Verma",
            pet: "Bruno",
            status: "Pending",
        },
        {
            token: "TK-003",
            owner: "Priya Singh",
            pet: "Coco",
            status: "Pending",
        },
        {
            token: "TK-004",
            owner: "Neha Gupta",
            pet: "Max",
            status: "Pending",
        },
    ]);

    const [selectedPet, setSelectedPet] = useState(null);

    const [editForm, setEditForm] = useState({
        token: "",
        owner: "",
        pet: "",
        status: "",
    });

    const handleEdit = (pet) => {
        setSelectedPet(pet);

        setEditForm({
            token: pet.token,
            owner: pet.owner,
            pet: pet.pet,
            status: pet.status,
        });
    };

    const handleSave = () => {
        const updatedData = pendingRegistrations.map((item) =>
            item.token === editForm.token
                ? {
                    ...item,
                    owner: editForm.owner,
                    pet: editForm.pet,
                    status: editForm.status,
                }
                : item
        );

        setPendingRegistrations(updatedData);
        setSelectedPet(null);
    };


    return (
        <div className="min-h-screen bg-slate-100 p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800">
                    Reception Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage pet registrations, appointments and visits
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500">
                                Today's Visits
                            </p>

                            <h2 className="text-4xl font-bold mt-2 text-orange-500">
                                124
                            </h2>
                        </div>

                        <div className="text-4xl">
                            🏥
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500">
                                New Pets
                            </p>

                            <h2 className="text-4xl font-bold mt-2 text-green-500">
                                18
                            </h2>
                        </div>

                        <div className="text-4xl">
                            🐾
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500">
                                Appointments
                            </p>

                            <h2 className="text-4xl font-bold mt-2 text-blue-500">
                                32
                            </h2>
                        </div>

                        <div className="text-4xl">
                            📅
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500">
                                Pending
                            </p>

                            <h2 className="text-4xl font-bold mt-2 text-red-500">
                                15
                            </h2>
                        </div>

                        <div className="text-4xl">
                            ⏳
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">

                <h2 className="text-2xl font-bold mb-5">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-3 gap-4">

                    <button className="h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition">
                        🐾 New Registration
                    </button>

                    <button className="h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition">
                        👤 Existing Customer
                    </button>

                    <button className="h-16 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition">
                        📋 Pet History
                    </button>

                </div>

            </div>

            {/* Pending Registration Table */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        Pending Registrations
                    </h2>

                    <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium">
                        {pendingRegistrations.length} Pending
                    </span>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-4">
                                    Token No
                                </th>

                                <th className="text-left py-4">
                                    Owner Name
                                </th>

                                <th className="text-left py-4">
                                    Pet Name
                                </th>

                                <th className="text-left py-4">
                                    Status
                                </th>

                                <th className="text-left py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {pendingRegistrations.map(
                                (item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="py-4 font-medium">
                                            {item.token}
                                        </td>

                                        <td className="py-4">
                                            {item.owner}
                                        </td>

                                        <td className="py-4">
                                            {item.pet}
                                        </td>

                                        <td className="py-4">
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="py-4">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>
                    {selectedPet && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                            <div className="bg-white rounded-3xl w-[500px] p-6 shadow-xl">

                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        Edit Registration
                                    </h2>

                                    <button
                                        onClick={() => setSelectedPet(null)}
                                        className="text-2xl font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Token Number
                                        </label>

                                        <input
                                            value={selectedPet.token}
                                            readOnly
                                            className="w-full border rounded-xl p-3 bg-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Owner Name
                                        </label>

                                        <input
                                            value={editForm.owner}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    owner: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded-xl p-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Pet Name
                                        </label>

                                        <input
                                            value={editForm.pet}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    pet: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded-xl p-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">
                                            Status
                                        </label>

                                        <select
                                            value={editForm.status}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded-xl p-3"
                                        >
                                            <option>Pending</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">

                                        <button
                                            onClick={() => setSelectedPet(null)}
                                            className="px-5 py-2 bg-slate-200 rounded-xl"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleSave}
                                            className="px-5 py-2 bg-orange-500 text-white rounded-xl"
                                        >
                                            Save Changes
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}


