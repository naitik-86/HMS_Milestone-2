
import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { getCompletedPets } from "../../../api/doctorModuleApi"

export default function CompletedPets() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");
  const [completedCases, setCompletedCases] = useState([]);
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    fetchCompletedPets();
  }, []);

  const fetchCompletedPets = async () => {
    try {
      const response = await getCompletedPets();

      console.log(response.data);

      setCompletedCases(response.data.pets || response);
    } catch (error) {
      console.error("Error fetching completed pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = completedCases

  if (loading) {

    return (

      <div className="flex justify-center items-center h-96">

        <h2 className="text-xl font-semibold">

          Loading...

        </h2>

      </div>

    );

  }
  return (
    <div className="space-y-5 sm:space-y-8 pt-16 md:pt-8">

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by Owner Name or Phone Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-700 transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>



      {/* Mobile Heading */}
      <div className="md:hidden">
        <h2 className="text-xl font-bold text-slate-800">
          Completed Cases
        </h2>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">

        {filteredCases.length === 0 ? (

          <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">

            No Completed Cases Found

          </div>

        ) : (

          filteredCases.map((item) => (

            <div
              key={item._id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >

              <div className="mb-3 flex items-start justify-between">

                <div>

                  <h3 className="text-lg font-bold">
                    {item.petId?.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item?.ownerId?.ownerName}
                  </p>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {item.workflow?.doctorCompleted}
                </span>

              </div>

              <div className="space-y-2 text-sm">

                <p>
                  <span className="font-semibold">
                    Phone:
                  </span>{" "}
                  {item?.ownerId?.mobileNumber || "-"}
                </p>

                <p>
                  <span className="font-semibold">
                    Date:
                  </span>{" "}
                  {new Date(item.updatedAt).toLocaleDateString()}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

      {/* Desktop Table */}
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:rounded-[30px] lg:p-8">

        <h2 className="hidden md:block mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
          Completed Cases List
        </h2>

        <div className="hidden md:block overflow-x-auto">

          <table className="min-w-[720px] w-full">

            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-4 pr-4 text-left font-semibold">
                  Pet Name
                </th>

                <th className="py-4 pr-4 text-left font-semibold">
                  Owner Name
                </th>

                <th className="py-4 pr-4 text-left font-semibold">
                  Phone Number
                </th>

                <th className="py-4 pr-4 text-left font-semibold">
                  Status
                </th>

                <th className="py-4 text-left font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredCases.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-500"
                  >

                    No Completed Cases Found

                  </td>

                </tr>

              ) : (

                filteredCases.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b text-sm text-slate-700 transition hover:bg-slate-50"
                  >

                    <td className="py-4 pr-4 font-medium text-slate-900">
                      {item.petId.name}
                    </td>

                    <td className="pr-4">
                      {item?.ownerId?.ownerName}
                    </td>

                    <td className="pr-4">
                      {item.ownerId?.mobileNumber || "-"}
                    </td>

                    <td className="pr-4">

                      <span className="rounded-full bg-green-100 px-4 py-2 ml-0 text-sm font-medium text-green-700">

                        {item?.workflow?.doctorCompleted ? "Completed" : "Pending"}

                      </span>

                    </td>

                    <td>

                      {new Date(item.updatedAt).toLocaleDateString()}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}