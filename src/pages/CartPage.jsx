import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div
          className="
      flex
      flex-col
      items-center
      justify-center
      py-24
      text-center
      animate-fade-in
    "
        >
          <div
            className="
        w-28
        h-28
        rounded-full
        bg-gray-100
        flex
        items-center
        justify-center
        mb-6
      "
          >
            🛒
          </div>

          <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>

          <p className="text-gray-500 max-w-md mb-8">
            Looks like you haven't added any products yet. Start exploring our
            latest collection.
          </p>

          <Link
            to="/shop"
            className="
        bg-black
        text-white
        px-8
        py-4
        rounded-2xl
        hover:bg-gray-800
        transition
      "
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="
          border rounded-3xl p-6 flex items-center gap-6
          shadow-sm hover:shadow-lg transition-all
        "
                >
                  <img
                    src={
                      item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : `http://localhost:8085${item.imageUrl}`
                    }
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-2xl"
                  />

                  <div className="flex-1">
                    <h2 className="font-bold text-xl">{item.name}</h2>

                    <p className="text-gray-500">Color: {item.color || "-"}</p>
                    <p className="text-gray-500">Size: {item.size || "-"}</p>
                    <p className="text-sm text-gray-400">Stock: {item.stock}</p>
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-red-500 mt-1">
                        Maximum stock reached
                      </p>
                    )}
                    <p className="text-green-600 font-bold">
                      {item.price?.toLocaleString()} đ
                    </p>
                  </div>

                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) return;

                        updateQuantity(
                          item.id,
                          item.color,
                          item.size,
                          item.quantity - 1,
                        );
                      }}
                      className={`px-4 py-2 ${
                        item.quantity <= 1
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      -
                    </button>

                    <div className="px-5 font-semibold">{item.quantity}</div>

                    <button
                      onClick={() => {
                        if (item.quantity >= item.stock) return;

                        updateQuantity(
                          item.id,
                          item.color,
                          item.size,
                          item.quantity + 1,
                        );
                      }}
                      className={`px-4 py-2 ${
                        item.quantity >= item.stock
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.color, item.size)
                    }
                    className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all text-white px-4 py-2 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="sticky top-24 h-fit border rounded-3xl p-8 shadow-lg bg-white">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 border-b pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold mt-6">
                <span>Total</span>
                <span>{totalPrice.toLocaleString()} đ</span>
              </div>

              <Link
                to="/checkout"
                className="
                  mt-8
                  block 
                  w-full 
                  text-center
                  bg-black
                  hover:bg-gray-800
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  text-white 
                  py-4 
                  rounded-2xl
                  font-semibold 
                "
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={clearCart}
                className="
        mt-4 w-full py-4 rounded-2xl
        border hover:bg-gray-50 transition
      "
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
