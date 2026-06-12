export default function History() {
  const historyData = [
    {
      petId: "PET001",
      petName: "Bruno",
      owner: "Rahul Sharma",
      date: "11 Jun 2026",
      visitType: "Checkup",
    },
    {
      petId: "PET002",
      petName: "Tommy",
      owner: "Amit Verma",
      date: "10 Jun 2026",
      visitType: "Vaccination",
    },
    {
      petId: "PET003",
      petName: "Max",
      owner: "Rohan Singh",
      date: "09 Jun 2026",
      visitType: "Treatment",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-md mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Pet History
        </h1>

        <p className="text-slate-500 mt-2">
          View all previous pet visit records
        </p>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl p-8 shadow-md">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Visit Records
          </h2>

          <input
            type="text"
            placeholder="Search Pet..."
            className="border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Pet ID</th>
                <th className="text-left py-4">Pet Name</th>
                <th className="text-left py-4">Owner</th>
                <th className="text-left py-4">Visit Date</th>
                <th className="text-left py-4">Visit Type</th>
                <th className="text-left py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {historyData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-4">{item.petId}</td>
                  <td>{item.petName}</td>
                  <td>{item.owner}</td>
                  <td>{item.date}</td>
                  <td>{item.visitType}</td>

                  <td>
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
  );
}