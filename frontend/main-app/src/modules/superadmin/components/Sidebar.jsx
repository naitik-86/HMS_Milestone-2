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
import { showToast } from "../../../shared/components/toast";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard, end: true },
        { name: "Clinics", path: "/superadmin/clinics", icon: Building2 },
        { name: "Veterinarian", path: "/superadmin/Veterinarian", icon: Users },
        { name: "Plans", path: "/superadmin/plans", icon: ClipboardList },
        { name: "Verification", path: "/superadmin/verification", icon: ShieldCheck },
        { name: "Reports", path: "/superadmin/reports", icon: BarChart3 },
        { name: "Settings", path: "/superadmin/settings", icon: Settings },
    ];

    const handleLogout = () => {
        console.log("Logout clicked");
        showToast({
            type: "success",
            title: "Logout Successful",
            description: "You have been logged out",
        });
        navigate("/");

    };

    return (
        <div className="fixed top-0 left-0 h-screen w-65 bg-gradient-to-b from-[#020617] to-[#0f172a] text-white flex flex-col justify-between px-4 py-5">
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
                                end={item.end}
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

