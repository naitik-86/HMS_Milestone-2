import { useEffect, useState } from "react";
import {
  FlaskConical,
  Search,
  FileUp,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  PawPrint,
  User,
  Loader2,
  AlertCircle,
  X,
  ShieldCheck,
  Check,
  FileCheck,
  Building2,
} from "lucide-react";
import {
  getLabPendingPets,
  getRequiredLabTests,
  uploadLabReports,
} from "../../api/labApi";
import { showToast } from "../../../../shared/components/toast";

export default function LabPendingCases() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [files, setFiles] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await getLabPendingPets();
      setCases(res?.data || []);
    } catch (error) {
      console.error("Error fetching lab cases:", error);
      showToast({
        type: "error",
        title: "Fetch Error",
        description: "Failed to load pending lab cases.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (testName, file) => {
    if (file && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File Type",
        description: "Please upload PDF or Image report files.",
      });
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [testName]: file,
    }));
  };

  const handleOpenModal = async (item) => {
    try {
      const res = await getRequiredLabTests(item.pet?._id || item.petId, item._id);
      setSelectedCase({
        ...item,
        tests: res?.data || [],
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching tests:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to load required lab tests.",
      });
    }
  };

  const handleFetchTests = async (item) => {
    try {
      const res = await getRequiredLabTests(item.pet?._id || item.petId, item._id);
      return res?.data || [];
    } catch (error) {
      console.error("Error fetching tests:", error);
      return [];
    }
  };

  const handleUpload = async () => {
    if (Object.keys(files).length === 0) {
      showToast({
        type: "error",
        title: "No Files Selected",
        description: "Please select at least one lab report file to upload.",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(files).forEach(([testName, file]) => {
      if (file) {
        formData.append(testName, file);
      }
    });

    formData.append("petId", selectedCase.pet?._id || selectedCase.petId);
    formData.append("visitId", selectedCase._id);

    try {
      setUploading(true);
      await uploadLabReports(formData);

      showToast({
        type: "success",
        title: "Upload Successful",
        description: "Lab reports uploaded & returned to Doctor successfully!",
      });

      setShowUploadModal(false);
      setFiles({});
      setSelectedCase(null);
      await fetchCases();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Upload Failed",
        description: err?.response?.data?.message || "Failed to upload lab reports.",
      });
    } finally {
      setUploading(false);
    }
  };

  const filtered = cases.filter((item) => {
    const query = search.toLowerCase().trim();
    const token = (item.tokenNumber?.toString() || "").toLowerCase();
    const ownerName = (item.owner?.ownerName || item.ownerName || "").toLowerCase();
    const phone = (item.owner?.mobileNumber || item.owner?.phone || item.phoneNumber || "").toLowerCase();
    const petName = (item.pet?.petName || item.pet?.name || item.petName || "").toLowerCase();

    return (
      !query ||
      token.includes(query) ||
      ownerName.includes(query) ||
      phone.includes(query) ||
      petName.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/70 overflow-hidden flex flex-col">
        {/* Sleek Dark Header Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Lab Diagnostics Queue</h1>
              <Sparkles className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">
              Review test requisitions, conduct diagnostic tests, and upload PDF reports for doctors
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lab Technician Desk</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Search Bar & Active Count Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Token, Owner Name, Phone Number, or Pet Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-white text-slate-700 font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none text-sm shadow-xs"
              />
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 justify-center">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{filtered.length} Pending Requisitions</span>
            </div>
          </div>

          {/* Pending Patients Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Pending Diagnostics Queue</h3>
                <p className="text-xs text-slate-400 font-medium">Requisitions referred by attending doctors</p>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span>Loading lab pending cases...</span>
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                      <th className="py-3.5 px-4">Token</th>
                      <th className="py-3.5 px-4">Owner Info</th>
                      <th className="py-3.5 px-4">Pet Patient</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Required Tests</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {filtered.map((item) => (
                      <tr key={item._id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="py-4 px-4 font-black text-slate-800">
                          <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-xl border border-slate-200">
                            TK-{item.tokenNumber || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-800">{item.owner?.ownerName || item.ownerName || "N/A"}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.owner?.mobileNumber || item.owner?.phone || "N/A"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <PawPrint className="w-4 h-4 text-orange-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800">{item.pet?.petName || item.pet?.name || "N/A"}</p>
                              <p className="text-xs text-slate-400">{item.pet?.species || "Pet"} • {item.pet?.breed || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-amber-100 text-amber-800 border border-amber-300/60 px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending Lab
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(item)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Required Tests</span>
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              const tests = await handleFetchTests(item);
                              setSelectedCase({
                                ...item,
                                tests,
                              });
                              setShowUploadModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm border-none inline-flex items-center gap-1.5"
                          >
                            <FileUp className="w-3.5 h-3.5" />
                            <span>Upload Report</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-base">No Pending Lab Requisitions</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  All lab test requisitions have been completed or no pending cases match your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REQUIRED TESTS MODAL */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Required Lab Tests</h3>
                  <p className="text-xs text-slate-300">Requisition for {selectedCase.pet?.petName || "Pet"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedCase.tests && selectedCase.tests.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedCase.tests.map((test, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">{typeof test === "string" ? test : test.testName || test.name || "Lab Test"}</p>
                        {test.instructions && <p className="text-xs text-slate-400 mt-0.5">{test.instructions}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-6">No specific tests listed in requisition.</p>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REPORT MODAL */}
      {showUploadModal && selectedCase && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Upload Diagnostic Reports</h3>
                  <p className="text-xs text-slate-300">Patient: {selectedCase.pet?.petName || "Pet"} • Token: TK-{selectedCase.tokenNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between text-xs text-orange-800 font-semibold">
                <span>Select PDF or Image report files for each requested diagnostic test.</span>
                <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              </div>

              {selectedCase.tests && selectedCase.tests.length > 0 ? (
                selectedCase.tests.map((test, index) => {
                  const testName = typeof test === "string" ? test : test.testName || test.name || `Test_${index + 1}`;
                  return (
                    <div key={index} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {testName}
                      </label>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileChange(testName, e.target.files[0])}
                        className="w-full border border-slate-200 rounded-xl p-2.5 bg-white text-xs text-slate-700 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                      />
                      {files[testName] && (
                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {files[testName].name}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    General Lab Report PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("General_Report", e.target.files[0])}
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-white text-xs text-slate-700 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer border-none flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit & Return to Doctor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}