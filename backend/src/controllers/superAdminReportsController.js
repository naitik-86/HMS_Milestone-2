const PDFDocument = require("pdfkit");
const Clinic = require("../models/Clinic");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/DoctorDetails");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const sendEmail = require("../utils/emailService");

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const REPORT_COLORS = {
  accent: "#E8630A",
  indigo: "#6366F1",
  green: "#22C55E",
  amber: "#F59E0B",
  rose: "#EF4444",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const normalizeDate = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const buildMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (date) =>
  MONTH_NAMES[date.getMonth()] || date.toLocaleString("en-US", { month: "short" });

const getMonthDate = (baseDate, offset) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() - offset, 1);

const toCurrency = (value) => `INR ${formatINR(value)}`;

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const parseEmailList = (value) => {
  if (!value) return [];

  const rawValues = Array.isArray(value)
    ? value
    : String(value)
        .split(/[,;]+/)
        .map((item) => item.trim());

  return [...new Set(rawValues.filter((email) => EMAIL_REGEX.test(email)))];
};

const buildMonthlySeries = (aggregation, fieldName, months = 6) => {
  const today = new Date();
  const values = new Map(
    aggregation.map((item) => [
      buildMonthKey(new Date(item._id.year, item._id.month - 1, 1)),
      Number(item[fieldName] || 0),
    ])
  );

  const series = [];
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const monthDate = getMonthDate(today, offset);
    series.push({
      month: monthLabel(monthDate),
      value: Number(values.get(buildMonthKey(monthDate)) || 0),
    });
  }

  return series;
};

const buildPdfBuffer = async (reportData) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(22).fillColor("#111827").text("Super Admin Report", {
      align: "center",
    });
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(10).fillColor("#6B7280").text(
      `Generated on ${new Date().toLocaleString("en-IN")}`,
      { align: "center" }
    );

    doc.moveDown(1.2);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Summary");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor("#374151");
    doc.text(`- Total clinics: ${reportData.totalClinics}`);
    doc.text(`- Active clinics: ${reportData.activeClinics}`);
    doc.text(`- Suspended clinics: ${reportData.suspendedClinics}`);
    doc.text(`- Total payment collected: ${toCurrency(reportData.totalPaymentCollected)}`);

    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Revenue Trend");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor("#374151");
    reportData.revenueTrend.forEach((item) => {
      doc.text(`- ${item.month}: ${toCurrency(item.revenue)}`);
    });

    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Clinic Onboarding");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor("#374151");
    reportData.clinicTrend.forEach((item) => {
      doc.text(`- ${item.month}: ${item.clinics} clinics`);
    });

    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text("Subscription Distribution");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor("#374151");
    reportData.clinicDistribution.forEach((item) => {
      doc.text(`- ${item.name}: ${item.value}`);
    });

    doc.end();
  });

const buildCsv = (reportData) => {
  const lines = [];

  lines.push("Section,Metric,Value");
  lines.push(
    [
      csvCell("Summary"),
      csvCell("Total Clinics"),
      csvCell(reportData.totalClinics),
    ].join(",")
  );
  lines.push(
    [
      csvCell("Summary"),
      csvCell("Active Clinics"),
      csvCell(reportData.activeClinics),
    ].join(",")
  );
  lines.push(
    [
      csvCell("Summary"),
      csvCell("Suspended Clinics"),
      csvCell(reportData.suspendedClinics),
    ].join(",")
  );
  lines.push(
    [
      csvCell("Summary"),
      csvCell("Total Payment Collected"),
      csvCell(reportData.totalPaymentCollected),
    ].join(",")
  );

  lines.push("");
  lines.push("Revenue Trend");
  lines.push("Month,Revenue");
  reportData.revenueTrend.forEach((item) => {
    lines.push([csvCell(item.month), csvCell(item.revenue)].join(","));
  });

  lines.push("");
  lines.push("Clinic Onboarding");
  lines.push("Month,Clinics");
  reportData.clinicTrend.forEach((item) => {
    lines.push([csvCell(item.month), csvCell(item.clinics)].join(","));
  });

  lines.push("");
  lines.push("Subscription Distribution");
  lines.push("Status,Count");
  reportData.clinicDistribution.forEach((item) => {
    lines.push([csvCell(item.name), csvCell(item.value)].join(","));
  });

  return lines.join("\n");
};

const buildXlsHtml = (reportData) => {
  const summaryRows = [
    ["Total Clinics", reportData.totalClinics],
    ["Active Clinics", reportData.activeClinics],
    ["Suspended Clinics", reportData.suspendedClinics],
    ["Total Payment Collected", toCurrency(reportData.totalPaymentCollected)],
  ]
    .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
    .join("");

  const revenueRows = reportData.revenueTrend
    .map((item) => `<tr><td>${item.month}</td><td>${toCurrency(item.revenue)}</td></tr>`)
    .join("");

  const clinicRows = reportData.clinicTrend
    .map((item) => `<tr><td>${item.month}</td><td>${item.clinics}</td></tr>`)
    .join("");

  const distributionRows = reportData.clinicDistribution
    .map((item) => `<tr><td>${item.name}</td><td>${item.value}</td></tr>`)
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #111827; }
    h1, h2 { margin: 0 0 12px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 18px; }
    th, td { border: 1px solid #D1D5DB; padding: 8px 10px; text-align: left; }
    th { background: #F9FAFB; }
  </style>
</head>
<body>
  <h1>Super Admin Report</h1>
  <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
  <h2>Summary</h2>
  <table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>${summaryRows}</tbody></table>
  <h2>Revenue Trend</h2>
  <table><thead><tr><th>Month</th><th>Revenue</th></tr></thead><tbody>${revenueRows}</tbody></table>
  <h2>Clinic Onboarding</h2>
  <table><thead><tr><th>Month</th><th>Clinics</th></tr></thead><tbody>${clinicRows}</tbody></table>
  <h2>Subscription Distribution</h2>
  <table><thead><tr><th>Status</th><th>Count</th></tr></thead><tbody>${distributionRows}</tbody></table>
</body>
</html>`;
};

const buildReportData = async () => {
  const totalClinics = await Clinic.countDocuments();
  const activeClinics = await Clinic.countDocuments({ subscriptionStatus: "ACTIVE" });
  const suspendedClinics = await Clinic.countDocuments({
    subscriptionStatus: { $in: ["SUSPENDED", "EXPIRED"] },
  });

  const revenueAggregation = await Appointment.aggregate([
    {
      $match: {
        status: "COMPLETED",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: {
        path: "$doctor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        fee: { $ifNull: ["$doctor.consultationFee", 0] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
        },
        revenue: { $sum: "$fee" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const clinicTrendAggregation = await Clinic.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        clinics: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const subscriptionAggregation = await Clinic.aggregate([
    {
      $group: {
        _id: "$subscriptionStatus",
        value: { $sum: 1 },
      },
    },
  ]);

  const revenueByMonth = new Map(
    revenueAggregation.map((item) => [
      buildMonthKey(new Date(item._id.year, item._id.month - 1, 1)),
      Number(item.revenue || 0),
    ])
  );

  const clinicByMonth = new Map(
    clinicTrendAggregation.map((item) => [
      buildMonthKey(new Date(item._id.year, item._id.month - 1, 1)),
      Number(item.clinics || 0),
    ])
  );

  const now = new Date();
  const revenueTrend = [];
  const clinicTrend = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const monthDate = getMonthDate(now, offset);
    const monthKey = buildMonthKey(monthDate);

    revenueTrend.push({
      month: monthLabel(monthDate),
      revenue: Number(revenueByMonth.get(monthKey) || 0),
    });

    clinicTrend.push({
      month: monthLabel(monthDate),
      clinics: Number(clinicByMonth.get(monthKey) || 0),
    });
  }

  const clinicDistribution = [
    {
      name: "Active",
      value: activeClinics,
      color: REPORT_COLORS.green,
    },
    {
      name: "Suspended",
      value: suspendedClinics,
      color: REPORT_COLORS.amber,
    },
    {
      name: "Expired",
      value: Number(
        subscriptionAggregation.find((item) => item._id === "EXPIRED")?.value || 0
      ),
      color: REPORT_COLORS.rose,
    },
  ];

  const totalPaymentCollected = revenueAggregation.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  return {
    totalClinics,
    activeClinics,
    suspendedClinics,
    totalPaymentCollected,
    revenueTrend,
    clinicTrend,
    clinicDistribution,
    generatedAt: new Date().toISOString(),
  };
};

const buildClinicPerformanceData = async (clinics) => {
  const clinicIds = clinics.map((clinic) => clinic._id);

  const [doctorCounts, appointmentCounts, doctorUsers] = await Promise.all([
    Doctor.aggregate([
      {
        $match: {
          clinicId: { $in: clinicIds },
        },
      },
      {
        $group: {
          _id: "$clinicId",
          doctorCount: { $sum: 1 },
        },
      },
    ]),
    Appointment.aggregate([
      {
        $match: {
          clinicId: { $in: clinicIds },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: {
          path: "$doctor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          fee: { $ifNull: ["$doctor.consultationFee", 0] },
        },
      },
      {
        $group: {
          _id: "$clinicId",
          appointmentCount: { $sum: 1 },
          completedAppointments: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0],
            },
          },
          paidAppointments: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
            },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$fee", 0],
            },
          },
          lastAppointmentAt: { $max: "$appointmentDate" },
        },
      },
    ]),
    User.find({ role: "DOCTOR" })
      .select("_id name clinicId specialization practiceType consultationFee isActive createdAt")
      .populate("clinicId", "name")
      .lean(),
  ]);

  const doctorCountByClinic = new Map(
    doctorCounts.map((item) => [String(item._id), Number(item.doctorCount || 0)])
  );

  const appointmentStatsByClinic = new Map(
    appointmentCounts.map((item) => [
      String(item._id),
      {
        appointmentCount: Number(item.appointmentCount || 0),
        completedAppointments: Number(item.completedAppointments || 0),
        paidAppointments: Number(item.paidAppointments || 0),
        revenue: Number(item.revenue || 0),
        lastAppointmentAt: item.lastAppointmentAt || null,
      },
    ])
  );

  return clinics.map((clinic) => {
    const stats = appointmentStatsByClinic.get(String(clinic._id)) || {};
    const doctorCount = doctorCountByClinic.get(String(clinic._id)) || 0;
    const matchingDoctors = doctorUsers.filter((doctor) => String(doctor.clinicId?._id || doctor.clinicId) === String(clinic._id));

    return {
      _id: clinic._id,
      name: clinic.name,
      contactEmail: clinic.contactEmail,
      subscriptionType: clinic.subscriptionType,
      subscriptionStatus: clinic.subscriptionStatus,
      verificationStatus: clinic.verificationStatus,
      expiryDate: clinic.expiryDate,
      createdAt: clinic.createdAt,
      address: clinic.address,
      addressDetails: clinic.addressDetails,
      servicesOffered: clinic.servicesOffered || [],
      doctorCount,
      doctorUserCount: matchingDoctors.length,
      ...stats,
    };
  });
};

const buildDoctorReportData = async (clinics) => {
  const clinicNameMap = new Map(
    clinics.map((clinic) => [String(clinic._id), clinic.name])
  );

  const [doctorRegistry, doctorUsers, doctorAppointments] = await Promise.all([
    Doctor.find()
      .populate("clinicId", "name")
      .select(
        "doctorId name clinicId staffCode experience registrationNumber stateVetCouncil consultationFees avgConsultationDuration emergencyAvailability status certificateValidityDate renewalReminderDays specializations createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean(),
    User.find({ role: "DOCTOR" })
      .select("_id name clinicId specialization consultationFee isActive createdAt updatedAt")
      .populate("clinicId", "name")
      .lean(),
    Appointment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: {
          path: "$doctor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$doctorId",
          doctorName: { $first: "$doctor.name" },
          clinicId: { $first: "$clinicId" },
          appointments: { $sum: 1 },
          completedAppointments: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0],
            },
          },
          paidAppointments: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "PAID"] }, 1, 0],
            },
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "COMPLETED"] },
                { $ifNull: ["$doctor.consultationFee", 0] },
                0,
              ],
            },
          },
          lastAppointmentAt: { $max: "$appointmentDate" },
        },
      },
      {
        $sort: {
          revenue: -1,
          appointments: -1,
        },
      },
    ]),
  ]);

  const doctorAppointmentMap = new Map(
    doctorAppointments.map((item) => [
      String(item._id),
      {
        doctorName: item.doctorName || "",
        clinicId: item.clinicId ? String(item.clinicId) : "",
        appointments: Number(item.appointments || 0),
        completedAppointments: Number(item.completedAppointments || 0),
        paidAppointments: Number(item.paidAppointments || 0),
        revenue: Number(item.revenue || 0),
        lastAppointmentAt: item.lastAppointmentAt || null,
      },
    ])
  );

  const doctorActivity = doctorUsers
    .map((doctor) => {
      const stats = doctorAppointmentMap.get(String(doctor._id)) || {};
      const clinicName = doctor.clinicId?.name || clinicNameMap.get(String(doctor.clinicId?._id || doctor.clinicId)) || "";

      return {
        doctorId: String(doctor._id),
        doctorName: doctor.name,
        clinicId: doctor.clinicId?._id ? String(doctor.clinicId._id) : String(doctor.clinicId || ""),
        clinicName,
        specialization: doctor.specialization || "",
        consultationFees: Number(doctor.consultationFee || 0),
        appointments: Number(stats.appointments || 0),
        completedAppointments: Number(stats.completedAppointments || 0),
        paidAppointments: Number(stats.paidAppointments || 0),
        revenue: Number(stats.revenue || 0),
        lastAppointmentAt: stats.lastAppointmentAt || null,
        status: doctor.isActive ? "Active" : "Inactive",
      };
    })
    .sort(
      (left, right) =>
        Number(right.appointments || 0) - Number(left.appointments || 0) ||
        Number(right.revenue || 0) - Number(left.revenue || 0) ||
        String(left.doctorName || "").localeCompare(String(right.doctorName || ""))
    );

  const doctorActivityMap = new Map(
    doctorActivity.map((item) => [String(item.doctorId), item])
  );

  return {
    registry: doctorRegistry.map((doctor) => ({
      ...doctor,
      clinicName: doctor.clinicId?.name || clinicNameMap.get(String(doctor.clinicId?._id || doctor.clinicId)) || "",
    })),
    activity: doctorActivity,
    consultation: doctorUsers
      .map((doctor) => {
        const activity = doctorActivityMap.get(String(doctor._id)) || {};
        const clinicName = doctor.clinicId?.name || clinicNameMap.get(String(doctor.clinicId?._id || doctor.clinicId)) || "";

        return {
          doctorId: String(doctor._id),
          doctorName: doctor.name,
          clinicId: doctor.clinicId?._id ? String(doctor.clinicId._id) : String(doctor.clinicId || ""),
          clinicName,
          consultationFees: Number(doctor.consultationFee || 0),
          status: doctor.isActive ? "Active" : "Inactive",
          appointments: Number(activity.appointments || 0),
          completedAppointments: Number(activity.completedAppointments || 0),
          revenue: Number(activity.revenue || 0),
          lastAppointmentAt: activity.lastAppointmentAt || null,
        };
      })
      .sort(
        (left, right) =>
          Number(right.revenue || 0) - Number(left.revenue || 0) ||
          Number(right.appointments || 0) - Number(left.appointments || 0) ||
          String(left.doctorName || "").localeCompare(String(right.doctorName || ""))
      ),
  };
};

const buildSubscriptionReportData = async () => {
  const plans = await SubscriptionPlan.find()
    .select(
      "planCode subscriptionPlan billingCycle price status planStartDate planEndRenewalDate trialPeriodDays discountPromoCode featureLimits modules subscriptionInvoice createdAt updatedAt"
    )
    .sort({ createdAt: -1 })
    .lean();

  const activePlans = plans.filter((plan) => plan.status === "Active");
  const expiredPlans = plans.filter((plan) => plan.status !== "Active");

  return {
    plans: plans.map((plan) => ({
      ...plan,
      activeModuleCount: Object.values(plan.modules || {}).filter(Boolean).length,
    })),
    summary: {
      totalPlans: plans.length,
      activePlans: activePlans.length,
      expiredPlans: expiredPlans.length,
      billingCycleBreakdown: plans.reduce((accumulator, plan) => {
        const key = plan.billingCycle || "Unknown";
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      }, {}),
    },
  };
};

const buildRevenuePeriodData = async () => {
  const revenueByQuarter = await Appointment.aggregate([
    {
      $match: {
        status: "COMPLETED",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: {
        path: "$doctor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        fee: { $ifNull: ["$doctor.consultationFee", 0] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$appointmentDate" },
          quarter: { $ceil: { $divide: [{ $month: "$appointmentDate" }, 3] } },
        },
        revenue: { $sum: "$fee" },
        appointments: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.quarter": 1,
      },
    },
  ]);

  const revenueByYear = await Appointment.aggregate([
    {
      $match: {
        status: "COMPLETED",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: {
        path: "$doctor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        fee: { $ifNull: ["$doctor.consultationFee", 0] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$appointmentDate" },
        },
        revenue: { $sum: "$fee" },
        appointments: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
      },
    },
  ]);

  return {
    quarterlyRevenue: revenueByQuarter.map((item) => ({
      period: `Q${item._id.quarter} ${item._id.year}`,
      revenue: Number(item.revenue || 0),
      appointments: Number(item.appointments || 0),
    })),
    yearlyRevenue: revenueByYear.map((item) => ({
      period: String(item._id.year),
      revenue: Number(item.revenue || 0),
      appointments: Number(item.appointments || 0),
    })),
  };
};

exports.getSuperAdminReportCatalog = async (req, res) => {
  try {
    const [basicReport, clinics, subscriptionReportData] = await Promise.all([
      buildReportData(),
      Clinic.find()
        .select(
          "name contactEmail subscriptionType subscriptionStatus verificationStatus expiryDate createdAt address addressDetails servicesOffered"
        )
        .sort({ createdAt: -1 })
        .lean(),
      buildSubscriptionReportData(),
    ]);

    const clinicPerformance = await buildClinicPerformanceData(clinics);
    const doctorReport = await buildDoctorReportData(clinics);
    const revenuePeriods = await buildRevenuePeriodData();

    const verificationSummary = clinics.reduce(
      (accumulator, clinic) => {
        const status = clinic.verificationStatus || "UNKNOWN";
        accumulator[status] = (accumulator[status] || 0) + 1;
        return accumulator;
      },
      {
        SUBMITTED: 0,
        UNDER_REVIEW: 0,
        DOCS_VERIFIED: 0,
        APPROVED: 0,
        REJECTED: 0,
      }
    );

    const summary = {
      ...basicReport,
      totalDoctors: doctorReport.registry.length,
      activeDoctors: doctorReport.registry.filter((doctor) => doctor.status === "Active").length,
      inactiveDoctors: doctorReport.registry.filter((doctor) => doctor.status !== "Active").length,
      totalPlans: subscriptionReportData.summary.totalPlans,
      activePlans: subscriptionReportData.summary.activePlans,
      expiredPlans: subscriptionReportData.summary.expiredPlans,
      verificationSummary,
    };

    return res.status(200).json({
      success: true,
      data: {
        generatedAt: basicReport.generatedAt,
        summary,
        clinics,
        clinicPerformance,
        doctorRegistry: doctorReport.registry,
        doctorActivity: doctorReport.activity,
        doctorConsultation: doctorReport.consultation,
        plans: subscriptionReportData.plans,
        subscriptionSummary: subscriptionReportData.summary,
        revenueTrend: basicReport.revenueTrend,
        clinicTrend: basicReport.clinicTrend,
        clinicDistribution: basicReport.clinicDistribution,
        quarterlyRevenue: revenuePeriods.quarterlyRevenue,
        yearlyRevenue: revenuePeriods.yearlyRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSuperAdminBasicReports = async (req, res) => {
  try {
    const reportData = await buildReportData();

    return res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadSuperAdminBasicReport = async (req, res) => {
  try {
    const reportData = await buildReportData();
    const format = String(req.query.format || "pdf").toLowerCase();
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      const fileName = `superadmin-basic-report-${stamp}.csv`;
      const csv = buildCsv(reportData);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(csv);
    }

    if (format === "xls" || format === "xlsx" || format === "excel") {
      const fileName = `superadmin-basic-report-${stamp}.xls`;
      const html = buildXlsHtml(reportData);
      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.status(200).send(html);
    }

    const pdfBuffer = await buildPdfBuffer(reportData);
    const fileName = `superadmin-basic-report-${stamp}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.shareSuperAdminBasicReport = async (req, res) => {
  try {
    const recipients = parseEmailList(req.body?.recipientEmail || req.body?.email || req.body?.recipients);
    const subject = String(req.body?.subject || "Super Admin Report").trim();
    const message = String(
      req.body?.message || "Please find the attached super admin report."
    ).trim();
    const format = String(req.body?.format || "pdf").toLowerCase();

    if (!recipients.length) {
      return res.status(400).json({
        success: false,
        message: "A valid recipient email is required",
      });
    }

    const reportData = await buildReportData();
    let attachment;

    if (format === "csv") {
      attachment = {
        filename: "superadmin-basic-report.csv",
        content: Buffer.from(buildCsv(reportData), "utf8"),
        contentType: "text/csv",
      };
    } else if (format === "xls" || format === "xlsx" || format === "excel") {
      attachment = {
        filename: "superadmin-basic-report.xls",
        content: Buffer.from(buildXlsHtml(reportData), "utf8"),
        contentType: "application/vnd.ms-excel",
      };
    } else {
      attachment = {
        filename: "superadmin-basic-report.pdf",
        content: await buildPdfBuffer(reportData),
        contentType: "application/pdf",
      };
    }

    await Promise.all(
      recipients.map((recipientEmail) =>
        sendEmail({
          email: recipientEmail,
          subject,
          message,
          attachments: [attachment],
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: `Report shared with ${recipients.length} recipient${recipients.length > 1 ? "s" : ""}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
