import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderTracking from "../../components/OrderTracking";
function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [page]);

  // =========================
  // LOAD ORDERS
  // =========================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/orders/my-orders?page=${page}&size=5`);

      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Cannot load orders");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================
  const cancelOrder = async (id) => {
    try {
      await API.put(`/orders/${id}/cancel`);

      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) => (o.orderId === id ? { ...o, status: "CANCELLED" } : o)),
      );
    } catch (err) {
      console.log(err);
      toast.error("Cannot cancel order");
    }
  };

  // =========================
  // PAY AGAIN
  // =========================
  const payAgain = async (order) => {
    try {
      const res = await API.get(
        `/payment/vnpay?orderId=${order.orderId}&amount=${order.totalPrice}`,
      );

      window.location.href = res.data;
    } catch (err) {
      console.log(err);
      toast.error("Cannot process payment");
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-purple-100 text-purple-700";

      case "SHIPPING":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // STATUS TEXT
  // =========================
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "CONFIRMED":
        return "Confirmed";

      case "SHIPPING":
        return "Shipping";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
        My Orders
      </h1>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 animate-pulse h-40"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          No orders yet
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>

                  <p className="text-gray-500 mt-1">
                    {order.createAt
                      ? new Date(order.createAt).toLocaleString("vi-VN")
                      : "No date"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full sm:items-end">
                  {/* STATUS */}
                  <div
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </div>
                  {order.status !== "CANCELLED" && (
                    <div className="w-full mt-4 ">
                      <OrderTracking status={order.status} />
                    </div>
                  )}
                  {/* PAID ONLINE */}
                  {order.paymentMethod === "BANKING" && order.transactionNo && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      ✅ PAID ONLINE
                    </div>
                  )}

                  {/* ACTIONS */}
                  {order.status === "PENDING" && (
                    <div className="flex gap-2">
                      {order.paymentMethod === "BANKING" && (
                        <button
                          onClick={() => payAgain(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                        >
                          Pay Again
                        </button>
                      )}

                      <button
                        onClick={() => cancelOrder(order.orderId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ITEMS */}
              <div className="border rounded-2xl overflow-hidden">
                {order.items?.map((item, index) => (
                  <div
                    key={`${order.orderId}-${index}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b last:border-b-0"
                  >
                    <img
                      src={
                        item.imageUrl?.startsWith("http")
                          ? item.imageUrl
                          : `http://localhost:8085${item.imageUrl}`
                      }
                      alt={item.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.productName}</h3>

                      <div className="text-gray-500 text-sm mt-2">
                        Quantity: {item.quantity}
                      </div>

                      <div className="text-gray-500 text-sm">
                        Color: {item.color || "Default"}
                      </div>

                      <div className="text-gray-500 text-sm">
                        Size: {item.size || "Default"}
                      </div>
                    </div>

                    <div className="font-bold text-lg">
                      {item.price?.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-6 pt-6 border-t">
                <button
                  onClick={() => navigate(`/user/orders/${order.orderId}`)}
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl transition"
                >
                  View Detail
                </button>

                <div className="text-2xl font-bold">
                  Total: {order.totalPrice?.toLocaleString("vi-VN")} đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <div className="px-4 py-2 font-bold">
            {page + 1} / {totalPages}
          </div>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserOrders;
