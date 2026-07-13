import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    ClipboardList,
    ShieldCheck,
    BarChart3,
    Settings,
    LogOut,
    X,
} from "lucide-react";
import { showToast } from "../../../shared/components/toast";

export default function Sidebar({ isOpen = false, onClose }) {
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard, end: true },
        { name: "Clinics", path: "/superadmin/clinics", icon: Building2 },
        { name: "Veterinarian", path: "/superadmin/Veterinarian", icon: Users },
        { name: "Plans", path: "/superadmin/plans", icon: ClipboardList },
        { name: "Verification", path: "/superadmin/verification", icon: ShieldCheck },
        { name: "Reports", path: "/superadmin/reports", icon: BarChart3 },
        { name: "Basic Reports", path: "/superadmin/reports/basic", icon: BarChart3 },
        { name: "Settings", path: "/superadmin/settings", icon: Settings },
    ];

    const handleLogout = () => {
    console.log("Logout clicked");

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("passwordResetRequired");

    showToast({
        type: "success",
        title: "Logout Successful",
        description: "You have been logged out",
    });

    navigate("/login", { replace: true });
    onClose?.();
};

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 lg:hidden ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 h-screen w-65 shrink-0 transform bg-gradient-to-b from-[#020617] to-[#0f172a] text-white transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col justify-between px-4 py-5`}
            >
                <div>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <ShieldCheck size={20} className="text-orange-500" />
                            <span>
                                Super<span className="text-orange-500">Admin</span>
                            </span>
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/15 lg:hidden"
                            aria-label="Close super admin menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="mt-8">
                        {menu.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.end}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-2 transition-all ${
                                            isActive
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
                    </nav>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-200/10 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                    <div className="border-t border-slate-700 pt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
                            A
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm">Super Admin</p>
                            <p className="truncate text-xs text-slate-400">admin@hms.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
