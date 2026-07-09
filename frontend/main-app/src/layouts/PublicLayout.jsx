
import { Navbar, Footer } from "../modules/public/components"
import { Navigate, Outlet } from "react-router-dom";

function PublicLayout() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
        if (localStorage.getItem("passwordResetRequired") === "true") {
            return <Navigate to="/change-password" replace />;
        }

        if (localStorage.getItem("totpRequired") === "true") {
            return <Navigate to="/enable-totp" replace />;
        }

        if (role === "SUPER_ADMIN") return <Navigate to="/superadmin" replace />;
        if (role === "CLINIC_ADMIN") return <Navigate to="/clinic" replace />;
        if (role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
        if (role === "RECEPTIONIST") return <Navigate to="/clinic/reception" replace />;
        if (role === "PARA_MEDICAL") return <Navigate to="/clinic/pre-consultation" replace />;
    }

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default PublicLayout;
