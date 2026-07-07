import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  PawPrint,
  ClipboardList,
  CheckCircle,
  X,
} from "lucide-react";

export default function CreateVisit() {

  // ===========================
  // Mock Registration Data
  // ===========================

  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      petId: "PET001",
      ownerId: "OWN001",
      petName: "Rocky",
      ownerName: "Karan Kumar",
      phone: "9876543210",
      species: "Dog",
      breed: "Labrador",
      gender: "Male",
      age: "3 Years",
      status: "Pending",
    },
    {
      id: 2,
      petId: "PET002",
      ownerId: "OWN002",
      petName: "Bruno",
      ownerName: "Rahul Sharma",
      phone: "9876541230",
      species: "Dog",
      breed: "Beagle",
      gender: "Male",
      age: "2 Years",
      status: "Pending",
    },
    {
      id: 3,
      petId: "PET003",
      ownerId: "OWN003",
      petName: "Kitty",
      ownerName: "Anjali",
      phone: "9988776655",
      species: "Cat",
      breed: "Persian",
      gender: "Female",
      age: "1 Year",
      status: "Visit Created",
    },
  ]);

  // ===========================
  // States
  // ===========================

  const [search, setSearch] = useState("");

  const [selectedPet, setSelectedPet] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [visitData, setVisitData] = useState({
    visitType: "CONSULTATION",
    doctor: "",
    priority: "NORMAL",
    chiefComplaint: "",
    notes: "",
  });

  // ===========================
  // Search
  // ===========================

  const filteredData = useMemo(() => {
    return registrations.filter((item) =>
      `${item.petId} ${item.petName} ${item.ownerName} ${item.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, registrations]);

  // ===========================
  // Stats
  // ===========================

  const totalRegistrations = registrations.length;

  const pendingVisits = registrations.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedVisits = registrations.filter(
    (item) => item.status === "Visit Created"
  ).length;

  const todayTokens = 18;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Create Visit
          </h1>

          <p className="text-slate-500 mt-2">
            Create a visit for newly registered pets.
          </p>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">
                  Total Registrations
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalRegistrations}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                <PawPrint className="text-blue-600" />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">
                  Pending Visits
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {pendingVisits}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <ClipboardList className="text-yellow-600" />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">
                  Visits Created
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {completedVisits}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

                <CheckCircle className="text-green-600" />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-500 text-sm">
                  Today's Tokens
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {todayTokens}
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                <Plus className="text-orange-500" />

              </div>

            </div>

          </div>

        </div>
                {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-3xl shadow-md p-6 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold">
                Registered Pets
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Search newly registered pets and create a visit.
              </p>

            </div>

            <div className="relative w-full lg:w-96">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search Pet ID / Owner / Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-300 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500"
              />

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-3xl shadow-md overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Pet ID
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Pet Name
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Owner
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Species
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Breed
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredData.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >

                    <td className="px-5 py-4 font-medium">
                      {item.petId}
                    </td>

                    <td className="px-5 py-4">
                      {item.petName}
                    </td>

                    <td className="px-5 py-4">
                      {item.ownerName}
                    </td>

                    <td className="px-5 py-4">
                      {item.phone}
                    </td>

                    <td className="px-5 py-4">
                      {item.species}
                    </td>

                    <td className="px-5 py-4">
                      {item.breed}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-center">

                      {item.status === "Pending" ? (

                        <button
                          onClick={() => {
                            setSelectedPet(item);
                            setOpenModal(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                        >
                          Create Visit
                        </button>

                      ) : (

                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
                        >
                          View
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================= CREATE VISIT MODAL ================= */}

        {openModal && (

          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b">

                <div>

                  <h2 className="text-2xl font-bold">
                    Create Visit
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    Complete visit information.
                  </p>

                </div>

                <button
                  onClick={() => setOpenModal(false)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X size={20} />
                </button>

              </div>
                            {/* ================= Progress ================= */}

              <div className="px-6 pt-6">

                <div className="flex items-center justify-center">

                  <div className="flex items-center w-full max-w-xl">

                    <div className="flex flex-col items-center">

                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        ✓
                      </div>

                      <span className="text-sm mt-2 font-medium">
                        Registration
                      </span>

                    </div>

                    <div className="flex-1 h-1 bg-green-500 mx-3"></div>

                    <div className="flex flex-col items-center">

                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                        2
                      </div>

                      <span className="text-sm mt-2 font-medium">
                        Create Visit
                      </span>

                    </div>

                    <div className="flex-1 h-1 bg-slate-300 mx-3"></div>

                    <div className="flex flex-col items-center">

                      <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold">
                        3
                      </div>

                      <span className="text-sm mt-2">
                        Completed
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= Body ================= */}

              <div className="p-6 space-y-6">

                {/* Pet Details */}

                <div className="bg-slate-50 rounded-2xl p-6">

                  <h3 className="text-xl font-bold mb-5">
                    Pet Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    <div>
                      <label className="text-sm text-slate-500">
                        Pet ID
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.petId}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-500">
                        Pet Name
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.petName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-500">
                        Owner Name
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.ownerName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-500">
                        Phone
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.phone}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-500">
                        Species
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.species}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-slate-500">
                        Breed
                      </label>

                      <p className="font-semibold mt-1">
                        {selectedPet?.breed}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Visit Details */}

                <div className="bg-white border rounded-2xl p-6">

                  <h3 className="text-xl font-bold mb-5">
                    Visit Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                      <label className="block mb-2 font-medium">
                        Visit Type
                      </label>

                      <select
                        value={visitData.visitType}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            visitType: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      >
                        <option>CONSULTATION</option>
                        <option>VACCINATION</option>
                        <option>GROOMING</option>
                        <option>SURGERY</option>
                        <option>KENNEL</option>
                        <option>FOLLOW_UP</option>
                        <option>EMERGENCY</option>
                      </select>

                    </div>

                    <div>

                      <label className="block mb-2 font-medium">
                        Doctor
                      </label>

                      <select
                        value={visitData.doctor}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            doctor: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      >
                        <option value="">
                          Select Doctor
                        </option>

                        <option>Dr. Rahul</option>
                        <option>Dr. Amit</option>
                        <option>Dr. Priya</option>

                      </select>

                    </div>

                    <div>

                      <label className="block mb-2 font-medium">
                        Priority
                      </label>

                      <select
                        value={visitData.priority}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            priority: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      >
                        <option>NORMAL</option>
                        <option>URGENT</option>
                        <option>EMERGENCY</option>
                      </select>

                    </div>

                    <div className="md:col-span-2">

                      <label className="block mb-2 font-medium">
                        Chief Complaint
                      </label>

                      <textarea
                        rows={4}
                        value={visitData.chiefComplaint}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            chiefComplaint: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Enter chief complaint..."
                      />

                    </div>

                    <div className="md:col-span-2">

                      <label className="block mb-2 font-medium">
                        Notes
                      </label>

                      <textarea
                        rows={3}
                        value={visitData.notes}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            notes: e.target.value,
                          })
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Additional notes..."
                      />

                    </div>

                  </div>

                </div>

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row justify-end gap-4">

                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      alert("Visit Created Successfully");

                      setRegistrations((prev) =>
                        prev.map((pet) =>
                          pet.id === selectedPet.id
                            ? { ...pet, status: "Visit Created" }
                            : pet
                        )
                      );

                      setOpenModal(false);
                    }}
                    className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    Create Visit
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}