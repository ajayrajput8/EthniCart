import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiPackage,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("ethnicartOrders") || "[]"
    );

    // Newest order first
    setOrders([...savedOrders].reverse());
  }, []);

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

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3">
            Track and view your previous orders.
          </p>

        </div>
      </section>

      {/* =========================
          ORDERS
      ========================= */}
      <section className="max-w-5xl mx-auto px-6 py-12">

        {orders.length === 0 ? (

          /* =========================
             NO ORDERS
          ========================= */
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

            <FiPackage
              size={60}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your completed orders will appear here.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>

          </div>

        ) : (

          /* =========================
             ORDER LIST
          ========================= */
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-3xl p-7 shadow-sm"
              >

                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="text-lg font-bold text-gray-900">
                      {order.id}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <span className="px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-semibold">
                      Confirmed
                    </span>

                    <span className="px-4 py-2 rounded-full bg-[#C49A6C]/10 text-[#C49A6C] text-sm font-semibold uppercase">
                      {order.payment}
                    </span>

                  </div>

                </div>

                {/* Products */}
                <div className="border-t border-gray-100 mt-6 pt-6 space-y-5">

                  {order.items?.slice(0, 2).map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-4"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-xl"
                      />

                      <div className="flex-1">

                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {item.category || "Product"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <p className="font-semibold mt-2">
                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                  ))}

                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500">
                      + {order.items.length - 2} more product(s)
                    </p>
                  )}

                </div>

                {/* Customer Details */}
                {order.customer && (
                  <div className="border-t border-gray-100 mt-6 pt-6">

                    <h3 className="font-bold text-gray-900 mb-3">
                      Delivery Information
                    </h3>

                    <p className="text-gray-600">
                      {order.customer.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {order.customer.address},{" "}
                      {order.customer.city},{" "}
                      {order.customer.state} -{" "}
                      {order.customer.pincode}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Phone: {order.customer.phone}
                    </p>

                  </div>
                )}

                {/* Bottom */}
                <div className="border-t border-gray-100 mt-6 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <span className="text-gray-500">
                      Order Total
                    </span>

                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹
                      {Number(order.total || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  {/* View Details */}
                  <Link
                    to={`/orders/${order.id}`}
                    state={{ order }}
                    className="inline-flex items-center justify-center gap-2 bg-[#C49A6C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
                  >
                    View Details
                    <FiArrowRight />
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Back to Profile */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 mt-8 text-gray-600 font-semibold hover:text-[#C49A6C] transition"
        >
          <FiArrowLeft />
          Back to Profile
        </Link>

      </section>

    </main>
  );
};

export default Orders;