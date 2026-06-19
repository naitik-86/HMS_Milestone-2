import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const [pendingRegistrations, setPendingRegistrations] = useState([
    { token: "TK-001", owner: "Rahul Sharma", pet: "Tommy", status: "Pending" },
    { token: "TK-002", owner: "Aman Verma", pet: "Bruno", status: "Pending" },
    { token: "TK-003", owner: "Priya Singh", pet: "Coco", status: "Pending" },
    { token: "TK-004", owner: "Neha Gupta", pet: "Max", status: "Pending" },
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
    setPendingRegistrations((items) =>
      items.map((item) =>
        item.token === editForm.token
          ? {
              ...item,
              owner: editForm.owner,
              pet: editForm.pet,
              status: editForm.status,
            }
          : item
      )
    );
    setSelectedPet(null);
  };

  const stats = [
    { label: "Today's Visits", value: "124", color: "text-orange-500", icon: "TV" },
    { label: "New Pets", value: "18", color: "text-green-500", icon: "NP" },
    { label: "Appointments", value: "32", color: "text-blue-500", icon: "AP" },
    { label: "Pending", value: "15", color: "text-red-500", icon: "PN" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
          Reception Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Manage pet registrations, appointments and visits
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-500">{item.label}</p>
                <h2 className={`text-3xl sm:text-4xl font-bold mt-2 ${item.color}`}>
                  {item.value}
                </h2>
              </div>
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("new-registration")}
            className="h-14 sm:h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold transition"
          >
            New Registration
          </button>
          <button
            onClick={() => navigate("existing-customer")}
            className="h-14 sm:h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold transition"
          >
            Existing Customer
          </button>
          <button
            onClick={() => navigate("history")}
            className="h-14 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition"
          >
            Pet History
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Pending Registrations</h2>
          <span className="w-fit bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium">
            {pendingRegistrations.length} Pending
          </span>
        </div>

        <div className="md:hidden space-y-4">
          {pendingRegistrations.map((item) => (
            <div key={item.token} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Token No</p>
                  <h3 className="text-lg font-bold text-slate-800">{item.token}</h3>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-500">Owner Name</p>
                  <p className="font-semibold text-slate-800">{item.owner}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-500">Pet Name</p>
                  <p className="font-semibold text-slate-800">{item.pet}</p>
                </div>
              </div>

              <button
                onClick={() => handleEdit(item)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 pr-4">Token No</th>
                <th className="text-left py-4 pr-4">Owner Name</th>
                <th className="text-left py-4 pr-4">Pet Name</th>
                <th className="text-left py-4 pr-4">Status</th>
                <th className="text-left py-4 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRegistrations.map((item) => (
                <tr key={item.token} className="border-b hover:bg-slate-50">
                  <td className="py-4 pr-4 font-medium">{item.token}</td>
                  <td className="py-4 pr-4">{item.owner}</td>
                  <td className="py-4 pr-4">{item.pet}</td>
                  <td className="py-4 pr-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPet && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-[500px] p-5 sm:p-6 shadow-xl">
            <div className="flex justify-between items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Edit Registration</h2>
              <button onClick={() => setSelectedPet(null)} className="text-2xl font-bold">
                X
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Token Number</label>
                <input value={selectedPet.token} readOnly className="w-full border rounded-xl p-3 bg-slate-100" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Owner Name</label>
                <input
                  value={editForm.owner}
                  onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                  className="w-full border rounded-xl p-3"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Pet Name</label>
                <input
                  value={editForm.pet}
                  onChange={(e) => setEditForm({ ...editForm, pet: e.target.value })}
                  className="w-full border rounded-xl p-3"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border rounded-xl p-3"
                >
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <button onClick={() => setSelectedPet(null)} className="px-5 py-2 bg-slate-200 rounded-xl">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 bg-orange-500 text-white rounded-xl">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
