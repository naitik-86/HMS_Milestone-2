import { FaDownload } from "react-icons/fa";

const PetOwnerHistoryTable = () => {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="border-b p-5">
        <h2 className="text-xl font-bold text-slate-800">
          Medical History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Date
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Doctor
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Diagnosis
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Prescription
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t hover:bg-slate-50">
              <td className="px-5 py-4">
                10-06-2025
              </td>

              <td className="px-5 py-4">
                Dr. Sharma
              </td>

              <td className="px-5 py-4">
                Fever
              </td>

              <td className="px-5 py-4">
                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  <FaDownload />
                  Download PDF
                </button>
              </td>
            </tr>

            <tr className="border-t hover:bg-slate-50">
              <td className="px-5 py-4">
                22-05-2025
              </td>

              <td className="px-5 py-4">
                Dr. Kumar
              </td>

              <td className="px-5 py-4">
                Vaccination
              </td>

              <td className="px-5 py-4">
                <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  <FaDownload />
                  Download PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetOwnerHistoryTable;