import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    setLoading(true);

    API.get(`/orders/${id}`)
      .then((res) => {
        console.log("ORDER:", res.data);

        setOrder(res.data);

        setItems(Array.isArray(res.data.items) ? res.data.items : []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  // =========================
  // TOTALS
  // =========================

  const subtotal = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const discount = order?.discountPercent
    ? (subtotal * order.discountPercent) / 100
    : 0;

  const finalTotal = subtotal - discount;

  // =========================
  // STATUS
  // =========================

  const formatStatus = (status) => {
    if (!status) return "";

    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const steps = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED"];

  const getStepIndex = (status) => {
    const index = steps.indexOf(status);

    return index === -1 ? 0 : index;
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-6">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">Order #{id}</h1>
      </div>

      {/* SUMMARY */}

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* ITEMS */}

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-400 mb-2">Items</p>

          <h2 className="text-3xl font-bold">{items.length}</h2>
        </div>

        {/* TOTAL */}

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-400 mb-2">Total</p>

          <h2 className="text-3xl font-bold text-blue-600">
            {finalTotal.toLocaleString("vi-VN")} đ
          </h2>
        </div>

        {/* STATUS */}

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-400 mb-2">Status</p>

          <div className="mt-2">
            <span
              className={`px-4 py-2 rounded-full text-white text-sm font-semibold
              ${
                order?.status === "COMPLETED"
                  ? "bg-green-500"
                  : order?.status === "PENDING"
                    ? "bg-yellow-500"
                    : order?.status === "SHIPPING"
                      ? "bg-blue-500"
                      : "bg-red-500"
              }`}
            >
              {formatStatus(order?.status)}
            </span>
          </div>
        </div>
      </div>

      {/* TIMELINE */}

      <div className="bg-white rounded-2xl shadow p-8 mb-6">
        <h2 className="text-xl font-bold mb-8">Order Progress</h2>

        <div className="relative flex justify-between items-center">
          {/* LINE */}

          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200"></div>

          {/* ACTIVE LINE */}

          <div
            className="absolute top-5 left-0 h-1 bg-blue-500 transition-all duration-500"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          {/* STEPS */}

          {steps.map((step, index) => {
            const isDone = index < currentStep;

            const isCurrent = index === currentStep;

            return (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center"
              >
                {/* CIRCLE */}

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg
                  ${isDone ? "bg-green-500" : ""}
                  ${isCurrent ? "bg-blue-500 scale-110" : ""}
                  ${!isDone && !isCurrent ? "bg-gray-300" : ""}
                `}
                >
                  {isDone ? "✔" : index + 1}
                </div>

                {/* LABEL */}

                <p
                  className={`mt-3 text-sm font-semibold
                  ${isDone ? "text-green-600" : ""}
                  ${isCurrent ? "text-blue-600" : ""}
                  ${!isDone && !isCurrent ? "text-gray-400" : ""}
                `}
                >
                  {formatStatus(step)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-10">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>

            <div className="h-6 bg-gray-200 rounded"></div>

            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-gray-400 text-lg">No items found</p>
        </div>
      ) : (
        <>
          {/* TABLE */}

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="p-5 text-left">Product</th>

                  <th className="text-left">Price</th>

                  <th className="text-left">Quantity</th>

                  <th className="text-left">Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* PRODUCT */}

                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.imageUrl
                              ? item.imageUrl.startsWith("http")
                                ? item.imageUrl
                                : `http://localhost:8085/${item.imageUrl.replace(
                                    /^\/+/,
                                    "",
                                  )}`
                              : "https://placehold.co/80x80"
                          }
                          alt={item.productName}
                          className="w-20 h-20 rounded-xl object-cover border"
                        />

                        <div>
                          <h3 className="font-bold text-lg">
                            {item.productName}
                          </h3>

                          <p className="text-gray-500 text-sm">
                            Color: {item.color || "Default"}
                          </p>

                          <p className="text-gray-500 text-sm">
                            Size: {item.size || "Default"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}

                    <td className="font-semibold">
                      {item.price?.toLocaleString("vi-VN")} đ
                    </td>

                    {/* QTY */}

                    <td className="font-semibold">{item.quantity}</td>

                    {/* TOTAL */}

                    <td className="font-bold text-blue-600">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAYMENT SUMMARY */}

            <div className="border-t bg-gray-50 p-8">
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
                    Discount ({order.discountPercent}%)
                  </span>

                  <span className="font-bold">
                    -{discount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}

              {/* COUPON */}

              {order?.couponCode && (
                <div className="mb-5 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium">
                  Coupon: {order.couponCode}
                </div>
              )}

              {/* FINAL TOTAL */}

              <div className="border-t pt-5 flex justify-between items-center">
                <span className="text-2xl font-bold">Final Total</span>

                <span className="text-4xl font-bold text-blue-600">
                  {finalTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderDetail;
