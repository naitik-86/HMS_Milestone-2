const PaymentMethods = ({ selectedMethod, setSelectedMethod }) => {
    const methods = ["UPI", "Cards", "Net Banking", "Wallets"];

    const renderPaymentSection = () => {
        switch (selectedMethod) {
            case "UPI":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                            Pay via UPI
                        </h3>

                        <input
                            type="text"
                            placeholder="Enter UPI ID"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                );

            case "Cards":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                            Pay via Card
                        </h3>

                        <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <input
                            type="text"
                            placeholder="Card Holder Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <input
                                type="password"
                                placeholder="CVV"
                                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                );

            case "Net Banking":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                            Net Banking
                        </h3>

                        <select className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option>Select Your Bank</option>
                            <option>SBI</option>
                            <option>HDFC</option>
                            <option>ICICI</option>
                            <option>Axis Bank</option>
                            <option>PNB</option>
                        </select>
                    </div>
                );

            case "Wallets":
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800">
                            Wallet Payment
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="border rounded-lg py-3 hover:bg-gray-50">
                                Paytm
                            </button>
                            <button className="border rounded-lg py-3 hover:bg-gray-50">
                                PhonePe
                            </button>
                            <button className="border rounded-lg py-3 hover:bg-gray-50">
                                Amazon Pay
                            </button>
                            <button className="border rounded-lg py-3 hover:bg-gray-50">
                                Mobikwik
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Available Payment Methods
            </h2>

            {/* Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {methods.map((method) => (
                    <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`border rounded-lg py-3 text-center font-medium transition-all duration-200 ${selectedMethod === method
                                ? "bg-green-600 text-white border-green-600 shadow-md"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {method}
                    </button>
                ))}
            </div>

            {/* Dynamic form */}
            <div className="mt-6">{renderPaymentSection()}</div>
        </div>
    );
};

export default PaymentMethods;