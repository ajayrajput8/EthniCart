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
  FiArrowLeft,
} from "react-icons/fi";

import { CartContext } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // =========================
  // PRICE CALCULATIONS
  // =========================
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 0 ? 0 : 0;

  const totalPrice = subtotal + deliveryCharge;

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="bg-[#faf9f7] min-h-screen">

      {/* =========================
          HEADER
      ========================= */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                Shopping Cart
              </h1>

              <p className="text-gray-500 mt-3">
                Review your selected products before checkout.
              </p>
            </div>

            {cart.length > 0 && (
              <p className="text-gray-500 font-medium">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </p>
            )}

          </div>

        </div>
      </section>

      {/* =========================
          CART CONTENT
      ========================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {cart.length === 0 ? (

          /* =========================
             EMPTY CART
          ========================= */
          <div className="bg-white rounded-3xl shadow-sm text-center py-20 px-6 max-w-2xl mx-auto">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
              <FiShoppingBag
                size={40}
                className="text-[#C49A6C]"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-3">
              You haven't added any products to your cart yet.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              <FiShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">

            {/* =========================
                PRODUCTS
            ========================= */}
            <div className="lg:col-span-2 space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100"
                >

                  <div className="flex flex-col sm:flex-row gap-5">

                    {/* IMAGE */}
                    <Link
                      to={`/product/${item.id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-32 h-48 sm:h-40 object-cover rounded-xl"
                      />
                    </Link>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between gap-4">

                        <div>
                          <p className="text-sm text-gray-400">
                            {item.category}
                          </p>

                          <Link to={`/product/${item.id}`}>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1 hover:text-[#C49A6C] transition">
                              {item.name}
                            </h2>
                          </Link>
                        </div>

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          aria-label="Remove product"
                        >
                          <FiTrash2 size={19} />
                        </button>

                      </div>

                      {/* PRICE */}
                      <p className="text-xl font-bold text-gray-900 mt-4">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>

                      {/* QUANTITY + ITEM TOTAL */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">

                        {/* QUANTITY */}
                        <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#C49A6C] hover:text-white transition"
                          >
                            <FiMinus size={16} />
                          </button>

                          <span className="w-10 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(item)
                            }
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#C49A6C] hover:text-white transition"
                          >
                            <FiPlus size={16} />
                          </button>

                        </div>

                        {/* ITEM TOTAL */}
                        <div className="text-left sm:text-right">

                          <p className="text-xs text-gray-400">
                            Item Total
                          </p>

                          <p className="font-bold text-gray-900 mt-1">
                            ₹
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

              {/* CONTINUE SHOPPING */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-gray-600 font-semibold hover:text-[#C49A6C] transition pt-2"
              >
                <FiArrowLeft size={18} />
                Continue Shopping
              </Link>

            </div>

            {/* =========================
                ORDER SUMMARY
            ========================= */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 lg:sticky lg:top-6">

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* ITEMS */}
                <div className="flex justify-between mt-7 text-gray-600">
                  <span>Items</span>

                  <span>
                    {totalItems}
                  </span>
                </div>

                {/* SUBTOTAL */}
                <div className="flex justify-between mt-4 text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* DELIVERY */}
                <div className="flex justify-between mt-4 text-gray-600">
                  <span>Delivery</span>

                  <span className="text-green-600 font-medium">
                    Free
                  </span>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200 mt-6 pt-6">

                  <div className="flex justify-between items-center">

                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#C49A6C]">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

                {/* CHECKOUT */}
                <Link
                  to="/checkout"
                  className="mt-7 w-full bg-[#C49A6C] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] transition"
                >
                  <FiShoppingBag size={18} />
                  Proceed to Checkout
                </Link>

                {/* SECURITY NOTE */}
                <p className="text-center text-xs text-gray-400 mt-4">
                  Secure checkout · Easy returns
                </p>

              </div>

            </div>

          </div>

        )}

      </section>

    </main>
  );
};

export default Cart;