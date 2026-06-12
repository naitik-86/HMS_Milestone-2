import { Sidebar } from "../modules/clinicadmin/components"
import { Outlet } from "react-router-dom";

function ClinicAdminLayout() {
    return (

        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-6 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>

    );
}

export default ClinicAdminLayout;