import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    ClipboardList,
    ShieldCheck,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";

const Sidebar = () => {
    const menu = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Clinics", path: "/clinics", icon: Building2 },
        { name: "Veterinarian", path: "/Veterinarian", icon: Users },
        { name: "Plans", path: "/plans", icon: ClipboardList },
        { name: "Verification", path: "/verification", icon: ShieldCheck },
        { name: "Reports", path: "/reports", icon: BarChart3 },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        console.log("Logout clicked");
        window.location.href = import.meta.env.VITE_WEBSITE_URL;
    };

    return (
        <div className="w-65 h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-white flex flex-col justify-between px-4 py-5">

            {/* TOP SECTION */}
            <div>
                {/* Logo */}
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-orange-500">🛡</span>
                    <span>
                        Super<span className="text-orange-500">Admin</span>
                    </span>
                </h2>

                {/* Menu */}
                <div className="mt-8">
                    {menu.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-2 transition-all
                  ${isActive
                                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                                        : "text-slate-300 hover:bg-slate-800"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="space-y-4">

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-200/10 transition"
                >
                    <LogOut size={18} />
                    Logout
                </button>

                {/* Profile */}
                <div className="border-t border-slate-700 pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
                        A
                    </div>

                    <div>
                        <p className="text-sm">Super Admin</p>
                        <p className="text-xs text-slate-400">admin@hms.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;