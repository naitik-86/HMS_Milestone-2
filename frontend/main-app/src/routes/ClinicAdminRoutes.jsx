// ClinicAdminRoutes.jsx
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ClinicAdminLayout from "../layouts/ClinicAdminLayout";

import Dashboard from "../modules/clinicadmin/features/dashboard/Dashboard";
import StaffEnrollment from "../modules/clinicadmin/features/staff/StaffEnrollment";
import DoctorDetails from "../modules/clinicadmin/features/doctors/DoctorDetails";
import LabTechnician from "../modules/clinicadmin/features/lab/LabTechnician";
import Groomer from "../modules/clinicadmin/features/groomer/Groomer";
import KennelStaff from "../modules/clinicadmin/features/kennel/KennelStaff";
import ClinicSettings from "../modules/clinicadmin/features/settings/ClinicSettings";
import Reports from "../modules/clinicadmin/features/reports/Reports";

const ClinicAdminRoutes = (
    <Route
        path="/clinic"
        element={
            <ProtectedRoute allowedRoles={["CLINIC_ADMIN"]}>
                <ClinicAdminLayout />
            </ProtectedRoute>
        }
    >
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<StaffEnrollment />} />
        <Route path="doctors" element={<DoctorDetails />} />
        <Route path="lab" element={<LabTechnician />} />
        <Route path="groomer" element={<Groomer />} />
        <Route path="kennel" element={<KennelStaff />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<ClinicSettings />} />
    </Route>
);

export default ClinicAdminRoutes;