import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/lab";

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

export default function LabReportUpload() {

  // ===================== STATES =====================

  const [registrations, setRegistrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState("");
  const [viewReport, setViewReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [reportFile, setReportFile] = useState(null);

  // ===================== GET REPORTS =====================

  const getReports = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/report`);

      if (res.data.success) {
        setRegistrations(res.data.data || []);
      } else {
        setRegistrations([]);
      }

    } catch (error) {
      console.error("Get Reports Error:", error);
      setRegistrations([]);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  // ===================== SEARCH =====================

  const filteredRegistrations = registrations.filter((item) => {

    return (
      item.labOrderId
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.ownerPhone
        ?.includes(search)
    );

  });

  // ===================== HANDLE CHANGE =====================

  const handleChange = (e) => {

    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  };

  // ===================== UPLOAD REPORT =====================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const body = new FormData();

      body.append(
        "testsCompleted",
        JSON.stringify(selectedTests)
      );

      body.append(
        "sampleCollectedAt",
        formData.sampleCollectedDateTime
      );

      body.append(
        "reportDate",
        formData.reportDate
      );

      body.append(
        "externalLabName",
        formData.externalLabName
      );

      body.append(
        "criticalValuesFlag",
        formData.criticalFlag
      );

      body.append(
        "criticalNotes",
        formData.criticalNotes
      );

      body.append(
        "remarks",
        formData.remarks
      );

      if (reportFile) {
        body.append("reportFile", reportFile);
      }

      await axios.put(
        `${BASE_URL}/report/upload/${selectedPet._id}`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Report Uploaded Successfully");

      setShowModal(false);

      setFormData(initialFormData);

      setSelectedTests([]);

      setReportFile(null);

      setSelectedPet(null);

      getReports();

    } catch (error) {

      console.error("Upload Report Error:", error);

    }

  };

  // ===================== VIEW REPORT =====================

  const getSingleReport = async (id) => {

    try {

      const res = await axios.get(
        `${BASE_URL}/report/${id}`
      );

      if (res.data.success) {
        setViewReport(res.data.data);
        setShowViewModal(true);
      }

    } catch (error) {

      console.error("View Report Error:", error);

    }

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
                {registrations.length}
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-sm text-orange-600">
                Pending Uploads
              </p>

              <h3 className="mt-1 text-2xl font-bold text-orange-600">
                {
                  registrations.filter(
                    (item) => item.status === "Pending"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Critical Cases
              </p>

              <h3 className="mt-1 text-2xl font-bold text-red-600">
                {
                  registrations.filter(
                    (item) => item.criticalValuesFlag === true
                  ).length
                }
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
                    key={`${item.labOrderId}-${index}`}
                    className="
                      border-b
                      border-slate-100
                      hover:bg-orange-50/40
                      transition-all
                    "
                  >

                    <td className="p-4">
                      <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                        {item.labOrderId}
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
                      {item.ownerPhone}
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
                      ${item.status === "Pending"
                            ? "bg-orange-100 text-orange-600"
                            : item.status === "Completed"
                              ? "bg-green-100 text-green-600"
                              : item.status === "Critical"
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-600"
                          }
                    `}
                      >
                        {item.status === "Pending" && "⏳"}
                        {item.status === "Completed" && "✅"}
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
                            getSingleReport(item._id)
                          }}
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
                {item.labOrderId}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Pending"
                  ? "bg-orange-100 text-orange-600"
                  : item.status === "Completed"
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
                <strong>Phone:</strong> {item.ownerPhone}
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
                onClick={() => getSingleReport(item._id)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-white"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[95%] max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-4 md:p-8 relative">

            <button
  onClick={() => {
    setShowModal(false);
    setFormData(initialFormData);
    setSelectedTests([]);
    setReportFile(null);
    setSelectedPet(null);
  }}
  className="absolute top-5 right-5 text-2xl font-bold text-slate-500 hover:text-red-500"
>
  ✕
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
  value={selectedPet?.labOrderId || ""}
  readOnly
  className="w-full border p-3 rounded-xl bg-slate-100"
/>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Pet ID / Patient
                  </label>

                 <input
  type="text"
  value={selectedPet?.petName || ""}
  readOnly
  className="w-full border p-3 rounded-xl bg-slate-100"
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
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test)}
                        onChange={(e) => {

                          if (e.target.checked) {

                            setSelectedTests([
                              ...selectedTests,
                              test
                            ]);

                          } else {

                            setSelectedTests(
                              selectedTests.filter(
                                (t) => t !== test
                              )
                            );

                          }

                        }}
                      />
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
                  onChange={(e) => {
                    setReportFile(
                      e.target.files[0]
                    );
                  }}
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
                 onClick={() => {
  setShowModal(false);
  setFormData(initialFormData);
  setSelectedTests([]);
  setReportFile(null);
  setSelectedPet(null);
}}
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
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-3xl p-8 relative">

            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-5 right-5 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Lab Report Details
            </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <p className="font-semibold">Lab Order ID</p>
    <p>{viewReport?.labOrderId || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Pet Name</p>
    <p>{viewReport?.petName || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Owner Name</p>
    <p>{viewReport?.ownerName || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Owner Phone</p>
    <p>{viewReport?.ownerPhone || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Status</p>
    <p>{viewReport?.status || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Report Type</p>
    <p>{viewReport?.reportType || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Tests Required</p>
    <p>{viewReport?.testsRequired?.join(", ") || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Tests Completed</p>
    <p>{viewReport?.testsCompleted?.join(", ") || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Sample Collected</p>
    <p>{viewReport?.sampleCollectedAt
      ? new Date(viewReport.sampleCollectedAt).toLocaleString()
      : "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Report Date</p>
    <p>{viewReport?.reportDate
      ? new Date(viewReport.reportDate).toLocaleDateString()
      : "-"}</p>
  </div>

  <div>
    <p className="font-semibold">External Lab</p>
    <p>{viewReport?.externalLabName || "-"}</p>
  </div>

  <div>
    <p className="font-semibold">Critical Case</p>
    <p>{viewReport?.criticalValuesFlag ? "Yes" : "No"}</p>
  </div>

  {viewReport?.criticalValuesFlag && (
    <div className="md:col-span-2">
      <p className="font-semibold">Critical Notes</p>
      <p>{viewReport?.criticalNotes || "-"}</p>
    </div>
  )}

  <div className="md:col-span-2">
    <p className="font-semibold">Remarks</p>
    <p>{viewReport?.remarks || "-"}</p>
  </div>

  <div className="md:col-span-2">
    <p className="font-semibold">Report File</p>

    {viewReport?.reportFiles?.length > 0 ? (
      <a
        href={viewReport.reportFiles[0]}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        View Uploaded Report
      </a>
    ) : (
      <p>No Report Uploaded</p>
    )}
  </div>

</div>

          </div>
        </div>
      )}

    </div>
  );
}
