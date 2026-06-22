const PlanSummary = ({ plan }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h2 className="text-xl font-semibold mb-4">Selected Plan</h2>

            <div className="space-y-3">

                <p className="text-gray-600">
                    Plan Type:
                </p>

                <div className="text-4xl font-bold text-gray-900">
                    ₹{plan?.price || 2999}
                    <span className="text-base text-gray-500">
                        /{plan?.name || "month"}
                    </span>
                </div>


            </div>
        </div>
    );
};

export default PlanSummary;