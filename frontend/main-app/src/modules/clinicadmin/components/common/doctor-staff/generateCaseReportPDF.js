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
  doc.text("Official Medical Record & Prescription Summary", margin, 19);

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
  doc.setFillColor(248, 250, 252);
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
  doc.text(`Status: Completed Consultation`, margin + 95, y + 26);

  y += 40;

  // Section 1: Clinical Vitals
  const vitals = data.vitals || data.preConsultationId || {};
  const temp = vitals.bodyTemperature || vitals.temperature || "N/A";
  const weight = vitals.bodyWeight || vitals.weight || "N/A";
  const hr = vitals.heartRate || vitals.pulseRate || "N/A";
  const resp = vitals.respiratoryRate || "N/A";
  const bp = vitals.bloodPressure || "N/A";
  const spo2 = vitals.spo2 !== undefined && vitals.spo2 !== "" ? `${vitals.spo2}%` : "N/A";
  const bcs = vitals.bcs ? `${vitals.bcs}/5` : "N/A";
  const recBy = vitals.recordedBy || "Duty Staff";

  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CLINICAL VITALS", margin, y);
  y += 3;
  doc.setLineWidth(0.5);
  doc.setDrawColor(232, 99, 10);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Temp: ${temp} °F/°C   |   Weight: ${weight} kg   |   Heart Rate: ${hr} bpm   |   Resp Rate: ${resp}`, margin, y);
  y += 5;
  doc.text(`Blood Pressure: ${bp}   |   SpO2: ${spo2}   |   BCS: ${bcs}   |   Recorded By: ${recBy}`, margin, y);
  y += 9;

  // Section 2: History - Doctor Reviews
  const history = data.history || {};
  const dietType = history.dietType || "N/A";
  const dietFreq = history.dietFrequency ? `${history.dietFrequency} meals/day` : "N/A";
  const waterIntake = history.waterIntake || "N/A";
  const behaviour = history.behaviour || "N/A";
  const exercise = history.exercise || "N/A";
  const vacVerified = history.vaccinationStatus || data.pet?.history?.vaccineName || "Verified";
  const allergiesVerified = history.allergies || data.pet?.history?.allergies || "No Known Allergies";

  checkPageBreak(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("2. HISTORY - DOCTOR REVIEWS", margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Diet Type: ${dietType}   |   Diet Frequency: ${dietFreq}   |   Water Intake: ${waterIntake}`, margin, y);
  y += 5;
  doc.text(`Behavioral Habits: ${behaviour}   |   Exercise Level: ${exercise}`, margin, y);
  y += 5;
  doc.text(`Vaccination Status Verified: ${vacVerified}`, margin, y);
  y += 5;
  doc.text(`Known Allergies Verified: ${allergiesVerified}`, margin, y);
  y += 6;

  // Confirmed Medications History Multi-rows
  const medConfirmed = Array.isArray(history.medicationsConfirmed) ? history.medicationsConfirmed : [];
  if (medConfirmed.length > 0 && medConfirmed.some(m => m.drug)) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Current Medications Confirmed:", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    medConfirmed.forEach(m => {
      if (m.drug) {
        checkPageBreak(8);
        doc.text(`• Drug: ${m.drug} | Dose: ${m.dose || 'N/A'} | Freq: ${m.frequency || 'N/A'} | Since: ${m.since || 'N/A'}`, margin + 3, y);
        y += 4.5;
      }
    });
    y += 2;
  }
  y += 4;

  // Section 3: Clinical Observations
  const obs = data.clinicalObservation || {};
  const obsKeys = [
    { key: "cardiovascular", label: "Cardiovascular" },
    { key: "respiratory", label: "Respiratory" },
    { key: "digestive", label: "Digestive" },
    { key: "musculoskeletal", label: "Musculoskeletal" },
    { key: "neurological", label: "Neurological" },
    { key: "urogenital", label: "Urogenital" },
    { key: "skin", label: "Skin & Coat" },
    { key: "eyes", label: "Eyes" },
    { key: "ears", label: "Ears" },
    { key: "lymphNodes", label: "Lymph Nodes" },
  ];

  const recordedObs = obsKeys.filter(o => obs[o.key]);
  const generalObsNotes = obs.doctorNotes || "";

  if (recordedObs.length > 0 || generalObsNotes) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("3. CLINICAL OBSERVATIONS", margin, y);
    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    recordedObs.forEach(item => {
      checkPageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${item.label}: `, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(obs[item.key]), margin + 32, y);
      y += 4.5;
    });

    if (generalObsNotes) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.text("Doctor Observation Notes: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitObsNotes = doc.splitTextToSize(generalObsNotes, pageWidth - margin * 2 - 40);
      doc.text(splitObsNotes, margin + 40, y);
      y += Math.max(splitObsNotes.length * 4.5, 6);
    }
    y += 4;
  }

  // Section 4: Diagnosis & Lab Requisition
  const diag = data.diagnosis || {};
  const confirmedDiag = diag.confirmedDiagnosis || diag.provisionalDiagnosis || "General Checkup & Wellness Consultation";
  const diffDiag = diag.differentialDiagnosis || "";
  const provDiag = diag.provisionalDiagnosis || "";
  const labReq = data.labRequisition || {};

  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("4. DIAGNOSIS & LAB REQUISITION", margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Confirmed Diagnosis: ", margin, y);
  doc.setFont("helvetica", "normal");
  const splitDiag = doc.splitTextToSize(confirmedDiag, pageWidth - margin * 2 - 40);
  doc.text(splitDiag, margin + 40, y);
  y += Math.max(splitDiag.length * 4.5, 5);

  if (provDiag && provDiag !== confirmedDiag) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.text("Provisional Diagnosis: ", margin, y);
    doc.setFont("helvetica", "normal");
    const splitProv = doc.splitTextToSize(provDiag, pageWidth - margin * 2 - 40);
    doc.text(splitProv, margin + 40, y);
    y += Math.max(splitProv.length * 4.5, 5);
  }

  if (diffDiag) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.text("Differential Diagnosis: ", margin, y);
    doc.setFont("helvetica", "normal");
    const splitDiff = doc.splitTextToSize(diffDiag, pageWidth - margin * 2 - 40);
    doc.text(splitDiff, margin + 40, y);
    y += Math.max(splitDiff.length * 4.5, 5);
  }

  if (diag.raiseLab || (labReq.tests && labReq.tests.length > 0)) {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.text("Lab Requisition: ", margin, y);
    doc.setFont("helvetica", "normal");
    const testsStr = Array.isArray(labReq.tests) ? labReq.tests.join(", ") : "Raised";
    const sampleStr = Array.isArray(labReq.sampleType) ? labReq.sampleType.join(", ") : "";
    doc.text(`Tests: ${testsStr}${sampleStr ? ` | Samples: ${sampleStr}` : ""}`, margin + 35, y);
    y += 5;
  }
  y += 4;

  // Section 5: Treatment & Prescription Administered
  const treatment = data.treatment || {};
  const medsList = Array.isArray(treatment.medicationsList) ? treatment.medicationsList : [];
  const procList = Array.isArray(treatment.proceduresList) ? treatment.proceduresList : [];
  const vacList = Array.isArray(treatment.vaccinationsList) ? treatment.vaccinationsList : [];
  const dewList = Array.isArray(treatment.dewormingList) ? treatment.dewormingList : [];
  const fluidList = Array.isArray(treatment.fluidsList) ? treatment.fluidsList : [];

  checkPageBreak(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("5. TREATMENT & PRESCRIPTION ADMINISTERED", margin, y);
  y += 3;
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // 5.1 Medications Prescribed
  if (medsList.length > 0 && medsList.some(m => m.drugName)) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Medications Prescribed:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    medsList.forEach((m, idx) => {
      if (m.drugName) {
        checkPageBreak(8);
        doc.text(`${idx + 1}. Drug: ${m.drugName} | Dose: ${m.dose || '-'} | Route: ${m.route || '-'} | Freq: ${m.frequency || '-'} | Duration: ${m.duration || '-'} | Instruction: ${m.instruction || '-'}`, margin + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  } else if (treatment.medicines) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Medications Prescribed:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitMeds = doc.splitTextToSize(String(treatment.medicines), pageWidth - margin * 2);
    doc.text(splitMeds, margin, y);
    y += splitMeds.length * 4.5 + 3;
  }

  // 5.2 In Clinic Procedures Done
  if (procList.length > 0 && procList.some(p => p.procedure)) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("In Clinic Procedures Done:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    procList.forEach((p, idx) => {
      if (p.procedure) {
        checkPageBreak(8);
        doc.text(`${idx + 1}. Procedure: ${p.procedure} | Description: ${p.description || '-'} | Outcome: ${p.outcome || '-'}`, margin + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  } else if (treatment.procedures) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Procedures Performed:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitProc = doc.splitTextToSize(String(treatment.procedures), pageWidth - margin * 2);
    doc.text(splitProc, margin, y);
    y += splitProc.length * 4.5 + 3;
  }

  // 5.3 Vaccination Administered
  if (vacList.length > 0 && vacList.some(v => v.vaccine)) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Vaccination Administered:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    vacList.forEach((v, idx) => {
      if (v.vaccine) {
        checkPageBreak(8);
        doc.text(`${idx + 1}. Vaccine: ${v.vaccine} | Batch No: ${v.batchNumber || '-'} | Dose: ${v.dose || '-'} | Route: ${v.route || '-'} | Next Due: ${v.nextDueDate || '-'}`, margin + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  } else if (treatment.vaccinations) {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Vaccination Administered: ${treatment.vaccinations}`, margin, y);
    y += 6;
  }

  // 5.4 Deworming Administered
  if (treatment.hasDeworming && dewList.length > 0 && dewList.some(d => d.product)) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Deworming Administered:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    dewList.forEach((d, idx) => {
      if (d.product) {
        checkPageBreak(8);
        doc.text(`${idx + 1}. Product: ${d.product} | Dose: ${d.dose || '-'} | Date: ${d.date || '-'}`, margin + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  } else if (treatment.deworming) {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Deworming Administered: ${treatment.deworming}`, margin, y);
    y += 6;
  }

  // 5.5 Fluids / IV Given
  if (treatment.hasFluids && fluidList.length > 0 && fluidList.some(f => f.type)) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("Fluids / IV Given:", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    fluidList.forEach((f, idx) => {
      if (f.type) {
        checkPageBreak(8);
        doc.text(`${idx + 1}. Type: ${f.type} | Volume: ${f.volume || '-'} | Rate: ${f.rate || '-'}`, margin + 2, y);
        y += 4.5;
      }
    });
    y += 3;
  } else if (treatment.fluids) {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Fluids / IV Given: ${treatment.fluids}`, margin, y);
    y += 6;
  }

  if (treatment.treatmentNotes) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Treatment Notes: ", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitTN = doc.splitTextToSize(treatment.treatmentNotes, pageWidth - margin * 2 - 35);
    doc.text(splitTN, margin + 35, y);
    y += Math.max(splitTN.length * 4.5, 6);
  }
  y += 4;

  // Section 6: Discharge Advice & Suggestions
  const suggestion = data.suggestion || {};
  const dietAdvice = suggestion.dietAdvice || "";
  const homeCare = suggestion.homeCare || "";
  const activityRestriction = suggestion.activityRestriction || "";
  const preventiveCare = suggestion.preventiveCare || "";
  const followUpDate = suggestion.followUpDate || treatment.followUp || "";
  const finalNotes = suggestion.finalNotes || "";
  const prognosis = suggestion.prognosis || "";

  if (dietAdvice || homeCare || activityRestriction || preventiveCare || followUpDate || finalNotes || prognosis) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("6. DISCHARGE ADVICE & FOLLOW-UP INSTRUCTIONS", margin, y);
    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    if (prognosis) {
      checkPageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.text("Prognosis: ", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(prognosis, margin + 35, y);
      y += 5;
    }

    if (dietAdvice) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.text("Dietary Advice: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitDiet = doc.splitTextToSize(dietAdvice, pageWidth - margin * 2 - 35);
      doc.text(splitDiet, margin + 35, y);
      y += Math.max(splitDiet.length * 4.5, 5);
    }

    if (activityRestriction) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.text("Activity Restriction: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitAct = doc.splitTextToSize(activityRestriction, pageWidth - margin * 2 - 35);
      doc.text(splitAct, margin + 35, y);
      y += Math.max(splitAct.length * 4.5, 5);
    }

    if (homeCare) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.text("Home Care: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitHome = doc.splitTextToSize(homeCare, pageWidth - margin * 2 - 35);
      doc.text(splitHome, margin + 35, y);
      y += Math.max(splitHome.length * 4.5, 5);
    }

    if (preventiveCare) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.text("Preventive Care: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitPrev = doc.splitTextToSize(preventiveCare, pageWidth - margin * 2 - 35);
      doc.text(splitPrev, margin + 35, y);
      y += Math.max(splitPrev.length * 4.5, 5);
    }

    if (followUpDate) {
      checkPageBreak(8);
      doc.setFont("helvetica", "bold");
      doc.text("Follow-Up Required / Date: ", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(followUpDate), margin + 45, y);
      y += 5;
    }

    if (finalNotes) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.text("Final Doctor Notes: ", margin, y);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(finalNotes, pageWidth - margin * 2 - 35);
      doc.text(splitNotes, margin + 35, y);
      y += Math.max(splitNotes.length * 4.5, 5);
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
