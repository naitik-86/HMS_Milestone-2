import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ReceptionSidebar } from "../modules/clinicadmin/components";

export default function ReceptionLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("reception-sidebar-collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem("reception-sidebar-collapsed", String(newVal));
      return newVal;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <ReceptionSidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out bg-slate-50 overflow-y-auto pt-16 md:pt-0 ${
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

