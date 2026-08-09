import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { FiCheckCircle } from "react-icons/fi";

import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Checkout = () => {
  const {
    cart,
    clearCart,
    saveOrder,
  } = useContext(CartContext);

  const {
    user,
    updateUser,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  // =========================
  // DELIVERY FORM
  // =========================

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================
  // PAYMENT
  // =========================

  const [payment, setPayment] = useState("cod");

  // =========================
  // LOAD USER DATA
  // =========================

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,

      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.location || "",
    }));
  }, [user]);

  // =========================
  // CALCULATE TOTAL
  // =========================

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = {
      id: "EC" + Date.now(),

      userId: user.id,

      customer: {
        id: user.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },

      date: new Date().toISOString(),

      status: "Pending",

      total: Number(totalPrice),

      payment: payment,

      items: cart.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    console.log(
      "NEW ORDER:",
      order
    );

    // =========================
    // SAVE ORDER
    // =========================

    saveOrder(order);

    // =========================
    // UPDATE CUSTOMER DATA
    // =========================

    const previousOrders =
      Number(user.orders || 0);

    const previousSpent =
      Number(user.spent || 0);

    const updatedUser = {
      phone: form.phone,
      location: form.city,

      orders:
        previousOrders + 1,

      spent:
        previousSpent +
        Number(totalPrice),
    };

    updateUser(updatedUser);

    // =========================
    // CLEAR CART
    // =========================

    clearCart();

    // =========================
    // SUCCESS PAGE
    // =========================

    navigate("/order-success", {
      state: {
        order,
      },
    });
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-md w-full">

          <FiCheckCircle
            size={55}
            className="mx-auto text-[#C49A6C]"
          />

          <h1 className="text-2xl font-bold mt-5 text-gray-900">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add some products before checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-6 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }

  // =========================
  // CHECKOUT PAGE
  // =========================

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* =========================
          HEADER
      ========================= */}

      <section className="bg-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3 text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-3">
            Complete your details and place your order.
          </p>

        </div>

      </section>

      {/* =========================
          CHECKOUT
      ========================= */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-10">

          {/* =========================
              CUSTOMER DETAILS
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm"
          >

            <h2 className="text-2xl font-bold mb-7 text-gray-900">
              Delivery Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {/* NAME */}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

              {/* PHONE */}

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

              {/* PINCODE */}

              <input
                type="text"
                name="pincode"
                placeholder="PIN Code"
                value={form.pincode}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

              {/* CITY */}

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

              {/* STATE */}

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#C49A6C]"
              />

            </div>

            {/* ADDRESS */}

            <textarea
              name="address"
              placeholder="Full Delivery Address"
              value={form.address}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-5 outline-none focus:ring-2 focus:ring-[#C49A6C]"
            />

            {/* =========================
                PAYMENT
            ========================= */}

            <h2 className="text-2xl font-bold mt-10 mb-5 text-gray-900">
              Payment Method
            </h2>

            <div className="space-y-3">

              {/* COD */}

              <label
                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                  payment === "cod"
                    ? "border-[#C49A6C] bg-[#C49A6C]/5"
                    : "border-gray-200"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    payment === "cod"
                  }
                  onChange={(e) =>
                    setPayment(
                      e.target.value
                    )
                  }
                />

                <span className="font-medium">
                  Cash on Delivery
                </span>

              </label>

              {/* ONLINE */}

              <label
                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                  payment === "online"
                    ? "border-[#C49A6C] bg-[#C49A6C]/5"
                    : "border-gray-200"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    payment === "online"
                  }
                  onChange={(e) =>
                    setPayment(
                      e.target.value
                    )
                  }
                />

                <span className="font-medium">
                  Online Payment
                </span>

              </label>

            </div>

            {/* =========================
                PLACE ORDER
            ========================= */}

            <button
              type="submit"
              className="w-full mt-8 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              Place Order
            </button>

          </form>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div className="bg-white rounded-2xl p-7 h-fit shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Your Order
            </h2>

            <div className="mt-6 space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>

                    <p className="font-semibold mt-1">
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="border-t border-gray-200 mt-7 pt-6 flex justify-between text-xl font-bold">

              <span>
                Total
              </span>

              <span>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Checkout;
