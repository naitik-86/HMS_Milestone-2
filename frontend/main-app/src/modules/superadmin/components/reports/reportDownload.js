import { jsPDF } from "jspdf";

const PAGE_MARGIN = 14;
const COLORS = {
  title: [15, 23, 42],
  muted: [100, 116, 139],
  border: [226, 232, 240],
  accent: [232, 99, 10],
  indigo: [99, 102, 241],
  green: [34, 197, 94],
  amber: [245, 158, 11],
  rose: [239, 68, 68],
  slate: [51, 65, 85],
  soft: [248, 250, 252],
};

const sanitizeFileNamePart = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatCurrency = (value) =>
  `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0))}`;

const safeText = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return String(value);
};

const countTruthy = (value) => Object.values(value || {}).filter(Boolean).length;

const sumBy = (items, selector) =>
  items.reduce((total, item) => total + Number(selector(item) || 0), 0);

const getValueByPath = (item, path) => {
  if (!path) return undefined;
  if (typeof path === "function") return path(item);

  return String(path)
    .split(".")
    .reduce((currentValue, key) => currentValue?.[key], item);
};

const sortByDateDesc = (items, accessor) =>
  [...items].sort(
    (left, right) =>
      new Date(getValueByPath(right, accessor) || 0).getTime() -
      new Date(getValueByPath(left, accessor) || 0).getTime()
  );

const sortByDateAsc = (items, accessor) =>
  [...items].sort(
    (left, right) =>
      new Date(getValueByPath(left, accessor) || 0).getTime() -
      new Date(getValueByPath(right, accessor) || 0).getTime()
  );

const sortByNumberDesc = (items, accessor) =>
  [...items].sort(
    (left, right) => Number(getValueByPath(right, accessor) || 0) - Number(getValueByPath(left, accessor) || 0)
  );

const resolveColumnWidths = (columns, totalWidth) => {
  const fixedWidth = columns.reduce((sum, column) => sum + Number(column.width || 0), 0);
  const flexibleColumns = columns.filter((column) => !column.width).length;
  const flexibleWidth = flexibleColumns > 0 ? Math.max((totalWidth - fixedWidth) / flexibleColumns, 18) : 0;

  return columns.map((column) => Number(column.width || flexibleWidth));
};

const renderTopBand = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, pageWidth, 12, "F");
};

const renderTitle = (doc, title, subtitle, generatedAt) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  renderTopBand(doc);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.title);
  doc.text(title, PAGE_MARGIN, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(subtitle, PAGE_MARGIN, 29);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated at ${formatDateTime(generatedAt)}`, pageWidth - PAGE_MARGIN, 22, {
    align: "right",
  });

  doc.setDrawColor(...COLORS.border);
  doc.line(PAGE_MARGIN, 34, pageWidth - PAGE_MARGIN, 34);

  return 38;
};

const renderSummarySection = (doc, items, startY) => {
  if (!items.length) return startY;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PAGE_MARGIN * 2;
  const labelWidth = 62;
  let cursorY = startY;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.title);
  doc.text("Summary", PAGE_MARGIN, cursorY);
  cursorY += 7;

  items.forEach((item) => {
    const label = safeText(item.label);
    const value = safeText(item.value);
    const valueLines = doc.splitTextToSize(value, Math.max(maxWidth - labelWidth - 6, 40));
    const rowHeight = Math.max(6, valueLines.length * 4.8 + 1);

    if (cursorY + rowHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      renderTopBand(doc);
      cursorY = PAGE_MARGIN + 4;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.title);
    doc.text(`${label}:`, PAGE_MARGIN, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.slate);
    doc.text(valueLines.join("\n"), PAGE_MARGIN + labelWidth, cursorY);

    cursorY += rowHeight + 1.5;
  });

  return cursorY + 2;
};

const renderEmptyState = (doc, message, startY) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const width = pageWidth - PAGE_MARGIN * 2;
  const height = 18;

  doc.setFillColor(...COLORS.soft);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(PAGE_MARGIN, startY, width, height, 3, 3, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(safeText(message), PAGE_MARGIN + 4, startY + 11);

  return startY + height + 4;
};

const renderTable = (doc, { title, subtitle, columns, rows, startY }) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableWidth = pageWidth - PAGE_MARGIN * 2;
  const columnWidths = resolveColumnWidths(columns, tableWidth);
  const headerHeight = 10;
  let cursorY = startY;

  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLORS.title);
    doc.text(title, PAGE_MARGIN, cursorY);
    cursorY += 6;
  }

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.muted);
    const subtitleLines = doc.splitTextToSize(safeText(subtitle), tableWidth);
    doc.text(subtitleLines, PAGE_MARGIN, cursorY);
    cursorY += subtitleLines.length * 4.2 + 2;
  }

  if (!rows.length) {
    return renderEmptyState(doc, "No records found for this report.", cursorY);
  }

  const drawHeader = (yPosition) => {
    let xPosition = PAGE_MARGIN;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);

    columns.forEach((column, index) => {
      const columnWidth = columnWidths[index];
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(15, 23, 42);
      doc.rect(xPosition, yPosition, columnWidth, headerHeight, "FD");
      doc.text(safeText(column.header), xPosition + 2, yPosition + 6.5);
      xPosition += columnWidth;
    });

    return yPosition + headerHeight;
  };

  cursorY = drawHeader(cursorY);

  rows.forEach((row, rowIndex) => {
    const rowValues = columns.map((column) => safeText(column.value(row, rowIndex)));
    const rowLines = rowValues.map((value, index) =>
      doc.splitTextToSize(value, Math.max(columnWidths[index] - 4, 12))
    );
    const rowHeight = Math.max(...rowLines.map((lines) => Math.max(lines.length * 4.6 + 2, 8)), 8);

    if (cursorY + rowHeight > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      renderTopBand(doc);
      cursorY = PAGE_MARGIN + 2;
      cursorY = drawHeader(cursorY);
    }

    let xPosition = PAGE_MARGIN;

    columns.forEach((column, index) => {
      const columnWidth = columnWidths[index];
      doc.setFillColor(rowIndex % 2 === 0 ? 255 : 249, rowIndex % 2 === 0 ? 255 : 250, rowIndex % 2 === 0 ? 255 : 251);
      doc.setDrawColor(...COLORS.border);
      doc.rect(xPosition, cursorY, columnWidth, rowHeight, "FD");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.9);
      doc.setTextColor(...COLORS.slate);
      doc.text(rowLines[index].join("\n"), xPosition + 2, cursorY + 4.6);
      xPosition += columnWidth;
    });

    cursorY += rowHeight;
  });

  return cursorY + 3;
};

const getSummaryValue = (summary, key, fallback = 0) =>
  Number(summary?.[key] ?? fallback ?? 0);

const formatStorage = (value) =>
  `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0))} GB`;

const getReportBlueprint = ({ category, report, catalog }) => {
  const summary = catalog?.summary || {};
  const clinics = Array.isArray(catalog?.clinics) ? catalog.clinics : [];
  const clinicPerformance = Array.isArray(catalog?.clinicPerformance) ? catalog.clinicPerformance : [];
  const doctorRegistry = Array.isArray(catalog?.doctorRegistry) ? catalog.doctorRegistry : [];
  const doctorActivity = Array.isArray(catalog?.doctorActivity) ? catalog.doctorActivity : [];
  const doctorConsultation = Array.isArray(catalog?.doctorConsultation) ? catalog.doctorConsultation : [];
  const plans = Array.isArray(catalog?.plans) ? catalog.plans : [];
  const revenueTrend = Array.isArray(catalog?.revenueTrend) ? catalog.revenueTrend : [];
  const quarterlyRevenue = Array.isArray(catalog?.quarterlyRevenue) ? catalog.quarterlyRevenue : [];
  const yearlyRevenue = Array.isArray(catalog?.yearlyRevenue) ? catalog.yearlyRevenue : [];
  const verificationSummary = summary.verificationSummary || {};
  const activeClinicCount = clinics.filter((clinic) => clinic.subscriptionStatus === "ACTIVE").length;
  const approvedClinics = clinics.filter((clinic) => clinic.verificationStatus === "APPROVED");
  const rejectedClinics = clinics.filter((clinic) => clinic.verificationStatus === "REJECTED");
  const pendingClinics = clinics.filter((clinic) =>
    ["SUBMITTED", "UNDER_REVIEW", "DOCS_VERIFIED"].includes(clinic.verificationStatus)
  );
  const activePlans = plans.filter((plan) => plan.status === "Active");
  const inactivePlans = plans.filter((plan) => plan.status !== "Active");

  const reportKey = report?.key || "";
  const reportTitle = report?.title || reportKey || "Report";

  switch (reportKey) {
    case "clinic-registration":
      return {
        title: reportTitle,
        subtitle: "Live clinic registration records from the backend clinic collection.",
        summary: [
          { label: "Total clinics", value: clinics.length },
          { label: "Active clinics", value: activeClinicCount },
          { label: "Approved verifications", value: getSummaryValue(verificationSummary, "APPROVED") },
        ],
        columns: [
          { header: "Clinic", width: 48, value: (clinic) => clinic.name },
          { header: "Subscription", width: 34, value: (clinic) => clinic.subscriptionType },
          { header: "Verification", width: 34, value: (clinic) => clinic.verificationStatus },
          { header: "Joined", width: 34, value: (clinic) => formatDate(clinic.createdAt) },
          { header: "Expiry", width: 34, value: (clinic) => formatDate(clinic.expiryDate) },
        ],
        rows: sortByDateDesc(clinics, "createdAt"),
      };

    case "clinic-approved":
      return {
        title: reportTitle,
        subtitle: "Clinics approved in the backend verification pipeline.",
        summary: [
          { label: "Approved clinics", value: approvedClinics.length },
          { label: "Active clinics", value: activeClinicCount },
          { label: "Total clinics", value: clinics.length },
        ],
        columns: [
          { header: "Clinic", width: 52, value: (clinic) => clinic.name },
          { header: "Subscription", width: 34, value: (clinic) => clinic.subscriptionType },
          { header: "Email", width: 48, value: (clinic) => clinic.contactEmail },
          { header: "Approved on", width: 34, value: (clinic) => formatDate(clinic.createdAt) },
        ],
        rows: sortByDateDesc(approvedClinics, "createdAt"),
      };

    case "clinic-rejected":
      return {
        title: reportTitle,
        subtitle: "Rejected clinics and the backend rejection reason stored on each record.",
        summary: [
          { label: "Rejected clinics", value: rejectedClinics.length },
          { label: "Pending reviews", value: pendingClinics.length },
          { label: "Total clinics", value: clinics.length },
        ],
        columns: [
          { header: "Clinic", width: 52, value: (clinic) => clinic.name },
          { header: "Reason", width: 74, value: (clinic) => clinic.rejectionReason || "Not provided" },
          { header: "Email", width: 48, value: (clinic) => clinic.contactEmail },
          { header: "Rejected on", width: 34, value: (clinic) => formatDate(clinic.updatedAt || clinic.createdAt) },
        ],
        rows: sortByDateDesc(rejectedClinics, "updatedAt"),
      };

    case "clinic-performance":
      return {
        title: reportTitle,
        subtitle: "Appointment volume and revenue by clinic, derived from backend appointment data.",
        summary: [
          { label: "Total revenue", value: formatCurrency(summary.totalPaymentCollected) },
          { label: "Total appointments", value: sumBy(clinicPerformance, (clinic) => clinic.appointmentCount) },
          { label: "Total doctors", value: sumBy(clinicPerformance, (clinic) => clinic.doctorCount) },
        ],
        columns: [
          { header: "Clinic", width: 48, value: (clinic) => clinic.name },
          { header: "Doctors", width: 22, value: (clinic) => clinic.doctorCount },
          { header: "Appointments", width: 24, value: (clinic) => clinic.appointmentCount },
          { header: "Completed", width: 22, value: (clinic) => clinic.completedAppointments },
          { header: "Revenue", width: 34, value: (clinic) => formatCurrency(clinic.revenue) },
          { header: "Last Appointment", width: 36, value: (clinic) => formatDate(clinic.lastAppointmentAt) },
        ],
        rows: sortByNumberDesc(clinicPerformance, "revenue"),
      };

    case "doctor-registration":
      return {
        title: reportTitle,
        subtitle: "Registered veterinarians from the backend DoctorDetails collection.",
        summary: [
          { label: "Total doctors", value: doctorRegistry.length },
          { label: "Active doctors", value: doctorRegistry.filter((doctor) => doctor.status === "Active").length },
          { label: "Inactive doctors", value: doctorRegistry.filter((doctor) => doctor.status !== "Active").length },
        ],
        columns: [
          { header: "Doctor", width: 48, value: (doctor) => doctor.name },
          { header: "Clinic", width: 42, value: (doctor) => doctor.clinicName || doctor.clinicId?.name || "" },
          { header: "Staff Code", width: 24, value: (doctor) => doctor.staffCode || "-" },
          { header: "Experience", width: 24, value: (doctor) => `${doctor.experience || 0} yrs` },
          { header: "Fee", width: 22, value: (doctor) => formatCurrency(doctor.consultationFees) },
          { header: "Status", width: 24, value: (doctor) => doctor.status || "-" },
          { header: "Registered", width: 34, value: (doctor) => formatDate(doctor.createdAt) },
        ],
        rows: sortByDateDesc(doctorRegistry, "createdAt"),
      };

    case "doctor-compliance": {
      const today = new Date();
      const expiringSoon = doctorRegistry.filter((doctor) => {
        const validityDate = new Date(doctor.certificateValidityDate || 0);
        if (Number.isNaN(validityDate.getTime())) return false;
        const diffMs = validityDate.getTime() - today.getTime();
        return diffMs > 0 && diffMs <= 1000 * 60 * 60 * 24 * 30;
      });

      return {
        title: reportTitle,
        subtitle: "Registration validity and compliance checks from backend doctor records.",
        summary: [
          { label: "Expiring in 30 days", value: expiringSoon.length },
          { label: "Active doctors", value: doctorRegistry.filter((doctor) => doctor.status === "Active").length },
          { label: "Total doctors", value: doctorRegistry.length },
        ],
        columns: [
          { header: "Doctor", width: 44, value: (doctor) => doctor.name },
          { header: "Clinic", width: 42, value: (doctor) => doctor.clinicName || doctor.clinicId?.name || "" },
          { header: "Registration No", width: 36, value: (doctor) => doctor.registrationNumber },
          { header: "Council", width: 28, value: (doctor) => doctor.stateVetCouncil },
          { header: "Validity", width: 32, value: (doctor) => formatDate(doctor.certificateValidityDate) },
          { header: "Status", width: 24, value: (doctor) => doctor.status || "-" },
        ],
        rows: sortByDateAsc(doctorRegistry, "certificateValidityDate"),
      };
    }

    case "doctor-activity":
      return {
        title: reportTitle,
        subtitle: "Consultation and appointment activity grouped by doctor from backend appointments.",
        summary: [
          { label: "Appointments", value: sumBy(doctorActivity, (item) => item.appointments) },
          { label: "Completed", value: sumBy(doctorActivity, (item) => item.completedAppointments) },
          { label: "Paid", value: sumBy(doctorActivity, (item) => item.paidAppointments) },
        ],
        columns: [
          { header: "Doctor", width: 44, value: (doctor) => doctor.doctorName },
          { header: "Clinic", width: 42, value: (doctor) => doctor.clinicName || "" },
          { header: "Appointments", width: 24, value: (doctor) => doctor.appointments },
          { header: "Completed", width: 22, value: (doctor) => doctor.completedAppointments },
          { header: "Paid", width: 18, value: (doctor) => doctor.paidAppointments },
          { header: "Revenue", width: 28, value: (doctor) => formatCurrency(doctor.revenue) },
          { header: "Last Visit", width: 32, value: (doctor) => formatDate(doctor.lastAppointmentAt) },
        ],
        rows: sortByNumberDesc(doctorActivity, "appointments"),
      };

    case "doctor-consultation":
      return {
        title: reportTitle,
        subtitle: "Revenue contribution per doctor using backend appointment and fee data.",
        summary: [
          { label: "Total revenue", value: formatCurrency(sumBy(doctorConsultation, (item) => item.revenue)) },
          { label: "Top doctor", value: doctorConsultation[0]?.doctorName || "-" },
          { label: "Active doctors", value: doctorRegistry.filter((doctor) => doctor.status === "Active").length },
        ],
        columns: [
          { header: "Doctor", width: 44, value: (doctor) => doctor.doctorName },
          { header: "Clinic", width: 42, value: (doctor) => doctor.clinicName || "" },
          { header: "Fee", width: 22, value: (doctor) => formatCurrency(doctor.consultationFees) },
          { header: "Appointments", width: 24, value: (doctor) => doctor.appointments },
          { header: "Revenue", width: 28, value: (doctor) => formatCurrency(doctor.revenue) },
          { header: "Last Visit", width: 32, value: (doctor) => formatDate(doctor.lastAppointmentAt) },
        ],
        rows: sortByNumberDesc(doctorConsultation, "revenue"),
      };

    case "revenue-monthly": {
      const topMonth = revenueTrend.reduce(
        (winner, item) => (Number(item.revenue || 0) > Number(winner?.revenue || 0) ? item : winner),
        revenueTrend[0] || null
      );

      return {
        title: reportTitle,
        subtitle: "Monthly revenue trend from completed consultations in the backend.",
        summary: [
          { label: "Total collected", value: formatCurrency(summary.totalPaymentCollected) },
          { label: "Months tracked", value: revenueTrend.length },
          { label: "Top month", value: topMonth ? `${topMonth.month} (${formatCurrency(topMonth.revenue)})` : "-" },
        ],
        columns: [
          { header: "Month", width: 52, value: (item) => item.month },
          { header: "Revenue", width: 52, value: (item) => formatCurrency(item.revenue) },
        ],
        rows: revenueTrend,
      };
    }

    case "revenue-quarterly": {
      const topQuarter = quarterlyRevenue.reduce(
        (winner, item) => (Number(item.revenue || 0) > Number(winner?.revenue || 0) ? item : winner),
        quarterlyRevenue[0] || null
      );

      return {
        title: reportTitle,
        subtitle: "Quarterly revenue grouped from backend appointment history.",
        summary: [
          { label: "Total collected", value: formatCurrency(summary.totalPaymentCollected) },
          { label: "Quarter groups", value: quarterlyRevenue.length },
          { label: "Top quarter", value: topQuarter ? `${topQuarter.period} (${formatCurrency(topQuarter.revenue)})` : "-" },
        ],
        columns: [
          { header: "Period", width: 54, value: (item) => item.period },
          { header: "Revenue", width: 42, value: (item) => formatCurrency(item.revenue) },
          { header: "Appointments", width: 30, value: (item) => item.appointments },
        ],
        rows: quarterlyRevenue,
      };
    }

    case "revenue-annual":
      return {
        title: reportTitle,
        subtitle: "Yearly revenue totals calculated from completed backend consultations.",
        summary: [
          { label: "Total collected", value: formatCurrency(summary.totalPaymentCollected) },
          { label: "Years covered", value: yearlyRevenue.length },
          { label: "Total appointments", value: sumBy(yearlyRevenue, (item) => item.appointments) },
        ],
        columns: [
          { header: "Year", width: 32, value: (item) => item.period },
          { header: "Revenue", width: 42, value: (item) => formatCurrency(item.revenue) },
          { header: "Appointments", width: 30, value: (item) => item.appointments },
        ],
        rows: yearlyRevenue,
      };

    case "plan-active":
      return {
        title: reportTitle,
        subtitle: "Active subscription plans stored in the backend plan collection.",
        summary: [
          { label: "Active plans", value: activePlans.length },
          { label: "Total plans", value: plans.length },
          { label: "Billing cycles", value: Object.keys(catalog?.subscriptionSummary?.billingCycleBreakdown || {}).length },
        ],
        columns: [
          { header: "Plan", width: 40, value: (plan) => plan.subscriptionPlan },
          { header: "Billing Cycle", width: 30, value: (plan) => plan.billingCycle },
          { header: "Price", width: 24, value: (plan) => formatCurrency(plan.price) },
          { header: "Modules", width: 30, value: (plan) => `${countTruthy(plan.modules)} active` },
          { header: "Status", width: 22, value: (plan) => plan.status },
          { header: "Renewal", width: 32, value: (plan) => formatDate(plan.planEndRenewalDate) },
        ],
        rows: sortByDateDesc(activePlans, "createdAt"),
      };

    case "plan-expired":
      return {
        title: reportTitle,
        subtitle: "Plans that are not currently active in the backend subscription collection.",
        summary: [
          { label: "Expired plans", value: inactivePlans.length },
          { label: "Total plans", value: plans.length },
          { label: "Active plans", value: activePlans.length },
        ],
        columns: [
          { header: "Plan", width: 40, value: (plan) => plan.subscriptionPlan },
          { header: "Billing Cycle", width: 30, value: (plan) => plan.billingCycle },
          { header: "Price", width: 24, value: (plan) => formatCurrency(plan.price) },
          { header: "Status", width: 22, value: (plan) => plan.status },
          { header: "Renewal", width: 32, value: (plan) => formatDate(plan.planEndRenewalDate) },
          { header: "Features", width: 38, value: (plan) => `${countTruthy(plan.modules)} modules` },
        ],
        rows: sortByDateDesc(inactivePlans, "createdAt"),
      };

    case "plan-renewal":
      return {
        title: reportTitle,
        subtitle: "Upcoming plan renewals from backend subscription records.",
        summary: [
          { label: "Plans due", value: plans.filter((plan) => plan.status === "Active").length },
          { label: "Total plans", value: plans.length },
          { label: "Earliest renewal", value: plans.length ? formatDate(sortByDateAsc(plans, "planEndRenewalDate")[0]?.planEndRenewalDate) : "-" },
        ],
        columns: [
          { header: "Plan", width: 40, value: (plan) => plan.subscriptionPlan },
          { header: "Billing Cycle", width: 30, value: (plan) => plan.billingCycle },
          { header: "Renewal Date", width: 34, value: (plan) => formatDate(plan.planEndRenewalDate) },
          { header: "Trial Days", width: 24, value: (plan) => plan.trialPeriodDays || 0 },
          { header: "Status", width: 22, value: (plan) => plan.status },
          { header: "Price", width: 24, value: (plan) => formatCurrency(plan.price) },
        ],
        rows: sortByDateAsc(plans, "planEndRenewalDate"),
      };

    case "verification-pending":
      return {
        title: reportTitle,
        subtitle: "Clinics awaiting final verification steps in the backend.",
        summary: [
          { label: "Pending reviews", value: pendingClinics.length },
          { label: "Approved", value: getSummaryValue(verificationSummary, "APPROVED") },
          { label: "Rejected", value: getSummaryValue(verificationSummary, "REJECTED") },
        ],
        columns: [
          { header: "Clinic", width: 48, value: (clinic) => clinic.name },
          { header: "Verification", width: 34, value: (clinic) => clinic.verificationStatus },
          { header: "Subscription", width: 30, value: (clinic) => clinic.subscriptionType },
          { header: "Contact", width: 48, value: (clinic) => clinic.contactEmail },
        ],
        rows: sortByDateDesc(pendingClinics, "createdAt"),
      };

    case "verification-approved":
      return {
        title: reportTitle,
        subtitle: "Approved clinic records and verification timestamps.",
        summary: [
          { label: "Approved clinics", value: approvedClinics.length },
          { label: "Total clinics", value: clinics.length },
          { label: "Active clinics", value: activeClinicCount },
        ],
        columns: [
          { header: "Clinic", width: 52, value: (clinic) => clinic.name },
          { header: "Subscription", width: 30, value: (clinic) => clinic.subscriptionType },
          { header: "Contact", width: 46, value: (clinic) => clinic.contactEmail },
          { header: "Approved on", width: 34, value: (clinic) => formatDate(clinic.updatedAt || clinic.createdAt) },
        ],
        rows: sortByDateDesc(approvedClinics, "updatedAt"),
      };

    case "verification-rejected":
      return {
        title: reportTitle,
        subtitle: "Rejected clinic records with backend rejection reason details.",
        summary: [
          { label: "Rejected clinics", value: rejectedClinics.length },
          { label: "Pending reviews", value: pendingClinics.length },
          { label: "Total clinics", value: clinics.length },
        ],
        columns: [
          { header: "Clinic", width: 52, value: (clinic) => clinic.name },
          { header: "Reason", width: 74, value: (clinic) => clinic.rejectionReason || "Not provided" },
          { header: "Contact", width: 46, value: (clinic) => clinic.contactEmail },
          { header: "Submitted", width: 34, value: (clinic) => formatDate(clinic.createdAt) },
        ],
        rows: sortByDateDesc(rejectedClinics, "updatedAt"),
      };

    case "module-coverage":
      return {
        title: reportTitle,
        subtitle: "Plan module availability and coverage from backend subscription plans.",
        summary: [
          { label: "Total plans", value: plans.length },
          { label: "Lab-enabled plans", value: plans.filter((plan) => plan.modules?.lab).length },
          { label: "API-access plans", value: plans.filter((plan) => plan.modules?.apiAccess).length },
        ],
        columns: [
          { header: "Plan", width: 42, value: (plan) => plan.subscriptionPlan },
          { header: "Modules active", width: 28, value: (plan) => `${countTruthy(plan.modules)} of 6` },
          { header: "Lab", width: 20, value: (plan) => (plan.modules?.lab ? "Yes" : "No") },
          { header: "Grooming", width: 22, value: (plan) => (plan.modules?.grooming ? "Yes" : "No") },
          { header: "Kennel", width: 20, value: (plan) => (plan.modules?.kennel ? "Yes" : "No") },
          { header: "Pharmacy", width: 24, value: (plan) => (plan.modules?.onlinePharmacy ? "Yes" : "No") },
          { header: "API", width: 18, value: (plan) => (plan.modules?.apiAccess ? "Yes" : "No") },
          { header: "White Label", width: 28, value: (plan) => (plan.modules?.whiteLabelBranding ? "Yes" : "No") },
        ],
        rows: sortByDateDesc(plans, "createdAt"),
      };

    case "storage-limits":
      return {
        title: reportTitle,
        subtitle: "Storage and quota limits configured on backend subscription plans.",
        summary: [
          { label: "Total plans", value: plans.length },
          {
            label: "Average storage",
            value: plans.length
              ? formatStorage(
                  sumBy(plans, (plan) => plan.featureLimits?.storageLimitGb) / Math.max(plans.length, 1)
                )
              : formatStorage(0),
          },
          { label: "Max storage", value: formatStorage(Math.max(...plans.map((plan) => Number(plan.featureLimits?.storageLimitGb || 0)), 0)) },
        ],
        columns: [
          { header: "Plan", width: 42, value: (plan) => plan.subscriptionPlan },
          { header: "Storage GB", width: 26, value: (plan) => formatStorage(plan.featureLimits?.storageLimitGb ?? 0) },
          { header: "Staff Limit", width: 24, value: (plan) => plan.featureLimits?.maxStaffAccounts ?? 0 },
          { header: "Doctor Limit", width: 24, value: (plan) => plan.featureLimits?.maxDoctors ?? 0 },
          { header: "Unlimited Pets", width: 28, value: (plan) => (plan.featureLimits?.maxPetRecordsUnlimited ? "Yes" : "No") },
          { header: "Status", width: 22, value: (plan) => plan.status },
        ],
        rows: sortByNumberDesc(plans, "featureLimits.storageLimitGb"),
      };

    case "feature-limits":
      return {
        title: reportTitle,
        subtitle: "Feature gate coverage and limits across all subscription plans.",
        summary: [
          { label: "Total plans", value: plans.length },
          { label: "Unlimited pet record plans", value: plans.filter((plan) => plan.featureLimits?.maxPetRecordsUnlimited).length },
          { label: "Active plans", value: activePlans.length },
        ],
        columns: [
          { header: "Plan", width: 40, value: (plan) => plan.subscriptionPlan },
          { header: "Staff", width: 24, value: (plan) => plan.featureLimits?.maxStaffAccounts ?? 0 },
          { header: "Doctors", width: 24, value: (plan) => plan.featureLimits?.maxDoctors ?? 0 },
          { header: "Pet Records", width: 24, value: (plan) => (plan.featureLimits?.maxPetRecordsUnlimited ? "Unlimited" : plan.featureLimits?.maxPetRecords ?? 0) },
          { header: "Status", width: 22, value: (plan) => plan.status },
          { header: "Renewal", width: 34, value: (plan) => formatDate(plan.planEndRenewalDate) },
        ],
        rows: sortByDateDesc(plans, "createdAt"),
      };

    default:
      return {
        title: reportTitle,
        subtitle: `${category?.title || "Report"} generated from backend data.`,
        summary: [{ label: "Records", value: 0 }],
        columns: [{ header: "Record", width: 160, value: () => "No backend mapping configured for this report." }],
        rows: [],
      };
  }
};

export const downloadReportSnapshot = ({ category, report, catalog }) => {
  if (!catalog) {
    throw new Error("Backend report data is still loading.");
  }

  const blueprint = getReportBlueprint({ category, report, catalog });
  const doc = new jsPDF("l", "mm", "a4");
  const stamp = new Date(catalog.generatedAt || Date.now()).toISOString().slice(0, 10);
  const fileName = `${sanitizeFileNamePart(category?.title) || "report"}-${sanitizeFileNamePart(
    report?.key || report?.title || "export"
  )}-${stamp}.pdf`;

  let cursorY = renderTitle(
    doc,
    blueprint.title,
    blueprint.subtitle,
    catalog.generatedAt || new Date().toISOString()
  );

  cursorY = renderSummarySection(doc, blueprint.summary || [], cursorY);
  cursorY = renderTable(doc, { ...blueprint, startY: cursorY });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  const footerText = `Source: backend super-admin report catalog. Generated ${formatDateTime(
    catalog.generatedAt || new Date().toISOString()
  )}.`;
  const footerY = Math.max(cursorY + 4, PAGE_MARGIN + 6);
  doc.text(footerText, PAGE_MARGIN, footerY);

  doc.save(fileName);
};
