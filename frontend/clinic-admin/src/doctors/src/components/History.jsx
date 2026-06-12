import { useState } from "react";

export default function History() {
  const [search, setSearch] = useState("");

  const historyData = [
    {
      petId: "PET001",
      petName: "Bruno",
      owner: "Rahul Sharma",
      phone: "9876543210",
      date: "11 Jun 2026",
      visitType: "Checkup",
      status: "Completed",
    },
    {
      petId: "PET002",
      petName: "Tommy",
      owner: "Amit Verma",
      phone: "9876541230",
      date: "10 Jun 2026",
      visitType: "Vaccination",
      status: "Completed",
    },
    {
      petId: "PET003",
      petName: "Max",
      owner: "Rohan Singh",
      phone: "9988776655",
      date: "09 Jun 2026",
      visitType: "Treatment",
      status: "Completed",
    },
  ];

  const filteredData = historyData.filter(
    (item) =>
      item.owner
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.petName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.phone.includes(search)
  );

  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Total Records
          </p>

          <h2 className="text-4xl font-bold mt-2">
            356
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Vaccinations
          </p>

          <h2 className="text-4xl font-bold mt-2">
            118
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Treatments
          </p>

          <h2 className="text-4xl font-bold mt-2">
            238
          </h2>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search Pet Name, Owner Name or Phone Number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-2xl font-bold">
              Visit Records
            </h2>

            <p className="text-slate-500 mt-1">
              Historical consultation records
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="text-left py-4">
                  Pet ID
                </th>

                <th className="text-left py-4">
                  Pet Name
                </th>

                <th className="text-left py-4">
                  Owner
                </th>

                <th className="text-left py-4">
                  Phone
                </th>

                <th className="text-left py-4">
                  Visit Date
                </th>

                <th className="text-left py-4">
                  Visit Type
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

              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >

                  <td className="py-5 font-medium">
                    {item.petId}
                  </td>

                  <td>
                    {item.petName}
                  </td>

                  <td>
                    {item.owner}
                  </td>

                  <td>
                    {item.phone}
                  </td>

                  <td>
                    {item.date}
                  </td>

                  <td>
                    {item.visitType}
                  </td>

                  <td>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                      {item.status}
                    </span>

                  </td>

                  <td>

                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition font-medium">
                      View Record
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}