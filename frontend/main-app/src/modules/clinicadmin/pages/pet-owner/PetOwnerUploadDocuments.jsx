import { useState } from "react";
import PetOwnerSidebar from "../../components/pet-owner/PetOwnerSidebar";
import {
  FaCloudUploadAlt,
  FaFileMedical,
  FaCalendarAlt,
  FaStickyNote,
  FaTimes,
} from "react-icons/fa";

const PetOwnerUploadDocuments = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      <PetOwnerSidebar />

      <div className="ml-[280px] p-8">
        {/* Header */}
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-blue-900 to-blue-600 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold">
            Upload Documents
          </h1>

          <p className="mt-2 text-white/70">
            Upload external lab reports and share them
            with your doctor for review.
          </p>
        </div>

        {/* Upload Card */}
        <div
          onClick={() => setShowModal(true)}
          className="
          cursor-pointer
          rounded-3xl
          border-2
          border-dashed
          border-orange-300
          bg-white
          p-12
          text-center
          shadow-lg
          transition-all
          hover:-translate-y-1
          hover:border-orange-500
          hover:shadow-2xl
        "
        >
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <FaCloudUploadAlt className="text-5xl text-orange-500" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800">
            Upload Lab Report
          </h2>

          <p className="mt-3 text-slate-500">
            PDF, JPG, PNG supported
          </p>
        </div>

        {/* Warning */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-red-500 to-red-600 p-6 text-center text-white shadow-xl">
          <h3 className="text-lg font-bold">
            Owner Submitted Reports
          </h3>

          <p className="mt-2 text-white/90">
            Uploaded reports are marked as
            <strong> Owner Submitted </strong>
            and become visible to doctors for review.
          </p>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b p-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Upload External Lab Report
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="
                  rounded-xl
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-100
                "
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 p-6">
                {/* Upload */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                    <FaCloudUploadAlt className="text-orange-500" />
                    External Lab Report
                  </label>

                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    p-3
                  "
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                    <FaFileMedical className="text-blue-500" />
                    Report Description / Lab Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter lab name"
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    p-3
                    outline-none
                    focus:border-orange-500
                  "
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                    <FaCalendarAlt className="text-green-500" />
                    Report Date
                  </label>

                  <input
                    type="date"
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    p-3
                    outline-none
                    focus:border-orange-500
                  "
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
                    <FaStickyNote className="text-purple-500" />
                    Notes / Query For Doctor
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Write your notes..."
                    className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    p-3
                    outline-none
                    focus:border-orange-500
                  "
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t p-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="
                  rounded-2xl
                  border
                  px-6
                  py-3
                  font-medium
                  hover:bg-slate-50
                "
                >
                  Cancel
                </button>

                <button
                  className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-orange-500
                  to-orange-600
                  px-6
                  py-3
                  font-medium
                  text-white
                  shadow-lg
                  hover:shadow-xl
                "
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default PetOwnerUploadDocuments;