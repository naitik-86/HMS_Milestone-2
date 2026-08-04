import { Repeat } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Shown in a staff dashboard header only when the logged-in staff member has
// more than one assigned role. Takes them back to /select-role to pick a
// different role's dashboard without logging out and redoing OTP.
export default function SwitchRoleButton({ className = "" }) {
  const navigate = useNavigate();

  let roles;
  try {
    roles = JSON.parse(localStorage.getItem("availableRoles") || "[]");
  } catch {
    roles = [];
  }

  if (!Array.isArray(roles) || roles.length < 2) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/select-role")}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#0C3D2E] hover:bg-slate-50 ${className}`}
    >
      <Repeat className="h-4 w-4" />
      Switch Role
    </button>
  );
}
