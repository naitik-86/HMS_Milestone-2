import { ShieldCheck, Building2 } from "lucide-react";

function HomePage() {

    const goToSuperAdmin = () => {
        console.log("redirecting to superadmin");
        alert("redirecting to superadmin")
        // localStorage.setItem("role", "superadmin");
        window.location.href = import.meta.env.VITE_SUPERADMIN_URL;
    };

    const goToClinicAdmin = () => {
        console.log("redirecting to clinicadmin");
        localStorage.setItem("role", "clinicadmin");
        window.location.href = import.meta.env.VITE_CLINICADMIN_URL;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 flex items-center justify-center px-6">
            <div className="max-w-5xl w-full">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Appointment Management System
                    </h1>

                    <p className="text-gray-300 text-lg">
                        Manage Clinics, Doctors, Patients & Appointments Efficiently
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Super Admin */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-3">
                            Super Admin
                        </h2>

                        <p className="text-gray-300 text-center mb-8">
                            Manage all clinics, subscriptions, staff, appointments and system settings.
                        </p>

                        <button
                            onClick={goToSuperAdmin}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-lg transition"
                        >
                            Login as Super Admin
                        </button>
                    </div>

                    {/* Clinic Admin */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-6">
                            <Building2 size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-3">
                            Clinic Admin
                        </h2>

                        <p className="text-gray-300 text-center mb-8">
                            Manage doctors, patients, appointments, queues and clinic operations.
                        </p>

                        <button
                            onClick={goToClinicAdmin}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition"
                        >
                            Login as Clinic Admin
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="text-center mt-10">
                    <p className="text-gray-400">
                        © 2026 Appointment Management System
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;