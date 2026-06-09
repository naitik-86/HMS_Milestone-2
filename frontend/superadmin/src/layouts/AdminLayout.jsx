import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex">

            <aside className="sticky top-0 h-screen">
                <Sidebar />
            </aside>
            <div className="flex-1 flex flex-col">
                <Topbar />

                <div className="p-6 bg-slate-100  min-h-screen">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;