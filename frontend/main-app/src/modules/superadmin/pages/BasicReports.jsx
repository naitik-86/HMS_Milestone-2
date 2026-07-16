import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  downloadSuperAdminBasicReport,
  fetchSuperAdminBasicReports,
  shareSuperAdminBasicReport,
} from "./basicReportsApi";

const ACCENT = "#E8630A";
const INDIGO = "#6366F1";
const GREEN = "#22C55E";
const COLORS = [INDIGO, ACCENT, GREEN, "#F59E0B"];

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #E8ECF0",
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

const KPI = ({ label, value, color, sub, badge = "●" }) => (
  <Card>
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 28,
            fontWeight: 900,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub ? <div style={{ marginTop: 8, fontSize: 13, color: "#64748B" }}>{sub}</div> : null}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: badge === "₹" ? 16 : 13,
          color,
          flexShrink: 0,
        }}
      >
        {badge}
      </div>
    </div>
  </Card>
);

const formatDownloadName = (format) => {
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "csv") {
    return `superadmin-basic-report-${stamp}.csv`;
  }

  if (format === "xls" || format === "xlsx" || format === "excel") {
    return `superadmin-basic-report-${stamp}.xls`;
  }

  return `superadmin-basic-report-${stamp}.pdf`;
};

const parseFilename = (contentDisposition, fallbackName) => {
  if (!contentDisposition) return fallbackName;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return fallbackName;
};

const triggerDownload = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 0);
};

const toBlob = (data, contentType = "application/octet-stream") => {
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    return data;
  }

  return new Blob([data], { type: contentType });
};

const formatDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function BasicReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalClinics, setTotalClinics] = useState(0);
  const [activeClinics, setActiveClinics] = useState(0);
  const [inactiveClinics, setInactiveClinics] = useState(0);
  const [totalPaymentCollected, setTotalPaymentCollected] = useState(0);
  const [generatedAt, setGeneratedAt] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [clinicTrendData, setClinicTrendData] = useState([]);
  const [clinicDistribution, setClinicDistribution] = useState([]);
  const [downloadingFormat, setDownloadingFormat] = useState("");
  const [downloadFeedback, setDownloadFeedback] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSubject, setShareSubject] = useState("Super Admin Basic Report");
  const [shareMessage, setShareMessage] = useState(
    "Please find attached the latest super admin report."
  );
  const [shareFormat, setShareFormat] = useState("pdf");
  const [sharing, setSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(null);

  const fmtINR = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }),
    []
  );

  const generatedAtLabel = useMemo(() => formatDateTime(generatedAt), [generatedAt]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchSuperAdminBasicReports();

        if (cancelled) return;

        const fetchedTotalClinics = Number(data?.totalClinics ?? data?.totalClinicOnboarded ?? 0);
        const fetchedActiveClinics = Number(data?.activeClinics ?? 0);
        const fetchedInactiveClinics = Number(data?.suspendedClinics ?? 0);
        const fetchedTotalPayment = Number(data?.totalPaymentCollected ?? data?.totalPayment ?? 0);

        setTotalClinics(fetchedTotalClinics);
        setActiveClinics(fetchedActiveClinics);
        setInactiveClinics(fetchedInactiveClinics);
        setTotalPaymentCollected(fetchedTotalPayment);
        setGeneratedAt(data?.generatedAt || "");
        setRevenueData(Array.isArray(data?.revenueTrend) ? data.revenueTrend : []);
        setClinicTrendData(Array.isArray(data?.clinicTrend) ? data.clinicTrend : []);
        setClinicDistribution(Array.isArray(data?.clinicDistribution) ? data.clinicDistribution : []);
        setLoading(false);
      } catch (fetchError) {
        if (cancelled) return;
        setLoading(false);
        setError(fetchError?.response?.data?.message || fetchError.message || "Failed to load reports");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (format) => {
    setDownloadingFormat(format);
    setDownloadFeedback(null);

    try {
      const res = await downloadSuperAdminBasicReport(format);
      const blob = toBlob(res?.data, res?.headers?.["content-type"] || "application/octet-stream");
      const contentDisposition =
        res?.headers?.["content-disposition"] ||
        res?.headers?.["Content-Disposition"] ||
        res?.request?.getResponseHeader?.("content-disposition") ||
        "";
      const fileName = parseFilename(contentDisposition, formatDownloadName(format));

      triggerDownload(blob, fileName);
      setDownloadFeedback({
        type: "success",
        message: `Downloaded ${fileName}.`,
      });
    } catch (downloadError) {
      setDownloadFeedback({
        type: "error",
        message:
          downloadError?.response?.data?.message ||
          downloadError.message ||
          "Failed to download the report.",
      });
    } finally {
      setDownloadingFormat("");
    }
  };

  const handleShare = async (event) => {
    event.preventDefault();

    const recipientEmails = shareEmail.trim();
    if (!recipientEmails) {
      setShareFeedback({
        type: "error",
        message: "Please enter at least one recipient email.",
      });
      return;
    }

    setSharing(true);
    setShareFeedback(null);

    try {
      const result = await shareSuperAdminBasicReport({
        recipientEmail: recipientEmails,
        subject: shareSubject,
        message: shareMessage,
        format: shareFormat,
      });

      setShareFeedback({
        type: "success",
        message: result?.message || "Report shared successfully.",
      });
    } catch (shareError) {
      setShareFeedback({
        type: "error",
        message:
          shareError?.response?.data?.message ||
          shareError.message ||
          "Failed to share the report.",
      });
    } finally {
      setSharing(false);
    }
  };

  const actionButtons = [
    { format: "pdf", label: "Download PDF", color: ACCENT },
    { format: "xls", label: "Download Excel", color: INDIGO },
    { format: "csv", label: "Download CSV", color: GREEN },
  ];

  return (
    <div
      style={{
        background: "#F8F9FB",
        minHeight: "100vh",
        padding: "28px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        fontFamily: '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
        color: "#0F172A",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Basic Reports</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748B" }}>
            Live database-backed analytics for the super admin.
          </p>
          <div style={{ marginTop: 8, fontSize: 12, color: "#94A3B8" }}>
            {generatedAtLabel ? `Last refreshed: ${generatedAtLabel}` : "Refreshing live data from the database."}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Export report
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {actionButtons.map((button) => {
              const isBusy = downloadingFormat === button.format || sharing;

              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => handleDownload(button.format)}
                  disabled={isBusy}
                  style={{
                    background: button.color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isBusy ? "not-allowed" : "pointer",
                    opacity: isBusy ? 0.7 : 1,
                  }}
                >
                  {downloadingFormat === button.format ? "Preparing..." : button.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
            Each export is generated from the latest data stored in the database.
          </div>
          {downloadFeedback?.message ? (
            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 600,
                color: downloadFeedback.type === "success" ? "#166534" : "#B91C1C",
              }}
            >
              {downloadFeedback.message}
            </div>
          ) : null}
        </Card>

        <Card>
          <form onSubmit={handleShare}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
              Share by email
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                Recipient email(s)
                <input
                  type="text"
                  value={shareEmail}
                  onChange={(event) => setShareEmail(event.target.value)}
                  placeholder="admin@example.com, accounts@example.com"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #D7DDE5",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                    background: "#fff",
                  }}
                />
              </label>

              <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                Subject
                <input
                  type="text"
                  value={shareSubject}
                  onChange={(event) => setShareSubject(event.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #D7DDE5",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                    background: "#fff",
                  }}
                />
              </label>

              <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                Message
                <textarea
                  value={shareMessage}
                  onChange={(event) => setShareMessage(event.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #D7DDE5",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    background: "#fff",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                  Report format
                  <select
                    value={shareFormat}
                    onChange={(event) => setShareFormat(event.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      border: "1px solid #D7DDE5",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 14,
                      outline: "none",
                      background: "#fff",
                    }}
                  >
                    <option value="pdf">PDF</option>
                    <option value="xls">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={sharing}
                  style={{
                    background: ACCENT,
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "11px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: sharing ? "not-allowed" : "pointer",
                    opacity: sharing ? 0.75 : 1,
                    height: 42,
                  }}
                >
                  {sharing ? "Sharing..." : "Share report"}
                </button>
              </div>
            </div>

            {shareFeedback?.message ? (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  color: shareFeedback.type === "success" ? "#166534" : "#B91C1C",
                }}
              >
                {shareFeedback.message}
              </div>
            ) : null}

            <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
              You can separate multiple emails with commas or semicolons.
            </div>
          </form>
        </Card>
      </div>

      {loading ? (
        <Card>Loading platform analytics...</Card>
      ) : error ? (
        <Card>
          <div style={{ fontWeight: 800, color: "#B91C1C" }}>Error</div>
          <div style={{ marginTop: 8, color: "#64748B", fontSize: 13 }}>{error}</div>
        </Card>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <KPI
              label="Total clinics"
              value={totalClinics}
              color={INDIGO}
              sub="Registered clinics in the system"
              badge="TC"
            />
            <KPI
              label="Active clinics"
              value={activeClinics}
              color={GREEN}
              sub="Clinics with active subscriptions"
              badge="AC"
            />
            <KPI
              label="Inactive clinics"
              value={inactiveClinics}
              color={ACCENT}
              sub="Suspended or expired clinics"
              badge="IC"
            />
            <KPI
              label="Total payment collected"
              value={`₹${fmtINR.format(totalPaymentCollected)}`}
              color={ACCENT}
              sub="Completed consultation revenue"
              badge="₹"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Revenue Trend</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Monthly payment collection overview</div>
              </div>
              <div style={{ height: 250, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${Math.round(Number(value || 0) / 1000)}k`}
                    />
                    <Tooltip formatter={(value) => [`₹${fmtINR.format(Number(value || 0))}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={ACCENT}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Clinic Onboarding Rate</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>New clinics registered per month</div>
              </div>
              <div style={{ height: 250, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clinicTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip formatter={(value) => [value, "New clinics"]} cursor={{ fill: "#F8F9FB" }} />
                    <Bar dataKey="clinics" fill={INDIGO} radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: 16,
            }}
          >
            <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Clinic Status Distribution</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Breakdown by subscription states</div>
              </div>
              <div style={{ height: 250, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clinicDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {clinicDistribution.map((entry, index) => (
                        <Cell key={`cell-${entry.name || index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Clinics"]} />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      wrapperStyle={{ fontSize: 12, color: "#64748B" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Data Summary & Details</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>What these metrics represent</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                <div style={{ padding: 12, background: "#EEF2FF", borderRadius: 8, borderLeft: `4px solid ${INDIGO}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: INDIGO }}>Clinic Acquisition</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                    The bar chart illustrates monthly growth. The current total base stands at{" "}
                    <strong>{totalClinics}</strong> clinics system-wide.
                  </div>
                </div>

                <div style={{ padding: 12, background: "#FFF7ED", borderRadius: 8, borderLeft: `4px solid ${ACCENT}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>Financial Performance</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                    The line chart tracks the revenue stream. Platform aggregate revenue is currently{" "}
                    <strong>₹{fmtINR.format(totalPaymentCollected)}</strong>.
                  </div>
                </div>

                <div style={{ padding: 12, background: "#F0FDF4", borderRadius: 8, borderLeft: `4px solid ${GREEN}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>Account Health</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                    The donut chart segments the active, suspended and expired clinic states so you can spot churn at a glance.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      <div style={{ marginTop: 12, fontSize: 12, color: "#94A3B8" }}>
        Reports are generated live from <code>/super-admin-reports/basic</code>, with download and email sharing available above.
      </div>
    </div>
  );
}
