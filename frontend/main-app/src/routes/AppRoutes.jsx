import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import { PageNotFound } from "../modules/public/pages";

import ChangePassword from './ChangePassword';
import Payment from "../modules/billingModule/pages/PaymentPage";
import PaymentSuccess from "../modules/billingModule/pages/PaymentSuccess";
import PaymentFailure from "../modules/billingModule/pages/PaymentFailed";
import Receipt from "../modules/billingModule/pages/Receipt";


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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/receipt" element={<Receipt />} />


            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/unauthorized" element={<div />} />

            <Route path="*" element={<PageNotFound />} />

        </Routes>
    );
}

export default AppRoutes;
