import { useCart } from "../context/CartContext";
import { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");

  const [couponMessage, setCouponMessage] = useState("");

  const [discountPercent, setDiscountPercent] = useState(0);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    couponCode: "",
    paymentMethod: "COD",
  });

  const handleCheckout = async () => {
    try {
      // EMPTY CART
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      // CHECK STOCK
      const invalidItem = cartItems.find((item) => item.quantity > item.stock);

      if (invalidItem) {
        toast.error(
          `${invalidItem.name} only has ${invalidItem.stock} items left in stock`,
        );
        return;
      }

      // VALIDATION
      if (!form.customerName.trim()) {
        toast.error("Please enter customer name");
        return;
      }

      if (!/^0\d{9}$/.test(form.phone)) {
        toast.error("Phone number invalid");
        return;
      }

      if (!form.address.trim()) {
        toast.error("Please enter address");
        return;
      }
      //chan checkout neu user nhap coupon nhung chua click apply
      if (couponCode && discountPercent === 0) {
        toast.error("Please apply valid coupon first");
        return;
      }
      // PAYLOAD
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,

        couponCode: form.couponCode,
        paymentMethod: form.paymentMethod,

        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
      };

      console.log("CHECKOUT PAYLOAD:", payload);

      setPlacingOrder(true);

      const res = await API.post("/orders", payload);

      const order = res.data;

      if (form.paymentMethod === "BANKING") {
        const paymentRes = await API.get(
          `/payment/vnpay?orderId=${order.orderId}&amount=${order.totalPrice}`,
        );

        window.location.href = paymentRes.data;

        return;
      }

      toast.success("Order placed!");

      clearCart();

      navigate("/shop");
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setPlacingOrder(false);
    }
  };
  const validateCoupon = async () => {
    try {
      const res = await API.get(
        `/coupons/validate?code=${couponCode}&totalPrice=${totalPrice}`,
      );
      if (res.data.valid) {
        setDiscountPercent(res.data.discountPercent);
        setCouponMessage(res.data.message);
        toast.success(res.data.message);
      } else {
        setDiscountPercent(0);
        setCouponMessage(res.data.message);

        setForm({
          ...form,
          couponCode: "",
        });

        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Coupon validate failed");
    }
  };
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">Checkout</h1>

      <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8">
        {/* FORM */}
        <div className="grid gap-4">
          {/* CUSTOMER */}
          <input
            placeholder="Customer name"
            value={form.customerName}
            onChange={(e) =>
              setForm({
                ...form,
                customerName: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          {/* PHONE */}
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="border p-4 rounded-xl"
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            className="border p-4 rounded-xl h-32"
          />

          {/* COUPON */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);

                setForm({
                  ...form,
                  couponCode: e.target.value,
                });
              }}
              className="border p-4 rounded-xl flex-1"
            />

            <button
              onClick={validateCoupon}
              disabled={!couponCode.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl"
            >
              Apply
            </button>
          </div>

          {/* PAYMENT */}
          <div>
            <label className="block mb-2 font-medium">Payment Method</label>

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMethod: e.target.value,
                })
              }
              className="border p-4 rounded-xl bg-white w-full"
            >
              <option value="COD">Cash On Delivery</option>

              <option value="BANKING">VNPAY Banking</option>
            </select>

            {form.paymentMethod === "BANKING" && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm">
                💳 You will be redirected to VNPAY after placing the order.
              </div>
            )}

            {form.paymentMethod === "COD" && (
              <div className="mt-3 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                🚚 Pay when receiving your order.
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 border-t pt-6">
          <div className="space-y-2 mb-4">
            <div className="text-lg">
              Original: {totalPrice.toLocaleString("vi-VN")} đ
            </div>

            {discountPercent > 0 && (
              <>
                <div className="text-green-600 font-semibold">
                  Discount: -{discountPercent}%
                </div>

                <div className="text-2xl font-bold">
                  Final Total:{" "}
                  {(
                    totalPrice -
                    (totalPrice * discountPercent) / 100
                  ).toLocaleString("vi-VN")}{" "}
                  đ
                </div>
              </>
            )}

            {couponMessage && (
              <div
                className={`text-sm p-3 rounded-xl ${
                  discountPercent > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {couponMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={placingOrder}
            className="
              bg-black hover:bg-gray-900
              shadow-lg
              disabled:bg-gray-400
              transition text-white px-8 py-4
              rounded-2xl w-full font-semibold
            "
          >
            {placingOrder ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
