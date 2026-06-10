import {
    ShieldCheck,
    Building2,
    Users,
    Stethoscope,
    ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const goToSuperAdmin = () => {
        navigate("/super-admin/login");
    };

    const goToClinicAdmin = () => {
        navigate("/clinic-admin/login");
    };

    const goToReceptionist = () => {
        navigate("/receptionist/login");
    };

    const goToDoctor = () => {
        navigate("/doctor/login");
    };

    const goToPreConsultant = () => {
        navigate("/preconsultant/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 flex items-center justify-center px-6 py-10">
            <div className="max-w-7xl w-full">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    {/* Receptionist */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6">
                            <Users size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-3">
                            Receptionist
                        </h2>

                        <p className="text-gray-300 text-center mb-8">
                            Manage patient registrations, appointments and front desk operations.
                        </p>

                        <button
                            onClick={goToReceptionist}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition"
                        >
                            Login as Receptionist
                        </button>
                    </div>

                    {/* Doctor */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-6">
                            <Stethoscope size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-3">
                            Doctor
                        </h2>

                        <p className="text-gray-300 text-center mb-8">
                            View appointments, patient records and consultation details.
                        </p>

                        <button
                            onClick={goToDoctor}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-lg transition"
                        >
                            Login as Doctor
                        </button>
                    </div>

                    {/* Pre Consultant */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <div className="w-20 h-20 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-6">
                            <ClipboardList size={40} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-3">
                            Pre Consultant
                        </h2>

                        <p className="text-gray-300 text-center mb-8">
                            Record vitals, patient information and pre-consultation details.
                        </p>

                        <button
                            onClick={goToPreConsultant}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold text-lg transition"
                        >
                            Login as Pre Consultant
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