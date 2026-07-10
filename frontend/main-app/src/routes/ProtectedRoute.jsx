import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");

    // Normalize the role to match constants (e.g., "Clinic Admin" -> "CLINIC_ADMIN")
    const normalizedRole = rawRole 
        ? rawRole.toUpperCase().replace(/\s+/g, '_') 
        : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(normalizedRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;