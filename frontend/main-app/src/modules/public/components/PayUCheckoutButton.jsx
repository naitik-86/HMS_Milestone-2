const PayUCheckoutButton = ({ handlePayment, loading, amount }) => {
    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition"
        >
            {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>
    );
};

export default PayUCheckoutButton;