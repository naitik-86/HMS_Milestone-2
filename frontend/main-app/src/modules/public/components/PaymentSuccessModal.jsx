const PaymentSuccessModal = () => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl w-96">
                <h2 className="text-2xl font-bold text-green-600">
                    Payment Successful 🎉
                </h2>
                <p className="text-gray-500 mt-2">
                    Redirecting to dashboard...
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;