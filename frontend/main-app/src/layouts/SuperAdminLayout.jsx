import { Outlet } from "react-router-dom";
import Sidebar from "../modules/superadmin/components/Sidebar";
function SuperAdminLayout() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 ml-65 p-6 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
}

export default SuperAdminLayout;