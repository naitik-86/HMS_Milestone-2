import { useState } from "react";

export default function CompletedPets() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");

  const completedCases = Array.from({ length: 50 }, (_, i) => ({
    petId: `PET${String(i + 1).padStart(3, "0")}`,
    owner: [
      "Rahul Sharma",
      "Amit Verma",
      "Rohan Singh",
      "Priya Gupta",
      "Neha Sharma",
      "Vikas Kumar",
      "Anjali Singh",
      "Karan Mehta",
      "Pooja Yadav",
      "Deepak Verma",
    ][i % 10],
    phone: `98${String(76543210 + i).padStart(8, "0")}`,
    status: "Completed",
    date:
      i < 15
        ? "Today"
        : i < 30
          ? "Yesterday"
          : "Past",
  }));

  const filteredCases = completedCases.filter(
    (item) =>
      (item.owner
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        item.phone.includes(search)) &&
      item.date.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="space-y-8">


      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by Owner Name or Phone Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        w-full
        h-12
        pl-12
        pr-4
        border
        border-slate-200
        rounded-xl
        bg-slate-50
        text-slate-700
        placeholder:text-slate-400
        focus:outline-none
        focus:border-orange-500
        focus:bg-white
        transition-all
      "
          />

        </div>

      </div>

      {/* Filters */}
      <div className="flex gap-4">

        <button
          onClick={() => setFilter("today")}
          className={`px-6 py-3 rounded-2xl font-medium ${filter === "today"
              ? "bg-orange-500 text-white"
              : "bg-white"
            }`}
        >
          Today
        </button>

        <button
          onClick={() => setFilter("yesterday")}
          className={`px-6 py-3 rounded-2xl font-medium ${filter === "yesterday"
              ? "bg-orange-500 text-white"
              : "bg-white"
            }`}
        >
          Yesterday
        </button>

        <button
          onClick={() => setFilter("past")}
          className={`px-6 py-3 rounded-2xl font-medium ${filter === "past"
              ? "bg-orange-500 text-white"
              : "bg-white"
            }`}
        >
          Past Cases
        </button>

      </div>

      {/* Table */}
      <div className="bg-white rounded-[30px] p-8 shadow-sm">

        <h2 className="text-2xl font-bold mb-6">
          Completed Cases List
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="text-left py-4">
                  Pet ID
                </th>

                <th className="text-left py-4">
                  Owner Name
                </th>

                <th className="text-left py-4">
                  Phone Number
                </th>

                <th className="text-left py-4">
                  Status
                </th>

                <th className="text-left py-4">
                  Date
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredCases.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="py-4">
                    {item.petId}
                  </td>

                  <td>
                    {item.owner}
                  </td>

                  <td>
                    {item.phone}
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm">
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.date}
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