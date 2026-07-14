import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import { PageNotFound } from "../modules/public/pages";

import ChangePassword from './ChangePassword';
import Payment from "../modules/billingModule/pages/PaymentPage";
import PaymentSucess from "../modules/billingModule/pages/PaymentSuccess";
import PaymentFailure from "../modules/billingModule/pages/PaymentFailed";


function AppRoutes() {
    return (
        <Routes>
            {PublicRoutes}
            {SuperAdminRoutes}
            {ClinicAdminRoutes}

            <Route
                path="/payment"
                element={<Payment />}
            />
            <Route path="/payment-success" element={<PaymentSucess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />

            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/unauthorized" element={<div />} />

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    );
}

export default AppRoutes;
