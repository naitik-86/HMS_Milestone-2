import { useEffect, useState } from "react";
import { getExistingCustomers } from "../../api/receptionApi";

export default function ExistingCustomerPet() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getExistingCustomers();
        console.log("API Response:", response.data);
        setCustomers(response.data);
      } catch (error) {
        console.log("Failed to fetch customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.owner?.ownerName?.toLowerCase().includes(value) ||
      item.pet?.petName?.toLowerCase().includes(value) ||
      item.pet?.uniquePetId?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
          Existing Customer Pet
        </h1>
        <p className="text-slate-500 mt-2">
          Search and view existing customer records
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200 sm:rounded-4xl">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-5 py-5 sm:px-8 sm:py-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Existing Customer Records
          </h2>
          <p className="mt-1 text-orange-100">
            Search by Owner Name, Pet Name or Pet ID
          </p>
        </div>

        <div className="p-4 sm:p-8">
          {/* Search */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              Search
            </div>

            <input
              type="text"
              placeholder="Owner, Pet Name or Pet ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-20 pr-4 transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 sm:rounded-3xl sm:py-4 sm:pl-24 sm:pr-5"
            />
          </div>

          {/* Mobile View */}
          <div className="space-y-4 md:hidden">
            {filteredCustomers.map((item) => (
              <div
                key={item.pet?._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Pet ID
                  </p>
                  <h3 className="text-lg font-bold text-slate-800">
                    {item.pet?.uniquePetId}
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-500">Owner Name</p>
                    <p className="font-semibold text-slate-800">
                      {item.owner?.ownerName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Pet Name</p>
                      <p className="font-semibold text-slate-800">
                        {item.pet?.petName}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Species</p>
                      <p className="font-semibold text-slate-800">
                        {item.pet?.species}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Breed</p>
                      <p className="font-semibold text-slate-800">
                        {item.pet?.breed}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Mobile</p>
                      <p className="font-semibold text-slate-800">
                        {item.owner?.mobileNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Pet ID
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Owner Name
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Pet Name
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Species
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Breed
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Mobile
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Gender
                  </th>
                  <th className="p-5 text-left font-semibold text-slate-700">
                    Age
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((item) => (
                  <tr
                    key={item.pet?._id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="p-5 font-semibold text-slate-700">
                      {item.pet?.uniquePetId}
                    </td>

                    <td className="p-5">
                      {item.owner?.ownerName}
                    </td>

                    <td className="p-5">
                      {item.pet?.petName}
                    </td>

                    <td className="p-5">
                      {item.pet?.species}
                    </td>

                    <td className="p-5">
                      {item.pet?.breed}
                    </td>

                    <td className="p-5">
                      {item.owner?.mobileNumber}
                    </td>

                    <td className="p-5">
                      {item.pet?.gender}
                    </td>

                    <td className="p-5">
                      {item.pet?.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold text-slate-700">
                No Records Found
              </h3>
              <p className="mt-2 text-slate-500">
                Try searching with another owner name, pet name or pet ID.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}