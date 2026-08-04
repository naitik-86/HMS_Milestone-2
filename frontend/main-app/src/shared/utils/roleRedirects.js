export const normalizeRole = (role) =>
  role
    ? role.toUpperCase().replace(/[\s-]+/g, "_").replace(/_+/g, "_")
    : "";

const DASHBOARD_PATHS = {
  SUPER_ADMIN: "/superadmin",
  CLINIC_ADMIN: "/clinic",
  DOCTOR: "/clinic/doctor",
  RECEPTIONIST: "/clinic/reception",
  PRE_CONSULTATION: "/clinic/preconsultation",
  PRE_CONSULTATION_STAFF: "/clinic/preconsultation",
  PARA_MEDICAL: "/clinic/preconsultation",
  LAB_TECHNICIAN: "/clinic/lab",
  GROOMER: "/coming-soon",
  KENNEL: "/coming-soon",
  KENNEL_STAFF: "/coming-soon",
  PHARMACIST: "/coming-soon",
  PHARMACY: "/coming-soon",
  OWNER: "/clinic/owner",
};

export const getDashboardPathForRole = (role) =>
  DASHBOARD_PATHS[normalizeRole(role)] || null;

// The full list of roles assigned to the currently logged-in staff member,
// stored on login/role-select/role-switch. Empty array for non-staff
// accounts (Super Admin / Clinic Admin never set this) or a single-role
// staff member who only ever had one role to begin with.
export const getAvailableRoles = () => {
  try {
    const roles = JSON.parse(localStorage.getItem("availableRoles") || "[]");
    return Array.isArray(roles) ? roles : [];
  } catch {
    return [];
  }
};
