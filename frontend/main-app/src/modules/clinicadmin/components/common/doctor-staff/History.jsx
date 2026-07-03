/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [search, setSearch] = useState("");

  const [historyData, setHistoryData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({

    totalRecords: 0,

    vaccinations: 0,

    treatments: 0

  });
  const getHistory = async () => {


    
    try {

      const res = await axios.get(
        "http://localhost:5000/api/v1/doctorModule/history"
      );

      setHistoryData(res.data.data);

      setStats({

        totalRecords: res.data.total,

        vaccinations: res.data.vaccinations,

        treatments: res.data.treatments

      });

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };
  useEffect(() => {

    getHistory();

  }, []);

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        <h2 className="text-xl font-semibold">

          Loading...

        </h2>

      </div>

    );

  }

  const filteredData = historyData.filter((item) => {

    const owner =
      item.ownerName?.toLowerCase() || "";

    const petName =
      item.petName?.toLowerCase() || "";

    const phone =
      item.phone || "";

    return (

      owner.includes(search.toLowerCase()) ||

      petName.includes(search.toLowerCase()) ||

      phone.includes(search)

    );

  });

  return (
    <div className="space-y-5 sm:space-y-8 pt-16 md:pt-8">

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-slate-500">Total Records</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {stats.totalRecords}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-slate-500">Vaccinations</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {stats.vaccinations}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-slate-500">Treatments</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {stats.treatments}
          </h2>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search Pet Name, Owner Name or Phone Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-orange-500 sm:text-base"
          />

        </div>

      </div>

      {/* Mobile Heading */}
      <div className="md:hidden">
        <h2 className="text-xl font-bold text-slate-800">
          Visit Records
        </h2>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">

        {filteredData.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">

              <div>
                <h3 className="text-lg font-bold">
                  {item.petName}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.petId}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {item.status}
              </span>

            </div>

            <div className="space-y-2 text-sm">

              <p>
                <span className="font-semibold">
                  Owner:
                </span>{" "}
                {item.ownerName}
              </p>

              <p>
                <span className="font-semibold">
                  Phone:
                </span>{" "}
                {item.phone}
              </p>

              <p>
                <span className="font-semibold">
                  Visit:
                </span>{" "}
                {item.diagnosis?.confirmedDiagnosis || "-"}
              </p>

              <p>
                <span className="font-semibold">
                  Date:
                </span>{" "}
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>

            </div>

            <button className="mt-4 w-full rounded-xl bg-orange-500 py-3 text-white">
              View Record
            </button>

          </div>
        ))}

      </div>

      {/* Desktop Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:rounded-3xl lg:p-8">

        <div className="hidden md:flex mb-6 flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Visit Records
            </h2>

            <p className="mt-1 text-slate-500">
              Historical consultation records
            </p>
          </div>

        </div>

        <div className="hidden md:block overflow-x-auto">

          <table className="min-w-[920px] w-full text-sm sm:text-base">

            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 pr-4 text-left">Pet ID</th>
                <th className="py-4 pr-4 text-left">Pet Name</th>
                <th className="py-4 pr-4 text-left">Owner</th>
                <th className="py-4 pr-4 text-left">Phone</th>
                <th className="py-4 pr-4 text-left">Visit Date</th>
                <th className="py-4 pr-4 text-left">Visit Type</th>
                <th className="py-4 pr-4 text-left">Status</th>
                <th className="py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>

              {filteredData.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="py-10 text-center text-slate-500"
                  >

                    No History Found

                  </td>

                </tr>

              ) : (

                filteredData.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >

                    <td className="py-5 pr-4 font-medium">
                      {item.petId}
                    </td>

                    <td className="pr-4">
                      {item.petName}
                    </td>

                    <td className="pr-4">
                      {item.ownerName}
                    </td>

                    <td className="pr-4">
                      {item.phone || "-"}
                    </td>

                    <td className="pr-4">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="pr-4">
                      {item.diagnosis?.confirmedDiagnosis || "-"}
                    </td>

                    <td className="pr-4">
                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                        View Record
                      </button>
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