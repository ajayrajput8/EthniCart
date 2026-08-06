import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id}>
              <h2>{item.name}</h2>

              <p>Price: ₹{item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <button onClick={() => decreaseQuantity(item.id)}>
                -
              </button>

              <button onClick={() => addToCart(item)}>
                +
              </button>

              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>

              <hr />
            </div>
          ))}

          <h2>Total Price: ₹{totalPrice}</h2>
        </>
      )}
    </div>
  );
};

export default Cart;