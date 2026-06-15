import { DoctorSidebar } from "../modules/clinicadmin/components";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
    return (
        <div className="flex">
            <DoctorSidebar />

            <div className="flex-1 p-6 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
}

export default DoctorLayout;