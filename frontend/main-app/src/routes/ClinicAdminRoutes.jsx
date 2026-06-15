// // ClinicAdminRoutes.jsx
// import { Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import ClinicAdminLayout from "../layouts/ClinicAdminLayout";

// import Dashboard from "../modules/clinicadmin/features/dashboard/Dashboard";
// import StaffEnrollment from "../modules/clinicadmin/features/staff/StaffEnrollment";
// import DoctorDetails from "../modules/clinicadmin/features/doctors/DoctorDetails";
// import LabTechnician from "../modules/clinicadmin/features/lab/LabTechnician";
// import Groomer from "../modules/clinicadmin/features/groomer/Groomer";
// import KennelStaff from "../modules/clinicadmin/features/kennel/KennelStaff";
// import ClinicSettings from "../modules/clinicadmin/features/settings/ClinicSettings";
// import Reports from "../modules/clinicadmin/features/reports/Reports";
// import { PreConsulatationSideBar } from "../modules/clinicadmin/components";
// import PreConsultationLayout from "../layouts/PreConsultationLayout";
// import {
//     PreConsultationDashboard,
//     PendingPets,
//     CompletedPets,
//     HistoryPets
// } from "../modules/clinicadmin/pages"


// const ClinicAdminRoutes = (
// <Route
//     path="/clinic"
//     element={

//         // TODO: For now excluded protected routes to make a bypass, wrap it under protected routes once backend id done

//         // <ProtectedRoute allowedRoles={["CLINIC_ADMIN"]}>
//         <ClinicAdminLayout />
//         // </ProtectedRoute>
//     }
// >
//     <Route index element={<Dashboard />} />
//     <Route path="staff" element={<StaffEnrollment />} />
//     <Route path="doctors" element={<DoctorDetails />} />
//     <Route path="lab" element={<LabTechnician />} />
//     <Route path="groomer" element={<Groomer />} />
//     <Route path="kennel" element={<KennelStaff />} />
//     <Route path="reports" element={<Reports />} />
//     <Route path="settings" element={<ClinicSettings />} />

//     <Route path="preconsultation">
//         <Route index element={<PreConsultationDashboard />} />
//         <Route path="pending" element={<PendingPets />} />
//         <Route path="completed" element={<CompletedPets />} />
//         <Route path="history" element={<HistoryPets />} />
//     </Route>

// </Route>

import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ClinicAdminLayout from "../layouts/ClinicAdminLayout";
import PreConsultationLayout from "../layouts/PreConsultationLayout";
// clinic pages
import Dashboard from "../modules/clinicadmin/features/dashboard/Dashboard";
import StaffEnrollment from "../modules/clinicadmin/features/staff/StaffEnrollment";
import DoctorDetails from "../modules/clinicadmin/features/doctors/DoctorDetails";
import LabTechnician from "../modules/clinicadmin/features/lab/LabTechnician";
import Groomer from "../modules/clinicadmin/features/groomer/Groomer";
import KennelStaff from "../modules/clinicadmin/features/kennel/KennelStaff";
import ClinicSettings from "../modules/clinicadmin/features/settings/ClinicSettings";
import Reports from "../modules/clinicadmin/features/reports/Reports";

// preconsultation pages
import {
    PreConsultationDashboard,
    PendingPets,
    CompletedPets,
    HistoryPets
} from "../modules/clinicadmin/pages";

const ClinicAdminRoutes = (
    <>

        <Route
            path="/clinic"
            element={
                // <ProtectedRoute allowedRoles={["CLINIC_ADMIN"]}>
                <ClinicAdminLayout />
                // </ProtectedRoute>
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


        <Route
            path="/clinic/preconsultation"
            element={
                // <ProtectedRoute allowedRoles={["CLINIC_ADMIN"]}>
                <PreConsultationLayout />
                // </ProtectedRoute>
            }
        >
            <Route index element={<PreConsultationDashboard />} />
            <Route path="pending" element={<PendingPets />} />
            <Route path="completed" element={<CompletedPets />} />
            <Route path="history" element={<HistoryPets />} />
        </Route>
    </>
);

export default ClinicAdminRoutes;