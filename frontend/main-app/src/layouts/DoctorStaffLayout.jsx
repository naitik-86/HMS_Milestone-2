import { useState } from "react";
import { DoctorSidebar } from "../modules/clinicadmin/components";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 flex overflow-hidden">
            <DoctorSidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed((prev) => !prev)}
            />

            <main
                className={`flex-1 min-h-screen transition-all duration-300 ease-in-out bg-slate-100 overflow-y-auto ${
                    isCollapsed ? "lg:pl-20" : "lg:pl-72"
                }`}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DoctorLayout;


