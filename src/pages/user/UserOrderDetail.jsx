import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";

function UserOrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/orders/${id}`);

      setOrder(res.data);
    } catch (err) {
      toast.error("Cannot load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-3xl p-8 animate-pulse h-96" />;
  }

  if (!order) return null;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">
              Order #{order.orderId}
            </h1>

            <p className="text-gray-500 mt-2">
              {order.createAt
                ? new Date(order.createAt).toLocaleString("vi-VN")
                : "No date"}
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold">
            {order.status}
          </div>
        </div>

        {order.transactionNo && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            <p className="font-bold text-green-700">✅ Paid via VNPAY</p>

            <p className="text-sm text-gray-600 mt-2">
              Transaction: {order.transactionNo}
            </p>

            <p className="text-sm text-gray-600">Bank: {order.bankCode}</p>

            <p className="text-sm text-gray-600">
              Paid at: {new Date(order.paymentTime).toLocaleString("vi-VN")}
            </p>
          </div>
        )}
      </div>

      {/* ITEMS */}

      <div className="border rounded-3xl overflow-hidden">
        {order.items?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b last:border-b-0"
          >
            <img
              src={
                item.imageUrl?.startsWith("http")
                  ? item.imageUrl
                  : `${import.meta.env.VITE_API_HOST}${item.imageUrl}`
              }
              alt=""
              className="w-24 h-24 object-cover rounded-2xl border"
            />

            <div className="flex-1">
              <h2 className="text-lg font-bold">{item.productName}</h2>

              <div className="text-gray-500 mt-2">
                Quantity: {item.quantity}
              </div>

              <div className="text-gray-500">
                Size: {item.size || "Default"}
              </div>

              <div className="text-gray-500">
                Color: {item.color || "Default"}
              </div>
            </div>

            <div className="text-xl font-bold">
              {item.price?.toLocaleString()} đ
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}

      <div className="flex justify-end mt-8 pt-6 border-t">
        <div className="text-xl sm:text-3xl font-bold">
          Total: {order.totalPrice?.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}

export default UserOrderDetail;
