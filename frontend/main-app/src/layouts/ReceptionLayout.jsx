import { Outlet } from "react-router-dom";
import { ReceptionSidebar } from "../modules/clinicadmin/components";

export default function ReceptionLayout() {
    return (
        <>
            {/* Sidebar */}
            < ReceptionSidebar />

            {/* Main Content */}
            < div className=" lg:ml-[240px] min-h-screen" >
                <Outlet />

            </div >
        </>
    );
}