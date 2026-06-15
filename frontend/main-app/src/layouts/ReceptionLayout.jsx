import { Outlet } from "react-router-dom";
import { ReceptionSidebar } from "../modules/clinicadmin/components";

export default function ReceptionLayout() {
    return (
        <div className="flex">
            {/* Sidebar */}
            <ReceptionSidebar />

            {/* Main Content */}
            <div className="flex-1 bg-gray-50 min-h-screen ">
                <Outlet />
            </div>
        </div>
    );
}