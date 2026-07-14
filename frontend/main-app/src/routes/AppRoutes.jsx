import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ClinicAdminRoutes from "./ClinicAdminRoutes";
import PageNotFound from "../modules/public/pages/PageNotFound";

const ChangePassword = lazy(() => import("./ChangePassword"));


function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center text-slate-500">
                    Loading...
                </div>
            }
        >
            <Routes>
                {PublicRoutes}
                {SuperAdminRoutes}
                {ClinicAdminRoutes}

                <Route path="/change-password" element={<ChangePassword />} />

                <Route path="/unauthorized" element={<div />} />

                <Route path="*" element={<PageNotFound />} />

            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
