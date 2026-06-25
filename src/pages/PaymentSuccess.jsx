import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Receipt } from "lucide-react";
import { useCart } from "../context/CartContext";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();

  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      navigate("/user/orders");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-center max-w-lg w-full">
        <CheckCircle
          size={90}
          className="text-green-500 mx-auto mb-6 animate-bounce"
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Payment Success 🎉
        </h1>

        <p className="text-gray-500 mb-8">
          Payment received successfully. Your order has been confirmed.
        </p>

        {/* INFO BOX */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left mb-8 space-y-3">
          {txnRef && (
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction</span>
              <span className="font-semibold">{txnRef}</span>
            </div>
          )}

          {amount && (
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-green-600">
                {(Number(amount) / 100).toLocaleString("vi-VN")} đ
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600">Confirmed</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/user/orders")}
            className="flex-1 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
          >
            <Receipt size={18} />
            View Orders
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl transition font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
