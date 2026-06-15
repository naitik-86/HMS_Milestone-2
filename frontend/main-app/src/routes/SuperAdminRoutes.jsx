import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import {
    Dashboard,
    Clinics,
    Doctors,
    Plans,
    Reports,
    Verification,
    Settings,
} from "../modules/superadmin/pages";

const SuperAdminRoutes = (
    <Route
        path="/superadmin"
        element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminLayout />
            </ProtectedRoute>
        }
    >
        <Route index element={<Dashboard />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path="veterinarian" element={<Doctors />} />
        <Route path="plans" element={<Plans />} />
        <Route path="reports" element={<Reports />} />
        <Route path="verification" element={<Verification />} />
        <Route path="settings" element={<Settings />} />
    </Route>
);

export default SuperAdminRoutes;