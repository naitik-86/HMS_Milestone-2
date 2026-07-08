import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import { PageNotFound } from "../modules/public/pages";

import EnableTotp from './EnableTotp';
import ChangePassword from './ChangePassword';


function AppRoutes() {
    return (
        <Routes>
            {PublicRoutes}
            {SuperAdminRoutes}
            {ClinicAdminRoutes}

            <Route path="/enable-totp" element={<EnableTotp />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/unauthorized" element={<div />} />

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    );
}

export default AppRoutes;