import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Orders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("ethnicartOrders");

    if (!savedOrders) {
      setOrders([]);
      return;
    }

    const allOrders = JSON.parse(savedOrders);

    // Show only logged-in user's orders
    const userOrders = allOrders.filter((order) => {
      if (!order.customer) return false;

      return (
        order.customer.email?.toLowerCase() ===
        user?.email?.toLowerCase()
      );
    });

    setOrders([...userOrders].reverse());
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 sm:px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

          <div>
            <p className="text-[#C49A6C] uppercase tracking-[3px] font-semibold text-sm">
              EthniCart
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              View your order history and order details.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="bg-[#C49A6C] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a98259] transition"
          >
            ↻ Refresh
          </button>

        </div>

        {/* USER INFO */}
        {user && (
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">

            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Logged in as
            </p>

            <p className="font-semibold text-gray-900 mt-1">
              {user.name}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>

          </div>
        )}

        {/* NO ORDERS */}
        {orders.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your placed orders will appear here.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-6 bg-[#C49A6C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          /* ORDERS */
          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border p-5 md:p-6"
              >

                {/* ORDER HEADER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Order ID
                    </p>

                    <p className="font-bold text-gray-900 mt-1">
                      {order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Date
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {order.date
                        ? new Date(order.date).toLocaleString("en-IN")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total
                    </p>

                    <p className="font-bold text-gray-900 mt-1">
                      ₹
                      {Number(order.total || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Status
                    </p>

                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {order.status || "Confirmed"}
                    </span>
                  </div>

                </div>

                {/* PRODUCTS */}
                <div className="border-t mt-5 pt-5">

                  <p className="text-sm font-semibold text-gray-800 mb-4">
                    Ordered Products
                  </p>

                  <div className="flex flex-wrap gap-4">

                    {order.items?.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div>

                          <p className="font-semibold text-sm text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                          <p className="text-sm font-semibold mt-1">
                            ₹
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

                {/* PAYMENT */}
                <div className="border-t mt-5 pt-5 flex flex-col sm:flex-row sm:justify-between gap-4">

                  <div>

                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Payment
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {order.payment === "online"
                        ? "Online Payment"
                        : "Cash on Delivery"}
                    </p>

                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 text-center transition"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
};

export default Orders;