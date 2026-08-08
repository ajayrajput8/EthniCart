import { createContext, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = () => {
    setCart([]);
  };

  // =========================
  // SAVE ORDER
  // =========================
  const saveOrder = (order) => {
    const existingOrders = JSON.parse(
      localStorage.getItem("ethnicartOrders") || "[]"
    );

    const updatedOrders = [
      ...existingOrders,
      order,
    ];

    localStorage.setItem(
      "ethnicartOrders",
      JSON.stringify(updatedOrders)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        saveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;