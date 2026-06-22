const BillingDetails = ({ billing, setBilling }) => {
    const handleChange = (e) => {
        setBilling({
            ...billing,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    name="clinicName"
                    value={billing.clinicName}
                    placeholder="Clinic Name"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    readOnly
                />

                <input
                    readOnly
                    type="email"
                    name="email"
                    value={billing.email}
                    placeholder="Email Address"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"

                />

                <input
                    type="text"
                    name="phone"
                    value={billing.phone}
                    placeholder="Phone Number"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    readOnly
                />
            </div>
        </div>
    );
};

export default BillingDetails;