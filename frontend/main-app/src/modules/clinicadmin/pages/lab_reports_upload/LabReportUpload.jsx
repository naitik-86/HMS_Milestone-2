import { useState } from "react";

const initialRegistrations = [
  {
    labId: "LAB-001",
    petName: "Bruno",
    petId: "PET-0001",
    ownerName: "Rahul Sharma",
    phone: "9876543210",
    status: "Pending Upload",
  },
  {
    labId: "LAB-002",
    petName: "Milo",
    petId: "PET-0002",
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
  petId: "",
  petName: "",
  ownerName: "",
  phone: "",
  doctorName: "",
  testRequested: "",
  sampleType: "",
  priority: "Normal",
  appointmentDate: "",
  status: "Pending Upload",
};


export default function LabReportUpload() {
  const [registrations, setRegistrations] = useState(initialRegistrations);

  const [showModal, setShowModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal,] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [registrationForm, setRegistrationForm] = useState(initialRegistrationForm);
  const [search, setSearch] = useState("");


  const filteredRegistrations =
    registrations.filter(
      (item) =>
        item.labId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.phone.includes(search)
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


    const petId = `PET-${Date.now()}`;

    const newRegistration = {
      ...registrationForm,
      petId,

    };

    setRegistrations([
      ...registrations,
      newRegistration,
    ]);

    setRegistrationForm(initialRegistrationForm);
    setShowRegistrationModal(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-slate-100 min-h-screen overflow-x-hidden">

      <div className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Laboratory Panel
            </h1>

            <p className="mt-2 text-blue-100">
              Manage registrations, reports and critical cases
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
            <p className="text-sm text-blue-100">
              Active Module
            </p>

            <h3 className="font-bold">
              Lab Upload System
            </h3>
          </div>

        </div>
      </div>

<div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  {/* Total Reports */}
  <div className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all">

    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Total Reports
        </p>

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
          1,245
        </h2>

        <p className="mt-3 text-green-500 text-sm font-medium">
          ↑ 12% this month
        </p>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
        🧪
      </div>

    </div>

  </div>

  {/* Pending Uploads */}
  <div className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all">

    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-400"></div>

    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Pending Uploads
        </p>

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500">
          32
        </h2>

        <p className="mt-3 text-orange-500 text-sm font-medium">
          Need attention
        </p>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-3xl">
        ⏳
      </div>

    </div>

  </div>

  {/* Critical Cases */}
  <div className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all">

    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-pink-500"></div>

    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Critical Cases
        </p>

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-red-500">
          08
        </h2>

        <p className="mt-3 text-red-500 text-sm font-medium">
          Urgent review
        </p>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-3xl">
        🚨
      </div>

    </div>

  </div>

  {/* Today's Reports */}
  <div className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-xl border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all">

    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-medium text-slate-500">
          Today's Reports
        </p>

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500">
          54
        </h2>

        <p className="mt-3 text-blue-500 text-sm font-medium">
          Successfully uploaded
        </p>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
        📄
      </div>

    </div>

  </div>

</div>

      <div className="mb-8 overflow-hidden rounded-[32px] bg-white shadow-xl border border-slate-100">

        {/* Top Gradient Strip */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-600"></div>

        <div className="p-8">

          {/* Heading */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Search Registration
              </h2>

              <p className="mt-2 text-slate-500">
                Search registrations using Lab Order ID or Owner Phone Number
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-2">
              <span className="text-orange-500 text-xl">🧪</span>
              <span className="font-medium text-orange-700">
                Lab Management
              </span>
            </div>

          </div>

          {/* Search + Button */}
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search Box */}
            <div className="relative flex-1">

              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                🔍
              </div>

              <input
                type="text"
                placeholder="Search by Lab ID or Phone Number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      py-4
                      pl-14
                      pr-5
                      text-base
                      shadow-sm
                      transition-all
                      focus:border-orange-500
                      focus:bg-white
                      focus:outline-none
                      focus:ring-4
                      focus:ring-orange-100
                    "
              />

            </div>

            {/* Button */}
      

          </div>

          {/* Bottom Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total Registrations
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                1245
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-sm text-orange-600">
                Pending Uploads
              </p>

              <h3 className="mt-1 text-2xl font-bold text-orange-600">
                32
              </h3>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Critical Cases
              </p>

              <h3 className="mt-1 text-2xl font-bold text-red-600">
                8
              </h3>
            </div>

          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl border border-slate-100">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 px-4 md:px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Lab Registrations
            </h2>

            <p className="mt-1 text-slate-500">
              Manage all laboratory requests
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 px-5 py-3">
            <span className="font-semibold text-orange-600">
              {filteredRegistrations.length} Records
            </span>
          </div>

        </div>

<div className="hidden lg:block overflow-x-auto">
  <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="border-b border-slate-100 transition hover:bg-orange-50/40">
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Lab ID
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Pet Name
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Owner
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Phone
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredRegistrations.map(
              (item, index) => (
                <tr
                  key={`${item.labId}-${index}`}
                  className="
                      border-b
                      border-slate-100
                      hover:bg-orange-50/40
                      transition-all
                    "
                >

                  <td className="p-4">
                    <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                      {item.labId}
                    </span>
                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                        🐾
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.petName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Pet Patient
                        </p>
                      </div>

                    </div>

                  </td>

                  <td className="p-4">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.ownerName}
                      </p>

                      <p className="text-xs text-slate-500">
                        Pet Owner
                      </p>
                    </div>

                  </td>

                  <td className="p-4">
                    {item.phone}
                  </td>

                  <td className="px-6 py-4">

               <span
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      whitespace-nowrap
                      rounded-full
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      shadow-sm
                      ${
                        item.status === "Pending Upload"
                          ? "bg-orange-100 text-orange-600"
                          : item.status === "Report Uploaded"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {item.status === "Pending Upload" && "⏳"}
                    {item.status === "Report Uploaded" && "✅"}
                    {item.status === "Critical" && "🚨"}

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
                        className="
                              rounded-xl
                              bg-orange-500
                              px-4
                              py-2
                              font-medium
                              text-white
                              shadow-md
                              hover:bg-orange-600
                              transition
                              "
                      >
                        Upload
                      </button>

                      <button
                        onClick={() => {
                          setRegistrationForm({
                            ...initialRegistrationForm,
                            ...item,
                          });

                          setShowRegistrationModal(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        className="
                                rounded-xl
                                bg-slate-900
                                px-4
                                py-2
                                font-medium
                                text-white
                                shadow-md
                                hover:bg-black
                                transition
                                "
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
      </div>
      <div className="lg:hidden p-4 space-y-4">
  {filteredRegistrations.map((item, index) => (
    <div
      key={index}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold">
          {item.labId}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "Pending Upload"
              ? "bg-orange-100 text-orange-600"
              : item.status === "Report Uploaded"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p>
          <strong>Pet:</strong> {item.petName}
        </p>

        <p>
          <strong>Owner:</strong> {item.ownerName}
        </p>

        <p>
          <strong>Phone:</strong> {item.phone}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedPet(item);
            setShowModal(true);
          }}
          className="rounded-xl bg-orange-500 px-4 py-2 text-white"
        >
          Upload
        </button>

        <button
          onClick={() => {
            setRegistrationForm({
              ...initialRegistrationForm,
              ...item,
            });
            setShowRegistrationModal(true);
          }}
          className="rounded-xl bg-blue-500 px-4 py-2 text-white"
        >
          Edit
        </button>

        <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">
          View
        </button>
      </div>
    </div>
  ))}
</div>

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[95%] max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-4 md:p-8 relative">

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

              {/* Section Header */}
              <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                <h3 className="text-xl font-bold">
                  Registration Information
                </h3>

                <p className="text-blue-100 mt-1">
                  Create a new laboratory request
                </p>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Lab Order ID
                  </label>

                  <input
                    type="text"
                    name="labId"
                    value={registrationForm.labId}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Pet ID
                  </label>

                  <input
                    type="text"
                    name="petId"
                    value={registrationForm.petId}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Pet Name
                  </label>

                  <input
                    type="text"
                    name="petName"
                    value={registrationForm.petName}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Owner Name
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={registrationForm.ownerName}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={registrationForm.phone}
                    onChange={handleRegistrationChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="doctorName"
                    value={registrationForm.doctorName}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Test Requested
                  </label>

                  <select
                    name="testRequested"
                    value={registrationForm.testRequested}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <option value="">Select Test</option>
                    <option>CBC</option>
                    <option>LFT</option>
                    <option>KFT</option>
                    <option>Blood Sugar</option>
                    <option>Urine Test</option>
                    <option>X-Ray</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Sample Type
                  </label>

                  <select
                    name="sampleType"
                    value={registrationForm.sampleType}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <option value="">Select Sample</option>
                    <option>Blood</option>
                    <option>Urine</option>
                    <option>Saliva</option>
                    <option>Serum</option>
                  </select>
                </div>

              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={registrationForm.priority}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    name="appointmentDate"
                    value={registrationForm.appointmentDate}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={registrationForm.status}
                    onChange={handleRegistrationChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <option>Pending Upload</option>
                    <option>Report Uploaded</option>
                    <option>Critical</option>
                  </select>
                </div>

              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">

                <button
                  type="button"
                  onClick={() =>
                    setShowRegistrationModal(false)
                  }
                  className="rounded-2xl border px-6 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-700
                      px-8
                      py-3
                      font-semibold
                      text-white
                      shadow-lg
                    "
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

          <div className="bg-white w-[95%] max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-4 md:p-8 relative">

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                   value={selectedPet?.petId || ""}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

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
