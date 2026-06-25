import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const getCartKey = () => {
  const userId = localStorage.getItem("userId");

  return userId ? `cart_${userId}` : "cart_guest";
};
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem(getCartKey());

    setCartItems(saved ? JSON.parse(saved) : []);
  }, []);
  //save localStorage
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  }, [cartItems]);

  //add to cart
  const addToCart = (product, quantity = 1, color = null, size = null) => {
    const existing = cartItems.find(
      (item) =>
        item.id === product.id && item.color === color && item.size === size,
    );
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item === existing
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
          color,
          size,
        },
      ]);
    }
  };
  //Remove
  const removeFromCart = (id, color, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.color === color && item.size === size),
      ),
    );
  };
  //Update quantity
  const updateQuantity = (id, color, size, quantity) => {
    if (quantity <= 0) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  //CLEAR
  const clearCart = () => {
    setCartItems([]);
  };
  //TOTAL
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  //COUNT
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
