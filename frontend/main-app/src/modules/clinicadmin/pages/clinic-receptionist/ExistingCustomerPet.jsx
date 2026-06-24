import { useState } from "react";

export default function ExistingCustomerPet() {
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([
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
  ]);

  const [stats, setStats] = useState([
    {
      label: "Total Pets",
      value: "24",
      color: "text-slate-800",
      icon: "TP",
    },
    {
      label: "Active Visits",
      value: "12",
      color: "text-blue-600",
      icon: "AV",
    },
    {
      label: "Pending",
      value: "8",
      color: "text-orange-500",
      icon: "PN",
    },
  ]);

  const filteredCustomers = customers.filter((item) => {
    const value = search.toLowerCase();
    return (
      item.owner.toLowerCase().includes(value) ||
      item.id.toLowerCase().includes(value) ||
      item.pet.toLowerCase().includes(value)
    );
  });

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
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
          Existing Customer Pet
        </h1>
        <p className="text-slate-500 mt-2">
          Search and manage existing customer visits
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((item) => (
          <div key={item.label} className="bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-500 text-sm">{item.label}</p>
                <h2 className={`text-3xl sm:text-4xl font-bold mt-2 ${item.color}`}>
                  {item.value}
                </h2>
              </div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 sm:px-8 py-5 sm:py-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Existing Customer Records
          </h2>
          <p className="text-orange-100 mt-1">
            Search by Owner Name, Pet Name or Pet ID
          </p>
        </div>

        <div className="p-4 sm:p-8">
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              Search
            </div>
            <input
              type="text"
              placeholder="Owner, pet name or pet ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-20 sm:pl-24 pr-4 sm:pr-5 py-3.5 sm:py-4 border border-slate-300 rounded-2xl sm:rounded-3xl bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
            />
          </div>

          <div className="md:hidden space-y-4">
            {filteredCustomers.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Pet ID</p>
                    <h3 className="text-lg font-bold text-slate-800">{item.id}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-500">Owner Name</p>
                    <p className="font-semibold text-slate-800">{item.owner}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Pet Name</p>
                      <p className="font-semibold text-slate-800">{item.pet}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-500">Reason</p>
                      <p className="font-semibold text-slate-800">{item.reason}</p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition shadow-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Pet ID</th>
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Owner Name</th>
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Pet Name</th>
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Reason</th>
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Status</th>
                  <th className="p-4 sm:p-5 text-left font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50 transition">
                    <td className="p-4 sm:p-5 font-semibold text-slate-700">{item.id}</td>
                    <td className="p-4 sm:p-5">{item.owner}</td>
                    <td className="p-4 sm:p-5">{item.pet}</td>
                    <td className="p-4 sm:p-5">{item.reason}</td>
                    <td className="p-4 sm:p-5">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition shadow-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-14 sm:py-16">
              <h3 className="text-xl font-semibold text-slate-700">
                No Records Found
              </h3>
              <p className="text-slate-500 mt-2">
                Try searching with another owner name or pet ID.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
