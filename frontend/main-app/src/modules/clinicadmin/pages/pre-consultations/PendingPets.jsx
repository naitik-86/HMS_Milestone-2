import { useState } from "react";
import { Header } from "../../components";
import PetRegistrationWizard from "./PetRegistrationWizard";
import { getPendingPets } from "../../api/preConsultationApi";
import { useEffect } from "react";

export default function PendingPets() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPendingPets();
  }, []);

  const fetchPendingPets = async () => {
    try {
      const res = await getPendingPets();
      console.log(res.data);

      setPets(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  // const filteredPets = pets
  const filteredPets = pets
  // .filter(
  //   (pet) =>
  //     pet.tokenNumber?.toLowerCase().includes(search.toLowerCase()) ||
  //     pet.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
  //     pet.petName?.toLowerCase().includes(search.toLowerCase()) ||
  //     pet.phoneNumber?.toLowerCase().includes(search.toLowerCase())
  // );


  return (
    <div className="flex-1 bg-slate-100">


      <div className="p-4 md:p-6 lg:p-8 pt-20 md:pt-6">

        <Header
          title="Pending Pets"
          subtitle="Manage pending pet assessments"
          showSearch={false}
        />

        {/* Search */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-6 mb-6">

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-8 py-6 border-b border-slate-200 bg-linear-to-r from-orange-50 to-white">

            <div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
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

          <div className="hidden lg:block overflow-x-auto">

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
                      key={pet._id}
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
                          {pet.tokenNumber}
                        </span>

                      </td>

                      {/* Owner */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                            {pet?.owner?.ownerName?.charAt(0)}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {pet?.owner?.ownerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {pet?.owner?.mobileNumber}
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
                              {pet.uniquePetId}
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
          <div className="lg:hidden p-4 space-y-4">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {pet.token}
                  </span>

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {pet.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Owner:</strong> {pet.ownerName}</p>
                  <p><strong>Phone:</strong> {pet.phoneNumber}</p>
                  <p><strong>Pet:</strong> {pet.petName}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPet(pet);
                    setOpenModal(true);
                  }}
                  className="mt-4 w-full bg-slate-800 text-white py-3 rounded-xl"
                >
                  Edit
                </button>
              </div>
            ))}
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
            onCompleted={fetchPendingPets}
          />
        )}

      </div>

    </div>
  );
}