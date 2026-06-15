import { Search, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

const Topbar = () => {
    const location = useLocation();

    const routeTitles = {
        "/": "Dashboard",
        "/dashboard": "Dashboard",
        "/clinics": "Clinics",
        "/doctors": "Doctors",
        "/plans": "Plans",
        "/verification": "Verification",
        "/reports": "Reports",
        "/users": "Users",
        "/settings": "Settings",
    };

    const title = routeTitles[location.pathname] || "Dashboard";

    return (
        <div className="h-17.5 bg-white flex items-center justify-between px-6 border-b border-gray-200">



            {/* 🔹 Title */}
            <h2 className="text-xl font-semibold bg-gradient-to-r  from-orange-500 via-orange-600 to-orange-800 bg-clip-text text-transparent">
                {title}
            </h2>
            {/*  Right Section */}
            <div className="flex items-center gap-5">

                {/*  Search */}
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-65">
                    <Search size={16} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 bg-transparent outline-none text-sm w-full"
                    />
                </div>

                {/*  Notification */}
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-gray-700" />

                    <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-px rounded-full">
                        3
                    </span>
                </div>

                {/*  Profile */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>

                    <span className="text-sm text-gray-800 font-medium">
                        Super Admin
                    </span>
                </div>

            </div>
        </div>
    );
};

export default Topbar;