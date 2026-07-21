import { jsPDF } from "jspdf";

export const generateCaseReportPDF = (data) => {
  if (!data) return;

  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Helper to add page break if needed
  const checkPageBreak = (neededHeight = 20) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = 15;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("VET CLINIC & ANIMAL HOSPITAL", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text("Official Consultation Summary & Prescription Report", margin, 19);

  // Date & Token on Header Right
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const tokenNumber =
    data.tokenNumber ||
    data.token ||
    `TK-${(data._id || data.id || "").slice(-4) || "00"}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`TOKEN: ${tokenNumber}`, pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Date: ${dateStr}`, pageWidth - margin, 19, { align: "right" });

  y = 34;

  // Patient & Owner Info Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 3, 3, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("PATIENT DETAILS", margin + 4, y + 7);
  doc.text("OWNER DETAILS", margin + 95, y + 7);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const petName =
    data.pet?.petName ||
    data.petId?.name ||
    data.petId?.petName ||
    data.petName ||
    "Patient";
  const species =
    data.pet?.species || data.petId?.species || data.species || "N/A";
  const breed = data.pet?.breed || data.petId?.breed || data.breed || "N/A";
  const gender = data.pet?.gender || data.petId?.gender || data.gender || "N/A";
  const age = data.pet?.age || data.petId?.age || data.age || "N/A";

  const ownerName =
    data.owner?.ownerName ||
    data.ownerId?.ownerName ||
    data.ownerName ||
    "N/A";
  const mobile =
    data.owner?.mobileNumber ||
    data.ownerId?.mobileNumber ||
    data.phoneNumber ||
    "N/A";

  doc.text(`Pet Name: ${petName}`, margin + 4, y + 14);
  doc.text(`Species/Breed: ${species} (${breed})`, margin + 4, y + 20);
  doc.text(`Gender / Age: ${gender} / ${age}`, margin + 4, y + 26);

  doc.text(`Owner Name: ${ownerName}`, margin + 95, y + 14);
  doc.text(`Mobile: ${mobile}`, margin + 95, y + 20);
  doc.text(`Status: Consultation Completed`, margin + 95, y + 26);

  y += 40;

  // Vitals Section
  const vitals = data.vitals || data.preConsultationId || {};
  const temp = vitals.bodyTemperature || vitals.temperature || "N/A";
  const weight = vitals.bodyWeight || vitals.weight || "N/A";
  const pulse = vitals.pulseRate || vitals.pulse || "N/A";
  const resp = vitals.respiratoryRate || "N/A";

  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CLINICAL VITALS", margin, y);
  y += 3;
  doc.setLineWidth(0.5);
  doc.setDrawColor(232, 99, 10); // orange accent
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Body Temperature: ${temp}   |   Body Weight: ${weight}   |   Pulse: ${pulse}   |   Resp Rate: ${resp}`,
    margin,
    y
  );
  y += 9;

  // Diagnosis Section
  const diag = data.diagnosis || {};
  const confirmedDiag =
    diag.confirmedDiagnosis ||
    diag.provisionalDiagnosis ||
    "General Checkup & Wellness Consultation";
  const diffDiag = diag.differentialDiagnosis || "";

  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("2. DIAGNOSIS & CLINICAL OBSERVATIONS", margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Confirmed / Primary Diagnosis: ", margin, y);
  doc.setFont("helvetica", "normal");
  const splitDiag = doc.splitTextToSize(confirmedDiag, 120);
  doc.text(splitDiag, margin + 55, y);
  y += Math.max(splitDiag.length * 5, 6);

  if (diffDiag) {
    doc.setFont("helvetica", "bold");
    doc.text("Differential Diagnosis: ", margin, y);
    doc.setFont("helvetica", "normal");
    const splitDiff = doc.splitTextToSize(diffDiag, 120);
    doc.text(splitDiff, margin + 55, y);
    y += Math.max(splitDiff.length * 5, 6);
  }
  y += 4;

  // Treatment & Prescription Section
  const treatment = data.treatment || {};
  const medicines = treatment.medicines || "";
  const procedures = treatment.procedures || "";
  const treatmentNotes = treatment.treatmentNotes || "";

  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("3. PRESCRIPTION & TREATMENT ADMINISTERED", margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  if (medicines) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Prescribed Medicines:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitMeds = doc.splitTextToSize(medicines, pageWidth - margin * 2);
    doc.text(splitMeds, margin, y);
    y += splitMeds.length * 5 + 4;
  }

  if (procedures) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Procedures Performed:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitProc = doc.splitTextToSize(procedures, pageWidth - margin * 2);
    doc.text(splitProc, margin, y);
    y += splitProc.length * 5 + 4;
  }

  if (treatmentNotes) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Treatment Notes:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const splitTN = doc.splitTextToSize(treatmentNotes, pageWidth - margin * 2);
    doc.text(splitTN, margin, y);
    y += splitTN.length * 5 + 4;
  }

  // Suggestions & Discharge Advice Section
  const suggestion = data.suggestion || {};
  const dietAdvice = suggestion.dietAdvice || "";
  const homeCare = suggestion.homeCare || "";
  const followUpDate = suggestion.followUpDate || "";
  const finalNotes = suggestion.finalNotes || "";
  const prognosis = suggestion.prognosis || "";

  if (dietAdvice || homeCare || followUpDate || finalNotes || prognosis) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("4. ADVICE & FOLLOW-UP INSTRUCTIONS", margin, y);
    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    if (prognosis) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Prognosis: ", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(prognosis, margin + 35, y);
      y += 6;
    }

    if (dietAdvice) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Dietary Advice: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitDiet = doc.splitTextToSize(dietAdvice, pageWidth - margin * 2 - 35);
      doc.text(splitDiet, margin + 35, y);
      y += Math.max(splitDiet.length * 5, 6);
    }

    if (homeCare) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Home Care: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitHome = doc.splitTextToSize(homeCare, pageWidth - margin * 2 - 35);
      doc.text(splitHome, margin + 35, y);
      y += Math.max(splitHome.length * 5, 6);
    }

    if (followUpDate) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Follow-Up Date: ", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(followUpDate, margin + 35, y);
      y += 6;
    }

    if (finalNotes) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Final Doctor Notes: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(finalNotes, pageWidth - margin * 2 - 35);
      doc.text(splitNotes, margin + 35, y);
      y += Math.max(splitNotes.length * 5, 6);
    }
  }

  // Doctor Signature Section
  y = Math.max(y + 15, pageHeight - 35);
  if (y > pageHeight - 30) {
    doc.addPage();
    y = pageHeight - 35;
  }

  doc.setLineWidth(0.4);
  doc.setDrawColor(148, 163, 184);
  doc.line(pageWidth - margin - 55, y, pageWidth - margin, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const docName =
    data.consultationDetails?.doctorName ||
    data.doctorName ||
    "Authorized Veterinarian";
  doc.text(docName, pageWidth - margin - 55, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Doctor's Signature & Stamp", pageWidth - margin - 55, y + 9);

  // Footer Note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Thank you for choosing our clinic for your pet's healthcare needs.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  const sanitizedPetName = petName.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`Medical_Report_${sanitizedPetName}_${tokenNumber}.pdf`);
};
