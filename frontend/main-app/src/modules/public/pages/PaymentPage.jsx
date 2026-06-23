import { useLocation } from "react-router-dom";
import { ShieldCheck, CreditCard, BadgeIndianRupee } from "lucide-react";
import API from "../../../shared/api/axios";

const Payment = () => {
    const { state } = useLocation();
    const price = state.subscriptionPrice || 4999;
    const billingCycle = state.subscriptionType || "Monthly";


    const handlePay = async () => {
        try {
            console.log(state.email);



            const { data } = await API.post(
                "/subscription/create-subscription",
                {
                    email: state.email,
                }
            );

            const paymentData = data.paymentData;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://test.payu.in/_payment";

            Object.keys(paymentData).forEach((key) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = paymentData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Left Section */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Complete Your Subscription
                        </h1>

                        <p className="text-blue-100 leading-relaxed">
                            Activate your clinic account and unlock all HMS features including
                            patient management, doctor scheduling, billing, and analytics.
                        </p>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={22} />
                            <span>100% Secure Payment via PayU</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <CreditCard size={22} />
                            <span>Supports UPI, Cards, Net Banking</span>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="p-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                        Subscription Details
                    </h2>

                    <div className="border rounded-xl p-6 bg-gray-50 mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Plan</span>
                            <span className="font-semibold">Clinic Subscription</span>
                        </div>

                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Billing Cycle</span>
                            <span className="font-semibold">{billingCycle}</span>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="text-lg font-medium text-gray-700">
                                Total Amount
                            </span>

                            <div className="flex items-center text-2xl font-bold text-green-600">
                                <BadgeIndianRupee size={24} />
                                {price}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePay}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md"
                    >
                        Proceed to Payment
                    </button>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        By proceeding, you agree to our Terms & Conditions and Subscription Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;