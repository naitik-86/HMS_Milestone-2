export default function PetRegistrationForm() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          Pet Registration
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          Register new pet details and identification information
        </p>

        <div className="w-20 h-1 bg-orange-500 rounded-full mt-4"></div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pet Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Pet Name
            </label>

            <input
              type="text"
              placeholder="Enter Pet Name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Species
            </label>

            <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Select Species</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Rabbit</option>
              <option>Bird</option>
              <option>Other</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Breed
            </label>

            <input
              type="text"
              placeholder="Enter Breed"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Gender
            </label>

            <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Date Of Birth
            </label>

            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Age
            </label>

            <input
              type="number"
              placeholder="Enter Age"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Color
            </label>

            <input
              type="text"
              placeholder="Enter Pet Color"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* RFID */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              RFID / Microchip Tag
            </label>

            <input
              type="text"
              placeholder="Enter RFID Number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

        </div>

        {/* Identification Marks */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Identification Marks
          </label>

          <textarea
            rows="3"
            placeholder="Special marks, scars, spots or identification details"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Pet Photo */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Pet Photo
          </label>

          <input
            type="file"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Sterilized */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Sterilized
          </label>

          <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Select Option</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Unique Pet ID */}
        <div className="mt-6">
          <label className="block mb-2 font-medium text-gray-700">
            Unique Pet ID
          </label>

          <input
            type="text"
            value="PET-10001"
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 border-t pt-6">
          <button
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-8
              py-3
              rounded-xl
              font-semibold
              shadow-md
              hover:shadow-lg
              transition-all
            "
          >
            Save & Continue →
          </button>
        </div>

      </div>
    </div>
  );
}