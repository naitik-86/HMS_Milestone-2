export default function ReasonForVisitForm() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          Reason For Visit
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          Appointment details and doctor assignment
        </p>

        <div className="w-20 h-1 bg-orange-500 rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

        {/* Primary Reason */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Primary Reason
          </label>

          <select className="w-full border border-gray-300 rounded-xl px-4 py-3">
            <option>Select Reason</option>
            <option>Treatment</option>
            <option>Vaccination</option>
            <option>Checkup</option>
            <option>Certificate</option>
          </select>
        </div>

        {/* Complaint */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Specific Complaint In Brief
          </label>

          <textarea
            rows="4"
            placeholder="Describe the complaint..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Token Number */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Token / Queue Number
          </label>

          <input
            type="text"
            value="TOKEN-101"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Appointment Date */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Appointment Date & Time
          </label>

          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Doctor */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Assigned Doctor
          </label>

          <select className="w-full border border-gray-300 rounded-xl px-4 py-3">
            <option>Select Doctor</option>
            <option>Dr. Sharma</option>
            <option>Dr. Gupta</option>
            <option>Dr. Verma</option>
            <option>Dr. Singh</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t pt-6">
          <button
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-8
              py-3
              rounded-xl
              font-semibold
              shadow-md
            "
          >
            Complete Registration ✓
          </button>
        </div>

      </div>
    </div>
  );
}