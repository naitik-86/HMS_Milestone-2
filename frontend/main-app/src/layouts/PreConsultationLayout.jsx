import { Outlet } from "react-router-dom";
import { PreConsulatationSideBar } from "../modules/clinicadmin/components";

function PreConsultationLayout() {
    return (
        <div className="flex">
            <PreConsulatationSideBar />

            <div className="flex-1  overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
}

export default PreConsultationLayout;