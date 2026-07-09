

import { Route } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import ProtectedRoute from "./ProtectedRoute";
import DoctorLayout from "../layouts/DoctorStaffLayout";
import ReceptionLayout from "../layouts/ReceptionLayout";
import ClinicAdminLayout from "../layouts/ClinicAdminLayout";
import PreConsultationLayout from "../layouts/PreConsultationLayout";
import LabLayout from "../layouts/LabLayout"

// clinic pages
import Dashboard from "../modules/clinicadmin/features/dashboard/Dashboard";
import StaffEnrollment from "../modules/clinicadmin/features/staff/StaffEnrollment";
import DoctorDetails from "../modules/clinicadmin/features/doctors/DoctorDetails";
import LabTechnician from "../modules/clinicadmin/features/lab/LabTechnician";
import Groomer from "../modules/clinicadmin/features/groomer/Groomer";
import KennelStaff from "../modules/clinicadmin/features/kennel/KennelStaff";
import ClinicSettings from "../modules/clinicadmin/features/settings/ClinicSettings";
import Reports from "../modules/clinicadmin/features/reports/Reports";
import BasicReports from "../modules/clinicadmin/features/reports/BasicReports";

//reception pages
import ReceptionDashboard from "../modules/clinicadmin/pages/clinic-receptionist/ReceptionDashboard";
import NewRegistrationPet from "../modules/clinicadmin/pages/clinic-receptionist/NewRegistrationPet";
import ExistingCustomerPet from "../modules/clinicadmin/pages/clinic-receptionist/ExistingCustomerPet";
import PetHistory from "../modules/clinicadmin/pages/clinic-receptionist/PetHistory";
import CreateVisit from "../modules/clinicadmin/pages/clinic-receptionist/CreateVisit";
// Lab Upload Dashboard
import LabDashboard from "../modules/clinicadmin/pages/lab_reports_upload/LabDashboard";
import LabReportUpload from "../modules/clinicadmin/pages/lab_reports_upload/LabReportUpload";


// pet owner module
import PetOwnerDashboard from "../modules/clinicadmin/pages/pet-owner/PetOwnerDashboard";
import PetOwnerHistory from "../modules/clinicadmin/pages/pet-owner/PetOwnerHistory";
import PetOwnerUploadDocuments from "../modules/clinicadmin/pages/pet-owner/PetOwnerUploadDocuments";

// preconsultation pages
import {
    PreConsultationDashboard,
    PendingPets,
    CompletedPets,
    HistoryPets,
} from "../modules/clinicadmin/pages";
import DoctorLabPage from "../modules/clinicadmin/components/common/doctor-staff/DoctorLabPage";
import {
    DoctorDashboard,
    DoctorPendingPetsPage,
    DoctorCompletedPetsPage,
    DoctorHistoryPetsPage,
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
            <Route path="reports/basic" element={<Reports />}/>
            <Route path="reports/basic" element={<BasicReports />} />
            <Route path="settings" element={<ClinicSettings />} />
        </Route>

        {/* {Preconsultation Routes} */}

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


        {/* {Doctor - staff Routes} */}

        <Route
            path="/clinic/doctor"
            element={
                // <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorLayout />
                // </ProtectedRoute>
            }
        >
            <Route index element={<DoctorDashboard />} />
            <Route path="pending" element={<DoctorPendingPetsPage />} />
            <Route path="completed" element={<DoctorCompletedPetsPage />} />
            <Route path="lab" element={<DoctorLabPage />} />
            <Route path="history" element={<DoctorHistoryPetsPage />} />
        </Route>



        <Route
            path="/clinic/reception"
            element={<ReceptionLayout />}
        >
            <Route index element={<ReceptionDashboard />} />
            <Route path="new-registration" element={<NewRegistrationPet />} />
            <Route path="create-visit" element={<CreateVisit />} />
            <Route path="existing-customer" element={<ExistingCustomerPet />} />
            <Route path="history" element={<PetHistory />} />
        </Route>

        <Route
            path="/clinic/lab"
            element={< LabLayout />}
        >
            <Route index element={<LabDashboard />} />
            <Route path="upload" element={<LabReportUpload />} />
        </Route>


        <Route path="/clinic/owner">
            <Route index element={<PetOwnerDashboard />} />
            <Route path="history" element={<PetOwnerHistory />} />
            <Route path="upload" element={<PetOwnerUploadDocuments />} />
        </Route>




    </>
);

export default ClinicAdminRoutes;