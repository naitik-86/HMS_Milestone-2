import { Outlet } from "react-router-dom";
import { ReceptionSidebar } from "../modules/clinicadmin/components";

export default function ReceptionLayout() {
  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <ReceptionSidebar />

      <main className="md:ml-72 pt-16 md:pt-0 min-h-screen bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}
