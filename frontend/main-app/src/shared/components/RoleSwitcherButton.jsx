import { Loader2, Repeat } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableRoles } from "../utils/roleRedirects";

// Sits alongside Logout in each staff sidebar. Only renders for a staff
// member with more than one assigned role - takes them to /select-role to
// pick a different role's dashboard without logging out and redoing OTP.
export default function RoleSwitcherButton({ className = "" }) {
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);
  const hasMultipleRoles = getAvailableRoles().length > 1;

  if (!hasMultipleRoles) return null;

  const handleClick = () => {
    setSwitching(true);
    navigate("/select-role");
  };

  return (
    <button type="button" onClick={handleClick} disabled={switching} className={className}>
      {switching ? <Loader2 size={17} className="animate-spin" /> : <Repeat size={17} />}
      {switching ? "Switching..." : "Switch Role"}
    </button>
  );
}
