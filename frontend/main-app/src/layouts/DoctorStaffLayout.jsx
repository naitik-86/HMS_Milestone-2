import { DoctorSidebar } from "../modules/clinicadmin/components";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
    return (
        <div className="min-h-screen bg-slate-100 lg:flex">
            <DoctorSidebar />

            <main className="min-w-0 flex-1 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 lg:h-screen lg:overflow-y-auto lg:p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default DoctorLayout;
