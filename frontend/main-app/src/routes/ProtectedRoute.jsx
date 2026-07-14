import { Navigate, useLocation } from "react-router-dom";
import { normalizeRole } from "../shared/utils/roleRedirects";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");

    const normalizedRole = normalizeRole(rawRole) || null;

    if (!token) {
        // location state bhej kar history ko strongly replace kar rahe hain
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(normalizedRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
