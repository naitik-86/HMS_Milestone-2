import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import NotFoundPage from "../modules/public/pages/PageNotFound"
import PaymentPage from "../modules/public/pages/PaymentPage";
import Receipt from "../modules/public/pages/Receipt";
import PaymentSuccess from "../modules/public/pages/PaymentSuccess";
import PaymentFailure from "../modules/public/pages/PaymentFailure";

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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;