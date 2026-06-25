import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentFailed() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/orders");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
        <XCircle size={90} className="text-red-500 mx-auto mb-6" />

        <h1 className="text-4xl font-bold mb-4">Payment Failed ❌</h1>

        <p className="text-gray-500 mb-6">
          Your payment was cancelled or failed. Please try again.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-2xl transition font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default PaymentFailed;
