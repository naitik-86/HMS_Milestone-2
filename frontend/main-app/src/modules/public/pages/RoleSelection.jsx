import { ArrowLeft, BriefcaseBusiness, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../shared/api/axios";
import { getDashboardPathForRole, normalizeRole } from "../../../shared/utils/roleRedirects";

const labelForRole = (role) => String(role).replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function RoleSelection() {
  const navigate = useNavigate();

  // Two ways to land here:
  // 1. Straight after OTP verify, before any session token exists yet -
  //    sessionStorage holds a short-lived roleSelectionToken.
  // 2. Already logged in and using the "Switch Role" button from a
  //    dashboard - localStorage already has a real session token, so the
  //    switch goes through the protected /auth/switch-role endpoint instead.
  const roleSelectionToken = sessionStorage.getItem("roleSelectionToken");
  const isSwitching = !roleSelectionToken && Boolean(localStorage.getItem("token"));

  const [roles] = useState(() => {
    const source = roleSelectionToken ? sessionStorage : localStorage;
    try {
      return JSON.parse(source.getItem("availableRoles") || "[]");
    } catch {
      return [];
    }
  });
  const currentRole = normalizeRole(localStorage.getItem("role") || "");
  const [loadingRole, setLoadingRole] = useState("");

  const chooseRole = async (role) => {
    setLoadingRole(role);
    try {
      const { data } = isSwitching
        ? await API.post("/auth/switch-role", { role })
        : await API.post("/auth/select-role", { roleSelectionToken, role });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", normalizeRole(data.role));
      localStorage.setItem("availableRoles", JSON.stringify(data.roles || roles));
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      sessionStorage.removeItem("roleSelectionToken");
      sessionStorage.removeItem("availableRoles");
      const dashboard = getDashboardPathForRole(data.role);
      navigate(dashboard || "/unauthorized", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to select this role.");
      if (error.response?.status === 401) navigate("/login", { replace: true });
    } finally {
      setLoadingRole("");
    }
  };

  if (!roles.length || (!roleSelectionToken && !isSwitching)) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 flex items-center justify-center">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        {isSwitching && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
        )}
        <BriefcaseBusiness className="h-10 w-10 text-emerald-700" />
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Choose a dashboard</h1>
        <p className="mt-2 text-slate-600">Select the role you want to use for this session.</p>
        <div className="mt-7 space-y-3">
          {roles.map((role) => {
            const isCurrent = isSwitching && normalizeRole(role) === currentRole;
            return (
              <button
                key={role}
                type="button"
                onClick={() => chooseRole(role)}
                disabled={Boolean(loadingRole) || isCurrent}
                className="w-full rounded-2xl border border-slate-200 p-5 text-left flex items-center gap-4 hover:border-emerald-600 hover:bg-emerald-50 disabled:opacity-60"
              >
                <span className="flex-1">
                  <span className="block font-semibold text-slate-900">
                    Continue as {labelForRole(role)}
                    {isCurrent && <span className="ml-2 text-xs font-medium text-emerald-700">(current)</span>}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">Open {labelForRole(role)} Dashboard</span>
                </span>
                <ChevronRight className="text-emerald-700" />
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
