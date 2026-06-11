import { useState } from "react";

export default function ExistingCustomerPet() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "PET001",
      owner: "Karan Kumar",
      pet: "Tommy",
      reason: "Vaccination",
      status: "Pending",
    },
    {
      id: "PET002",
      owner: "Rahul Sharma",
      pet: "Bruno",
      reason: "General Checkup",
      status: "In Progress",
    },
    {
      id: "PET003",
      owner: "Amit Singh",
      pet: "Rocky",
      reason: "Treatment",
      status: "Completed",
    },
    {
      id: "PET004",
      owner: "Priya Verma",
      pet: "Lucy",
      reason: "Deworming",
      status: "Pending",
    },
    {
      id: "PET005",
      owner: "Neha Sharma",
      pet: "Bella",
      reason: "Vaccination",
      status: "In Progress",
    },
  ];

  const filteredCustomers = customers.filter(
    (item) =>
      item.owner
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.pet
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Existing Customer Pet
        </h1>

        <p className="text-slate-500 mt-2">
          Search and manage existing customer visits
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Pets
              </p>

              <h2 className="text-4xl font-bold mt-2 text-slate-800">
                24
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
              🐾
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Active Visits
              </p>

              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                12
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
              📋
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Pending
              </p>

              <h2 className="text-4xl font-bold mt-2 text-orange-500">
                8
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
        </div>

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-[32px] shadow-lg border border-slate-200 overflow-hidden">

        {/* Card Header */}

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">

          <h2 className="text-2xl font-bold text-white">
            Existing Customer Records
          </h2>

          <p className="text-orange-100 mt-1">
            Search by Owner Name, Pet Name or Pet ID
          </p>

        </div>

        <div className="p-8">

          {/* Search */}

          <div className="relative mb-8">

            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              🔍
            </div>

            <input
              type="text"
              placeholder="Search Owner Name, Pet Name or Pet ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-14 pr-5 py-4 border border-slate-300 rounded-3xl bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
            />

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b">

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
                    Reason
                  </th>

                  <th className="p-5 text-left font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="p-5 text-left font-semibold text-slate-700">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-5 font-semibold text-slate-700">
                      {item.id}
                    </td>

                    <td className="p-5">
                      {item.owner}
                    </td>

                    <td className="p-5">
                      {item.pet}
                    </td>

                    <td className="p-5">
                      {item.reason}
                    </td>

                    <td className="p-5">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="p-5">

                      <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition shadow-sm">
                        View Details
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-16">

                <div className="text-6xl mb-4">
                  🔍
                </div>

                <h3 className="text-xl font-semibold text-slate-700">
                  No Records Found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try searching with another
                  Owner Name or Pet ID.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}