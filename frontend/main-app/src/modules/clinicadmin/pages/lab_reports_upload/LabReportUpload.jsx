import { useState } from "react";

const initialRegistrations = [
  {
    labId: "LAB-001",
    petName: "Bruno",
    ownerName: "Rahul Sharma",
    phone: "9876543210",
    status: "Pending Upload",
  },
  {
    labId: "LAB-002",
    petName: "Milo",
    ownerName: "Anita Verma",
    phone: "9123456780",
    status: "Pending Upload",
  },
];

const tests = [
  "CBC",
  "LFT",
  "KFT",
  "Blood Sugar",
  "Urine Test",
  "X-Ray",
];

const initialFormData = {
  labOrderId: "",
  petId: "",
  sampleCollectedDateTime: "",
  reportDate: "",
  technicianName: "LAB-TECH-001",
  externalLabName: "",
  criticalFlag: false,
  criticalNotes: "",
  remarks: "",
  uploadTimestamp: new Date().toLocaleString(),
};

const initialRegistrationForm = {
  labId: "",
  petName: "",
  ownerName: "",
  phone: "",
  status: "Pending Upload",
};

export default function LabReportUpload() {
  const [registrations, setRegistrations] =
    useState(initialRegistrations);
  const [searchLabId, setSearchLabId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [
    showRegistrationModal,
    setShowRegistrationModal,
  ] = useState(false);
  const [selectedPet, setSelectedPet] =
    useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [registrationForm, setRegistrationForm] =
    useState(initialRegistrationForm);

  const filteredRegistrations =
    registrations.filter(
      (item) =>
        item.labId
          .toLowerCase()
          .includes(searchLabId.toLowerCase()) &&
        item.phone.includes(searchPhone)
    );

  const handleChange = (e) => {
    const { name, value, checked, type } =
      e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Report Uploaded");
    setShowModal(false);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;

    setRegistrationForm({
      ...registrationForm,
      [name]: value,
    });
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();

    const newRegistration = {
      labId: registrationForm.labId.trim(),
      petName: registrationForm.petName.trim(),
      ownerName: registrationForm.ownerName.trim(),
      phone: registrationForm.phone.trim(),
      status: registrationForm.status,
    };

    setRegistrations([
      ...registrations,
      newRegistration,
    ]);
    setRegistrationForm(initialRegistrationForm);
    setShowRegistrationModal(false);
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Lab Reports
        </h1>

        <p className="text-slate-500 mt-2">
          Manage laboratory reports
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Search Registration
          </h2>

          <button
            type="button"
            onClick={() =>
              setShowRegistrationModal(true)
            }
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            New Registration
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search By Lab ID"
            value={searchLabId}
            onChange={(e) =>
              setSearchLabId(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Search By Phone Number"
            value={searchPhone}
            onChange={(e) =>
              setSearchPhone(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-xl font-bold">
              Recent Lab Registrations
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage all laboratory requests
            </p>

          </div>

          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-semibold">
            {filteredRegistrations.length} Records
          </div>

        </div>

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">
                Lab ID
              </th>

              <th className="p-4 text-left">
                Pet Name
              </th>

              <th className="p-4 text-left">
                Owner
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredRegistrations.map(
              (item, index) => (
                <tr
                  key={`${item.labId}-${index}`}
                  className="border-t"
                >

                  <td className="p-4">
                    {item.labId}
                  </td>

                  <td className="p-4">
                    {item.petName}
                  </td>

                  <td className="p-4">
                    {item.ownerName}
                  </td>

                  <td className="p-4">
                    {item.phone}
                  </td>

                  <td className="p-4">

                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                      {item.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedPet(item);
                          setShowModal(true);
                        }}
                        className="bg-orange-500 text-white px-3 py-2 rounded-xl"
                      >
                        Upload
                      </button>

                      <button
                        onClick={() => {
                          setRegistrationForm(item);
                          setShowRegistrationModal(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        className="bg-slate-900 text-white px-3 py-2 rounded-xl"
                      >
                        View
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-8 relative">

            <button
              onClick={() =>
                setShowRegistrationModal(false)
              }
              className="absolute top-5 right-5 text-2xl font-bold text-slate-500 hover:text-red-500"
            >
              x
            </button>

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                New Registration
              </h2>

              <p className="text-slate-500 mt-2">
                Add a new lab registration
              </p>

            </div>

            <form
              onSubmit={handleRegistrationSubmit}
              className="space-y-6"
            >

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <label className="block mb-2 font-medium">
                    Lab ID
                  </label>

                  <input
                    type="text"
                    name="labId"
                    value={registrationForm.labId}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Pet Name
                  </label>

                  <input
                    type="text"
                    name="petName"
                    value={registrationForm.petName}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Owner Name
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={registrationForm.ownerName}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Phone

                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={registrationForm.phone}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={registrationForm.status}
                  onChange={handleRegistrationChange}
                  className="w-full border p-3 rounded-xl"
                >
                  <option>Pending Upload</option>
                  <option>Report Uploaded</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowRegistrationModal(false)
                  }
                  className="px-6 py-3 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Save Registration
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[1000px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-8 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-2xl font-bold text-slate-500 hover:text-red-500"
            >
              x
            </button>

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Upload Lab Report
              </h2>

              <p className="text-slate-500 mt-2">
                Submit laboratory reports and test results
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Lab Order + Pet */}

              <div className="grid grid-cols-2 gap-5">

                <div>
                  <label className="block mb-2 font-medium">
                    Lab Order ID
                  </label>

                  <input
                    type="text"
                    name="labOrderId"
                    value={
                      selectedPet?.labId ||
                      formData.labOrderId
                    }
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Pet ID / Patient
                  </label>

                  <input
                    type="text"
                    name="petId"
                    value={
                      selectedPet?.petName ||
                      formData.petId
                    }
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>

              </div>

              {/* Tests */}

              <div>

                <h3 className="font-semibold mb-4">
                  Tests Completed
                </h3>

                <div className="grid grid-cols-3 gap-4">

                  {tests.map((test) => (
                    <label
                      key={test}
                      className="flex items-center gap-2"
                    >
                      <input type="checkbox" />
                      {test}
                    </label>
                  ))}

                </div>

              </div>

              {/* Upload */}

              <div>

                <label className="block mb-2 font-medium">
                  Report File (PDF / Image)
                </label>

                <input
                  type="file"
                  className="w-full border p-3 rounded-xl"
                />

              </div>

              {/* Dates */}

              <div className="grid grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 font-medium">
                    Sample Collected Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="sampleCollectedDateTime"
                    value={formData.sampleCollectedDateTime}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Report Date
                  </label>

                  <input
                    type="date"
                    name="reportDate"
                    value={formData.reportDate}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

              </div>

              {/* Technician */}

              <div className="grid grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 font-medium">
                    Lab Technician ID
                  </label>

                  <input
                    type="text"
                    value={formData.technicianName}
                    readOnly
                    className="w-full border p-3 rounded-xl bg-slate-100"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    External Lab Name
                  </label>

                  <input
                    type="text"
                    name="externalLabName"
                    value={formData.externalLabName}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />

                </div>

              </div>

              {/* Critical */}

              <div>

                <label className="flex items-center gap-3 font-medium">

                  <input
                    type="checkbox"
                    name="criticalFlag"
                    checked={formData.criticalFlag}
                    onChange={handleChange}
                  />

                  Critical Values Flag

                </label>

              </div>

              {formData.criticalFlag && (

                <textarea
                  rows="3"
                  name="criticalNotes"
                  value={formData.criticalNotes}
                  onChange={handleChange}
                  placeholder="Critical Notes"
                  className="w-full border p-3 rounded-xl"
                />

              )}

              {/* Remarks */}

              <div>

                <label className="block mb-2 font-medium">
                  Lab Remarks / Interpretation
                </label>

                <textarea
                  rows="5"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks..."
                  className="w-full border p-3 rounded-xl"
                />

              </div>

              {/* Timestamp */}

              <div>

                <label className="block mb-2 font-medium">
                  Upload Timestamp
                </label>

                <input
                  type="text"
                  value={formData.uploadTimestamp}
                  readOnly
                  className="w-full border p-3 rounded-xl bg-slate-100"
                />

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                >
                  Upload Report
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
