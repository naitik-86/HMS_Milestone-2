import { Search, Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
    const location = useLocation();

    const routeTitles = {
        "/superadmin": "Dashboard",
        "/superadmin/clinics": "Clinics",
        "/superadmin/veterinarian": "Veterinarian",
        "/superadmin/plans": "Plans",
        "/superadmin/verification": "Verification",
        "/superadmin/reports": "Reports",
        "/superadmin/settings": "Settings",
    };

    const title = routeTitles[location.pathname.toLowerCase()] || "Dashboard";

    return (
        <div className="sticky top-0 z-30 flex min-h-17.5 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 lg:hidden"
                    aria-label="Open super admin menu"
                >
                    <Menu size={22} />
                </button>

                <h2 className="truncate bg-gradient-to-r from-orange-500 via-orange-600 to-orange-800 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
                    {title}
                </h2>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:gap-5">
                <div className="flex min-w-0 flex-1 items-center rounded-lg bg-gray-100 px-3 py-2 sm:w-65 sm:flex-none">
                    <Search size={16} className="shrink-0 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 w-full bg-transparent text-sm outline-none"
                    />
                </div>

                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-gray-700" />

                    <span className="absolute -right-2 -top-1 rounded-full bg-orange-500 px-1.5 py-px text-[10px] text-white">
                        3
                    </span>
                </div>

                <div className="hidden cursor-pointer items-center gap-2 sm:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                        A
                    </div>

                    <span className="text-sm font-medium text-gray-800">
                        Super Admin
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
