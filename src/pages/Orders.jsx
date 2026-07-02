import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("");
  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = () => {
    api
      .get(
        `/orders/admin/orders/filter?page=${page}&size=10&status=${statusFilter}&paymentMethod=${paymentFilter}`,
      )
      .then((res) => {
        let data = res.data.content || [];

        // Banking auto confirmed
        data = data.map((order) => {
          if (order.paymentMethod === "BANKING" && order.status === "PENDING") {
            return {
              ...order,
              status: "CONFIRMED",
            };
          }
          return order;
        });

        setOrders(data);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentFilter]);

  // =========================
  // VIEW DETAIL
  // =========================

  const handleViewDetail = async (orderId) => {
    try {
      setLoadingDetail(true);

      const res = await api.get(`/orders/admin/orders/${orderId}`);

      setSelectedOrder(res.data);

      setShowModal(true);
    } catch (err) {
      console.log(err);

      toast.error("Load order detail failed");
    } finally {
      setLoadingDetail(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = (e, id, status) => {
    e.stopPropagation();

    api
      .put(`/orders/${id}/status?status=${status}`)
      .then(() => {
        toast.success("Order updated");

        fetchOrders();

        // UPDATE MODAL REALTIME

        if (selectedOrder?.orderId === id) {
          setSelectedOrder((prev) => ({
            ...prev,
            status,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  // =========================
  // PDF/EXCEL
  // =========================
  const downloadFile = async (type) => {
    try {
      const res = await api.get(`/orders/admin/orders/export/${type}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `orders.${type === "excel" ? "xlsx" : "pdf"}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Export ${type.toUpperCase()} success`);
    } catch (err) {
      console.log(err);
      toast.error("Export failed");
    }
  };
  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";

      case "PENDING":
        return "bg-yellow-500";

      case "SHIPPING":
        return "bg-blue-500";

      case "CANCELLED":
        return "bg-red-500";

      case "CONFIRMED":
        return "bg-purple-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <div className="bg-white px-4 py-2 rounded-xl shadow text-gray-600">
          Total Orders:{" "}
          <span className="font-bold text-black">{orders.length}</span>
        </div>
      </div>
      <button
        onClick={() => downloadFile("excel")}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Export Excel
      </button>

      <button
        onClick={() => downloadFile("pdf")}
        className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2"
      >
        Export PDF
      </button>
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPING">Shipping</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="">All Payment</option>
          <option value="COD">COD</option>
          <option value="BANKING">BANKING</option>
        </select>
      </div>
      {/* TABLE */}

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4">ID</th>

              <th>Total</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(orders) &&
              orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-bold">#{o.id}</td>

                  <td className="font-semibold text-blue-600">
                    {o.totalPrice?.toLocaleString("vi-VN")} đ
                  </td>

                  <td>
                    <span
                      className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(
                        o.status,
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="flex gap-2 justify-center py-3">
                    <button
                      onClick={() => handleViewDetail(o.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      View
                    </button>

                    {o.status === "PENDING" && (
                      <button
                        onClick={(e) => updateStatus(e, o.id, "CONFIRMED")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✔ Confirm
                      </button>
                    )}

                    {o.status === "CONFIRMED" && (
                      <button
                        onClick={(e) => updateStatus(e, o.id, "SHIPPING")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        🚚 Ship
                      </button>
                    )}

                    {o.status === "SHIPPING" && (
                      <button
                        onClick={(e) => updateStatus(e, o.id, "COMPLETED")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✔ Complete
                      </button>
                    )}

                    {!["COMPLETED", "CANCELLED"].includes(o.status) && (
                      <button
                        onClick={(e) => updateStatus(e, o.id, "CANCELLED")}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✖ Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-white shadow rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <div className="font-semibold text-gray-700">
          Page {page + 1} / {totalPages}
        </div>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-white shadow rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 animate-fadeIn">
            {/* HEADER */}

            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold">
                  Order #{selectedOrder.orderId}
                </h2>

                <p className="text-gray-500 mt-1">Order detail information</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-500 text-xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* CUSTOMER INFO */}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-500 mb-1">Customer</p>

                <p className="font-bold text-lg">
                  {selectedOrder.customerName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-500 mb-1">Phone</p>

                <p className="font-bold text-lg">{selectedOrder.phone}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-500 mb-1">Address</p>

                <p className="font-bold text-lg">{selectedOrder.address}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-500 mb-1">Payment</p>

                <div>
                  <p className="font-bold text-lg">
                    {selectedOrder.paymentMethod}
                  </p>

                  {selectedOrder.transactionNo && (
                    <div className="mt-3 text-sm text-green-600">
                      <p>✅ Paid Online</p>
                      <p>Transaction: {selectedOrder.transactionNo}</p>
                      <p>Bank: {selectedOrder.bankCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div className="mb-8">
              <span
                className={`px-5 py-2 rounded-full text-white font-semibold ${getStatusColor(
                  selectedOrder.status,
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            {/* ITEMS */}

            <div className="space-y-5 mb-8">
              {selectedOrder.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 border rounded-2xl p-5 hover:shadow-md transition"
                >
                  <img
                    src={
                      item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : `${import.meta.env.VITE_API_HOST}${item.imageUrl}`
                    }
                    alt=""
                    className="w-28 h-28 object-cover rounded-2xl border"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2">
                      {item.productName}
                    </h3>

                    <div className="space-y-1 text-gray-600">
                      <p>Quantity: {item.quantity}</p>

                      <p>Color: {item.color || "Default"}</p>

                      <p>Size: {item.size || "Default"}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-500 mb-1">Price</p>

                    <div className="font-bold text-2xl text-blue-600">
                      {item.price.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAYMENT SUMMARY */}

            {(() => {
              const subtotal = selectedOrder.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              );

              const discount =
                subtotal - (selectedOrder?.totalPrice || subtotal);

              return (
                <div className="border-t bg-gray-50 rounded-2xl p-6">
                  {/* SUBTOTAL */}

                  <div className="flex justify-between mb-4 text-lg">
                    <span className="text-gray-600">Subtotal</span>

                    <span className="font-semibold">
                      {subtotal.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  {/* DISCOUNT */}

                  {discount > 0 && (
                    <div className="flex justify-between mb-4 text-lg text-green-600">
                      <span className="font-semibold">
                        Discount ({selectedOrder.discountPercent}%)
                      </span>

                      <span className="font-bold">
                        -{discount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  )}

                  {/* COUPON */}

                  {selectedOrder.couponCode && (
                    <div className="flex justify-between mb-4 text-lg">
                      <span className="text-gray-600">Coupon</span>

                      <span className="font-semibold text-green-600">
                        {selectedOrder.couponCode}
                      </span>
                    </div>
                  )}

                  {/* FINAL TOTAL */}

                  <div className="border-t pt-5 flex justify-between items-center">
                    <span className="text-2xl font-bold">Final Total</span>

                    <span className="text-4xl font-bold text-blue-600">
                      {selectedOrder.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
