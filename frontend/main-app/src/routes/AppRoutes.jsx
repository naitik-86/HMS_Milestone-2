import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import NotFoundPage from "../modules/public/pages/PageNotFound"

function AppRoutes() {
    return (
        <Routes>
            {PublicRoutes}
            {SuperAdminRoutes}
            {ClinicAdminRoutes}

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;