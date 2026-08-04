
import { Navbar, Footer } from "../modules/public/components"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getDashboardPathForRole } from "../shared/utils/roleRedirects";

function PublicLayout() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const dashboardPath = getDashboardPathForRole(role);
    const location = useLocation();

    if (token) {
        if (localStorage.getItem("passwordResetRequired") === "true") {
            return <Navigate to="/change-password" replace />;
        }

        // /contact stays reachable for logged-in users too (e.g. Clinic
        // Admin's "Contact Admin To Change Plan" button), and /select-role
        // must stay reachable for a multi-role staff member using the
        // Switch Role button - both would otherwise be bounced straight
        // back to their dashboard before ever rendering.
        if (dashboardPath && location.pathname !== "/contact" && location.pathname !== "/select-role") {
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
