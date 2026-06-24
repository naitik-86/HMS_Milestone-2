import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import { PageNotFound } from "../modules/public/pages"

function AppRoutes() {
    return (
        <Routes>
            {PublicRoutes}
            {SuperAdminRoutes}
            {ClinicAdminRoutes}

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    );
}

export default AppRoutes;