import { Link } from "react-router-dom";

function ReportsHeader() {
    return (
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                        Reports & Analytics
                    </h1>

                    <p className="max-w-2xl text-sm text-gray-500 sm:text-base">
                        Generate, export and analyze platform reports across clinics,
                        veterinarians, subscriptions, revenue and verification data.
                    </p>
                </div>

                <Link
                    to="/superadmin/reports/basic"
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                    Open Basic Reports
                </Link>
            </div>
        </div>
    );
}

export default ReportsHeader;
