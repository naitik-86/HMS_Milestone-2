import { Outlet } from "react-router-dom";
import LabSidebar from "../modules/clinicadmin/pages/lab_reports_upload/LabSidebar";

export default function LabLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <LabSidebar />

            <main className="lg:ml-[240px] min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}