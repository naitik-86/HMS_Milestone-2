function ReportsHeader() {
    return (
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                    Reports & Analytics
                </h1>

                <p className="text-sm sm:text-base text-gray-500 max-w-2xl">
                    Generate, export and analyze platform reports across clinics,
                    veterinarians, subscriptions, revenue and verification data.
                </p>
            </div>
        </div>
    );
}

export default ReportsHeader;