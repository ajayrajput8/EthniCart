/*
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
*/
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
} from "react-icons/fi";

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
    <main className="min-h-screen bg-[#FAF7F2]">

      {/* Header */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Shopping Cart
          </h1>

        </div>
      </section>

      {/* Cart */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {cart.length === 0 ? (

          /* Empty Cart */
          <div className="bg-white rounded-3xl text-center py-20 px-6">

            <FiShoppingBag
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add some beautiful ethnic styles to your cart.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-7 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-10">

            {/* Products */}
            <div className="lg:col-span-2 space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5"
                >

                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-40 object-cover rounded-xl"
                  />

                  {/* Product Details */}
                  <div className="flex-1">

                    <p className="text-sm text-gray-400">
                      {item.category}
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-1">
                      {item.name}
                    </h2>

                    <p className="text-lg font-bold text-gray-900 mt-3">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-[#C49A6C] hover:text-white transition"
                      >
                        <FiMinus />
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(item)
                        }
                        className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-[#C49A6C] hover:text-white transition"
                      >
                        <FiPlus />
                      </button>

                    </div>

                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="self-start text-gray-400 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={20} />
                  </button>

                </div>

              ))}

            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-7 h-fit">

              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="flex justify-between mt-7 text-gray-600">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mt-4 text-gray-600">
                <span>Total</span>

                <span>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between text-xl font-bold">
                <span>Total Price</span>

                <span>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                 to="/checkout"
                 className="block w-full mt-7 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold hover:bg-[#a98259] transition text-center"
              >
                 Proceed to Checkout
              </Link>

            </div>

          </div>

        )}

      </section>

    </main>
  );
};

export default Cart;