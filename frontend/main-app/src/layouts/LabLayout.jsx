import { Outlet } from "react-router-dom";
import LabSidebar from "../modules/clinicadmin/pages/lab_pages/LabSidebar";
import SwitchRoleButton from "../shared/components/SwitchRoleButton";

export default function LabLayout() {
    return (
        <div className="role-reception-theme min-h-screen bg-slate-50">
            <LabSidebar />

            <main className="lg:ml-[260px] min-h-screen pt-16 lg:pt-0">
                <header className="hidden h-[72px] items-center justify-end border-b border-slate-200 bg-white px-6 lg:flex lg:px-8">
                    <SwitchRoleButton />
                </header>
                <Outlet />
            </main>
        </div>
    );
}
