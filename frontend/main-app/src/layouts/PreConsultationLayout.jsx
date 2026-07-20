import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PreConsulatationSideBar } from "../modules/clinicadmin/components";

function PreConsultationLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex bg-slate-100 min-h-screen overflow-hidden">
            <PreConsulatationSideBar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed((prev) => !prev)}
            />

            <main
                className={`flex-1 min-h-screen transition-all duration-300 ease-in-out bg-slate-100 overflow-y-auto ${
                    isCollapsed ? "md:pl-20" : "md:pl-72"
                }`}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default PreConsultationLayout;
