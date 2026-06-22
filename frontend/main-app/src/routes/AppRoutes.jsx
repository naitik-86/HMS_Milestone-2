import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import NotFoundPage from "../modules/public/pages/PageNotFound"
import PaymentPage from "../modules/public/pages/PaymentPage";

function AppRoutes() {
    return (
        <Routes>
            {PublicRoutes}
            {SuperAdminRoutes}
            {ClinicAdminRoutes}
            <Route
                path="/payment"
                element={<PaymentPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;