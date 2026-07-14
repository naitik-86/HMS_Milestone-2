
import { Navbar, Footer } from "../modules/public/components"
import { Navigate, Outlet } from "react-router-dom";
import { getDashboardPathForRole } from "../shared/utils/roleRedirects";

function PublicLayout() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const dashboardPath = getDashboardPathForRole(role);

    if (token) {
        if (localStorage.getItem("passwordResetRequired") === "true") {
            return <Navigate to="/change-password" replace />;
        }

        if (dashboardPath) {
            return <Navigate to={dashboardPath} replace />;
        }
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
