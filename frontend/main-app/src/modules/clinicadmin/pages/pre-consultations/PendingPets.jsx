import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PetRegistrationWizard from "./PetRegistrationWizard";

export default function PendingPets() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // Backend Data Will Come Here
  const pets = [
    {
      id: 1,
      token: "TK-001",
      ownerName: "Rahul Sharma",
      petName: "Bruno",
      phoneNumber: "+91 9876543210",
      status: "Pending",
    },
    {
      id: 2,
      token: "TK-002",
      ownerName: "Amit Verma",
      petName: "Max",
      phoneNumber: "+91 9876543211",
      status: "Pending",
    },
    {
      id: 3,
      token: "TK-003",
      ownerName: "Karan Kumar",
      petName: "Rocky",
      phoneNumber: "+91 9876543000",
      status: "Pending",
    },
  ];

  const filteredPets = pets.filter(
    (pet) =>
      pet.token?.toLowerCase().includes(search.toLowerCase()) ||
      pet.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      pet.petName?.toLowerCase().includes(search.toLowerCase()) ||
      pet.phoneNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-8">

        <Header
          title="Pending Pets"
          subtitle="Manage pending pet assessments"
        />

        {/* Search */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="relative">

            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              🔍
            </div>

            <input
              type="text"
              placeholder="Search by Token, Owner Name, Phone Number or Pet Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-14
                pr-4
                py-4
                bg-slate-50
                border
                border-slate-200
                rounded-2xl
                outline-none
                focus:bg-white
                focus:border-orange-500
                focus:ring-4
                focus:ring-orange-100
                transition-all
              "
            />

          </div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Table Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Pending Pets Queue
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Pets waiting for pre consultation assessment
              </p>

            </div>

            <div className="bg-orange-100 text-orange-600 px-5 py-2 rounded-2xl font-semibold">
              {filteredPets.length} Active Cases
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Token
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Owner Details
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pet Details
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPets.length > 0 ? (
                  filteredPets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="border-t border-slate-100 hover:bg-orange-50/30 transition-all duration-200"
                    >

                      {/* Token */}
                      <td className="px-6 py-5">

                        <span
                          className="
                          bg-slate-100
                          text-slate-700
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                          "
                        >
                          {pet.token}
                        </span>

                      </td>

                      {/* Owner */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                            {pet.ownerName.charAt(0)}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {pet.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {pet.phoneNumber}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Pet */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">
                            🐾
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {pet.petName}
                            </p>

                            <p className="text-sm text-slate-500">
                              Veterinary Patient
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">

                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>

                          {pet.status}

                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">

                        <div className="flex justify-center">

                          <button
                            onClick={() => {
                              setSelectedPet(pet);
                              setOpenModal(true);
                            }}
                            className="
                            bg-slate-800
                            hover:bg-slate-900
                            text-white
                            px-6
                            py-2.5
                            rounded-xl
                            font-medium
                            transition-all
                            "
                          >
                            Edit
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-20"
                    >

                      <div className="text-6xl mb-4">
                        🐾
                      </div>

                      <h3 className="text-xl font-bold text-slate-700">
                        No Pending Pets Found
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Try another search keyword.
                      </p>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Popup */}
        {openModal && (
          <PetRegistrationWizard
            petData={selectedPet}
            onClose={() => {
              setOpenModal(false);
              setSelectedPet(null);
            }}
          />
        )}

      </div>

    </div>
  );
}