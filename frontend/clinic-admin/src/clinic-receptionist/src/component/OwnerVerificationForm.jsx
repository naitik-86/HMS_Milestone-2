export default function OwnerVerificationForm() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Owner Verification
        </h2>

        <p className="text-gray-500 mt-2">
          Verify owner details before pet registration
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Mobile */}
          <div>
            <label className="block mb-2 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block mb-2 font-medium">
              OTP Verification
            </label>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* Visit Type */}
          <div>
            <label className="block mb-2 font-medium">
              Visit Type
            </label>

            <select className="w-full border rounded-xl p-3">
              <option>New</option>
              <option>Follow Up</option>
            </select>
          </div>

          {/* Owner Name */}
          <div>
            <label className="block mb-2 font-medium">
              Owner Name
            </label>

            <input
              type="text"
              placeholder="Owner Name"
              className="w-full border rounded-xl p-3"
            />
          </div>

          {/* Owner ID */}
          <div>
            <label className="block mb-2 font-medium">
              Owner ID Type
            </label>

            <select className="w-full border rounded-xl p-3">
              <option>Aadhar Card</option>
              <option>PAN Card</option>
              <option>Other Govt ID</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">
            Full Address
          </label>

          <textarea
            rows="3"
            placeholder="Enter Address"
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* State City District */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div>
            <label className="block mb-2 font-medium">
              State
            </label>

            <select className="w-full border rounded-xl p-3">
              <option>Select State</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              City
            </label>

            <select className="w-full border rounded-xl p-3">
              <option>Select City</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              District
            </label>

            <select className="w-full border rounded-xl p-3">
              <option>Select District</option>
            </select>
          </div>

        </div>

        {/* Pincode */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">
            Pincode
          </label>

          <input
            type="text"
            placeholder="Enter Pincode"
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8">

          <button
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-8
              py-3
              rounded-xl
              font-semibold
            "
          >
            Save & Continue →
          </button>

        </div>

      </div>
    </div>
  );
}