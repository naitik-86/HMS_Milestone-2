import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import PaymentHeader from "../components/PaymentHeader";
import PayUCheckoutButton from "../components/PayUCheckoutButton";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import BillingDetails from "../components/BillingDetails";
import PaymentMethods from "../components/PaymentMethods";
import PlanSummary from "../components/PlanSummary";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedMethod, setSelectedMethod] = useState("UPI");
    const [showPayUSandbox, setShowPayUSandbox] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        clinicName,
        email,
        planType,
        planPrice,
        phone,
    } = location.state || {};

    const [billing, setBilling] = useState({
        clinicName: clinicName || "",
        email: email || "",
        phone: phone || "8734560945",
    });

    const plan = {
        name: planType || "Basic Plan",
        price: planPrice || 999,
    };

    const [loading] = useState(false);

    const handlePayment = () => {
        setShowPayUSandbox(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <PaymentHeader />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <PlanSummary plan={plan} />
                    <BillingDetails
                        billing={billing}
                        setBilling={setBilling}
                    />
                </div>

                <PaymentMethods
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                />

                <PayUCheckoutButton
                    handlePayment={handlePayment}
                    loading={loading}
                    amount={plan.price}
                />

                {showSuccess && <PaymentSuccessModal />}

                {showPayUSandbox && (
                    <FakePayUModal
                        amount={plan.price}
                        selectedMethod={selectedMethod}
                        onClose={() => setShowPayUSandbox(false)}
                        onSuccess={() => {
                            setShowPayUSandbox(false);
                            setShowSuccess(true);

                            setTimeout(() => {
                                navigate("/clinic");
                            }, 2000);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const FakePayUModal = ({
    amount,
    selectedMethod,
    onClose,
    onSuccess,
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-green-600 text-white px-6 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">PayU Checkout</h2>
                        <p className="text-sm text-green-100">
                            Secure Sandbox Environment
                        </p>
                    </div>

                    <button onClick={onClose} className="text-white text-xl">
                        ✕
                    </button>
                </div>

                {/* Merchant Info */}
                <div className="px-6 py-5 border-b">
                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Merchant</span>
                        <span className="font-semibold">HMS Clinic</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-medium">
                            TXN{Date.now().toString().slice(-6)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-2xl font-bold text-green-600">
                            ₹{amount}
                        </span>
                    </div>
                </div>

                {/* Selected Method */}
                <div className="px-6 py-5 border-b">
                    <h3 className="font-semibold mb-4 text-gray-800">
                        Payment Method
                    </h3>

                    <div className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm text-gray-500">
                                Selected Method
                            </p>
                            <p className="font-semibold">
                                {selectedMethod}
                            </p>
                        </div>

                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                </div>

                {/* Security */}
                <div className="px-6 py-5 border-b">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-green-600">🔒</span>
                        <p className="font-medium text-gray-700">
                            Secured by PayU
                        </p>
                    </div>

                    <p className="text-sm text-gray-500">
                        Your payment details are encrypted and securely processed.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={onSuccess}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Pay ₹{amount}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel Payment
                    </button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
                    Sandbox Mode • No real payment will be processed
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;