import { useState } from "react";
import RegistrationWizard from "../component/RegistrationWizard";

export default function ReceptionDashboard() {
  const [open, setOpen] = useState(false);

  const registrations = [
    {
      token: "T-101",
      owner: "Rahul Sharma",
      pet: "Tommy",
      reason: "Vaccination",
      status: "Waiting",
    },
    {
      token: "T-102",
      owner: "Amit Kumar",
      pet: "Bruno",
      reason: "Checkup",
      status: "Assigned",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Reception Dashboard
          </h1>

          <p className="text-gray-500">
            Veterinary Management System
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + New Registration
        </button>
      </div>

      <div className="p-8">

        {/* Cards */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Today's Visits</p>
            <h2 className="text-4xl font-bold text-orange-500">
              24
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">New Pets</p>
            <h2 className="text-4xl font-bold text-blue-500">
              8
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Appointments</p>
            <h2 className="text-4xl font-bold text-green-500">
              15
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-4xl font-bold text-yellow-500">
              5
            </h2>
          </div>

        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Recent Registrations
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Token</th>
                <th className="text-left py-3">Owner</th>
                <th className="text-left py-3">Pet</th>
                <th className="text-left py-3">Reason</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((item) => (
                <tr
                  key={item.token}
                  className="border-b"
                >
                  <td className="py-4">{item.token}</td>
                  <td>{item.owner}</td>
                  <td>{item.pet}</td>
                  <td>{item.reason}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

      {open && (
        <RegistrationWizard
          onClose={() => setOpen(false)}
        />
      )}

    </div>
  );
}