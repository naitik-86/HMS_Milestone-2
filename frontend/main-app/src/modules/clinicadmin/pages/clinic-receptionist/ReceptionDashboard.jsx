import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExistingCustomers,
  getDashboardStats,
  updateOwner,
  updatePet
} from "../../api/receptionApi";
import { 
  Plus, 
  ClipboardList, 
  UserCheck, 
  Calendar, 
  Clock, 
  Activity, 
  X,
  Edit2
} from "lucide-react";

export default function ReceptionDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    todayVisits: 0,
    newPets: 0,
    appointments: 0,
    pending: 0,
  });

  const [selectedPet, setSelectedPet] = useState(null);
  const [editForm, setEditForm] = useState({
    token: "",
    owner: "",
    pet: "",
    status: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch stats from backend
      const statsRes = await getDashboardStats();
      const backendStats = statsRes.data || {};

      // 2. Fetch customers to populate table and compute today's stats
      const customersRes = await getExistingCustomers();
      const customers = customersRes.data || [];

      const pendingList = [];
      let todayVisitsCount = 0;
      let newPetsTodayCount = 0;

      const todayStr = new Date().toISOString().split("T")[0];

      customers.forEach((item) => {
        const owner = item.owner || {};
        const pet = item.pet || {};
        const visits = pet.visits || [];

        // Count new pets registered today (checking owner/pet createdAt timestamp)
        const ownerCreatedDate = owner.createdAt ? owner.createdAt.split("T")[0] : null;
        if (ownerCreatedDate === todayStr) {
          newPetsTodayCount++;
        }

        visits.forEach((visit) => {
          const visitDate = visit.appointmentDate ? visit.appointmentDate.split("T")[0] : null;
          if (visitDate === todayStr) {
            todayVisitsCount++;
          }

          if (visit.status === "Pending") {
            pendingList.push({
              token: visit.tokenNumber || `TK-${visit._id ? visit._id.substring(visit._id.length - 4) : 'N/A'}`,
              owner: owner.ownerName || "Unknown Owner",
              pet: pet.petName || "Unknown Pet",
              status: "Pending",
              ownerId: owner._id,
              petId: pet._id,
              visitId: visit._id
            });
          }
        });
      });

      setPendingRegistrations(pendingList);

      setDashboardStats({
        todayVisits: todayVisitsCount || backendStats.activeVisits || 0,
        newPets: newPetsTodayCount || backendStats.totalPets || 0,
        appointments: backendStats.totalPets || 0,
        pending: pendingList.length || backendStats.pendingVisits || 0,
      });

    } catch (error) {
      console.error("Error fetching receptionist dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setEditForm({
      token: pet.token,
      owner: pet.owner,
      pet: pet.pet,
      status: pet.status,
    });
  };

  const handleSave = async () => {
    try {
      if (!selectedPet) return;

      // 1. Update Owner name in backend
      if (editForm.owner && selectedPet.ownerId) {
        await updateOwner(selectedPet.ownerId, { ownerName: editForm.owner });
      }

      // 2. Update Pet name in backend
      if (editForm.pet && selectedPet.ownerId && selectedPet.petId) {
        await updatePet(selectedPet.ownerId, selectedPet.petId, { petName: editForm.pet });
      }

      // 3. Since there's no endpoint to update visit status inside PetRegistration,
      // we update the frontend state list to keep it responsive and clean.
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
        ).filter(item => item.status === "Pending")
      );

      setSelectedPet(null);
      alert("Changes saved successfully!");
      fetchData();
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const stats = [
    { label: "Today's Visits", value: String(dashboardStats.todayVisits), color: "text-orange-600 bg-orange-50 border-orange-100", icon: Activity },
    { label: "New Pets", value: String(dashboardStats.newPets), color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: Plus },
    { label: "Appointments", value: String(dashboardStats.appointments), color: "text-blue-600 bg-blue-50 border-blue-100", icon: Calendar },
    { label: "Pending", value: String(dashboardStats.pending), color: "text-rose-600 bg-rose-50 border-rose-100", icon: Clock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-semibold animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100/70 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">{item.label}</p>
                  <h2 className="text-4xl font-extrabold mt-2 text-slate-800 tracking-tight">
                    {item.value}
                  </h2>
                </div>
                <div className={`h-12 w-12 shrink-0 rounded-2xl border flex items-center justify-center ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200/60 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("new-registration")}
            className="group h-16 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer border-none"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            Patient Registration & Intake
          </button>
          <button
            onClick={() => navigate("existing-customer")}
            className="group h-16 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer border-none"
          >
            <UserCheck className="h-5 w-5 transition-transform group-hover:scale-110" />
            Existing Customer Records
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pending Registrations</h2>
            <p className="text-slate-400 text-sm mt-1">Visits waiting for vitals checking</p>
          </div>
          <span className="w-fit bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
            {pendingRegistrations.length} Active
          </span>
        </div>

        <div className="md:hidden space-y-4">
          {pendingRegistrations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl">
              No pending registrations found
            </div>
          ) : (
            pendingRegistrations.map((item) => (
              <div key={item.token} className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Token No</p>
                    <h3 className="text-base font-mono font-bold text-slate-800">{item.token}</h3>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3 border border-slate-100">
                    <p className="text-xs text-slate-400">Owner Name</p>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{item.owner}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-100">
                    <p className="text-xs text-slate-400">Pet Name</p>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{item.pet}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(item)}
                  className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Details
                </button>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                <th className="text-left py-4 px-2">Token No</th>
                <th className="text-left py-4 px-2">Owner Name</th>
                <th className="text-left py-4 px-2">Pet Name</th>
                <th className="text-left py-4 px-2">Status</th>
                <th className="text-right py-4 px-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {pendingRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    No pending registrations found
                  </td>
                </tr>
              ) : (
                pendingRegistrations.map((item) => (
                  <tr key={item.token} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-mono font-semibold text-slate-700">{item.token}</td>
                    <td className="py-4 px-2 font-medium">{item.owner}</td>
                    <td className="py-4 px-2 font-medium">{item.pet}</td>
                    <td className="py-4 px-2">
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-xl transition font-medium text-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-[500px] p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Edit Registration</h2>
              <button 
                onClick={() => setSelectedPet(null)} 
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Token Number</label>
                <input value={selectedPet.token} readOnly className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-500 font-mono font-medium outline-none" />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Name</label>
                <input
                  value={editForm.owner}
                  onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Pet Name</label>
                <input
                  value={editForm.pet}
                  onChange={(e) => setEditForm({ ...editForm, pet: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none cursor-pointer"
                >
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button 
                  onClick={() => setSelectedPet(null)} 
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-md shadow-orange-100 transition cursor-pointer border-none"
                >
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
