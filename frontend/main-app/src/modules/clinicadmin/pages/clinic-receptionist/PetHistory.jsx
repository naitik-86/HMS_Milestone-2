import { useState } from "react";

export default function PetHistory() {
  const [search, setSearch] = useState("");

  const visits = [
    {
      date: "10 Jun 2026",
      petName: "Tommy",
      owner: "Karan Kumar",
      reason: "Vaccination",
      doctor: "Dr. Sharma",
      status: "Completed",
      bill: "₹500",
    },
    {
      date: "25 May 2026",
      petName: "Bruno",
      owner: "Rahul Sharma",
      reason: "Checkup",
      doctor: "Dr. Mehta",
      status: "Completed",
      bill: "₹300",
    },
    {
      date: "18 Apr 2026",
      petName: "Rocky",
      owner: "Amit Singh",
      reason: "Treatment",
      doctor: "Dr. Singh",
      status: "In Progress",
      bill: "₹1200",
    },
  ];

  const filteredVisits = visits.filter(
    (item) =>
      item.petName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.owner
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === "Completed")
      return "bg-green-100 text-green-700";

    if (status === "In Progress")
      return "bg-blue-100 text-blue-700";

    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Pet History
        </h1>

        <p className="text-slate-500 mt-2">
          View complete visit history and medical records
        </p>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-[28px] p-6 shadow-sm">
          <p className="text-slate-500">
            Total Visits
          </p>

          <h2 className="text-4xl font-bold mt-2">
            12
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm">
          <p className="text-slate-500">
            Vaccinations
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            5
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm">
          <p className="text-slate-500">
            Treatments
          </p>

          <h2 className="text-4xl font-bold text-orange-500 mt-2">
            4
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm">
          <p className="text-slate-500">
            Checkups
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            3
          </h2>
        </div>

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-[32px] shadow-lg overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">

          <h2 className="text-2xl font-bold text-white">
            Visit History Records
          </h2>

          <p className="text-orange-100 mt-1">
            Search by Pet Name or Owner Name
          </p>

        </div>

        <div className="p-8">

          {/* Search */}

          <div className="relative mb-8">

            <input
              type="text"
              placeholder="Search Pet Name or Owner..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-14 pr-5 py-4 border border-slate-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500"
            />

            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              🔍
            </div>

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b">

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Pet Name
                  </th>

                  <th className="p-4 text-left">
                    Owner
                  </th>

                  <th className="p-4 text-left">
                    Reason
                  </th>

                  <th className="p-4 text-left">
                    Doctor
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Bill
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredVisits.map((visit, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">
                      {visit.date}
                    </td>

                    <td className="p-4 font-medium">
                      {visit.petName}
                    </td>

                    <td className="p-4">
                      {visit.owner}
                    </td>

                    <td className="p-4">
                      {visit.reason}
                    </td>

                    <td className="p-4">
                      {visit.doctor}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {visit.status}
                      </span>

                    </td>

                    <td className="p-4 font-semibold">
                      {visit.bill}
                    </td>

                    <td className="p-4">

                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition">
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* Timeline */}

      <div className="bg-white rounded-[32px] shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-8">
          Recent Activity
        </h2>

        <div className="space-y-6">

          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-orange-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                Vaccination Completed
              </h3>

              <p className="text-slate-500">
                Tommy • 10 Jun 2026 • Dr. Sharma
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                General Checkup
              </h3>

              <p className="text-slate-500">
                Bruno • 25 May 2026 • Dr. Mehta
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-2"></div>

            <div>
              <h3 className="font-semibold">
                Treatment Follow Up
              </h3>

              <p className="text-slate-500">
                Rocky • 18 Apr 2026 • Dr. Singh
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}