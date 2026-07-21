import React from "react";
import { Download, CheckCircle, X, FileText, Calendar, User, PawPrint, Edit3 } from "lucide-react";
import { generateCaseReportPDF } from "./generateCaseReportPDF";

export default function CaseCompletionModal({ open, onClose, onEdit, caseData }) {
  if (!open || !caseData) return null;

  const petName =
    caseData.pet?.petName ||
    caseData.petId?.name ||
    caseData.petId?.petName ||
    caseData.petName ||
    "Patient";

  const ownerName =
    caseData.owner?.ownerName ||
    caseData.ownerId?.ownerName ||
    caseData.ownerName ||
    "Owner";

  const mobile =
    caseData.owner?.mobileNumber ||
    caseData.ownerId?.mobileNumber ||
    caseData.phoneNumber ||
    "N/A";

  const species =
    caseData.pet?.species || caseData.petId?.species || caseData.species || "Pet";

  const tokenNumber =
    caseData.tokenNumber ||
    caseData.token ||
    `TK-${(caseData._id || "").slice(-4) || "00"}`;

  const diagnosis =
    caseData.diagnosis?.confirmedDiagnosis ||
    caseData.diagnosis?.provisionalDiagnosis ||
    "General Consultation & Checkup";

  const handleDownload = () => {
    generateCaseReportPDF(caseData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-100 transform transition-all scale-100">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Case Closed & Registration Completed!
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The consultation has been completed and saved to pet records.
          </p>
        </div>

        {/* Patient Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <PawPrint className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{petName}</h4>
                <p className="text-[11px] text-slate-500 font-medium capitalize">{species}</p>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {tokenNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3" /> Owner
              </p>
              <p className="font-bold text-slate-700">{ownerName}</p>
              <p className="text-slate-500 text-[11px]">{mobile}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </p>
              <p className="font-bold text-slate-700">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-0.5">
            <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" /> Diagnosis Summary
            </p>
            <p className="font-semibold text-slate-800 text-xs line-clamp-2">
              {diagnosis}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF Report</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-full py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Case</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all border border-slate-200 cursor-pointer ${!onEdit ? "col-span-2" : ""}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
