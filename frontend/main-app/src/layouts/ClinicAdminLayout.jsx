import { Sidebar } from "../modules/clinicadmin/components"
import { Outlet } from "react-router-dom";

function ClinicAdminLayout() {
    return (
        <div>
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default ClinicAdminLayout;