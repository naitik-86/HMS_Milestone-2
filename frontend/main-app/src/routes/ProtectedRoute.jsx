import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");

    // Normalize the role to match constants (e.g., "Clinic Admin" -> "CLINIC_ADMIN")
    const normalizedRole = rawRole 
        ? rawRole.toUpperCase().replace(/\s+/g, '_') 
        : null;

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