import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("ethnicartOrders") || "[]"
    );

    const foundOrder = savedOrders.find(
      (item) => String(item.id) === String(id)
    );

    setOrder(foundOrder || null);
  }, [id]);

  // Order not found
  if (!order) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-md w-full">
          <FiPackage
            size={55}
            className="mx-auto text-gray-300"
          />

          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            Order Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            We couldn't find this order.
          </p>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 mt-6 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
          >
            <FiArrowLeft />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* Header */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C49A6C] transition font-medium"
          >
            <FiArrowLeft />
            Back to Orders
          </Link>

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold mt-7">
            EthniCart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Order Details
          </h1>

          <p className="text-gray-500 mt-3">
            Order ID:{" "}
            <span className="font-semibold text-gray-700">
              {order.id}
            </span>
          </p>

        </div>
      </section>

      {/* Main */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Order Status */}
        <div className="bg-white rounded-3xl p-7 shadow-sm mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                <FiPackage
                  size={27}
                  className="text-green-500"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order Confirmed
                </h2>

                <p className="text-gray-500 mt-1">
                  Your order has been placed successfully.
                </p>
              </div>

            </div>

            <span className="inline-flex w-fit px-5 py-2 rounded-full bg-green-50 text-green-600 font-semibold">
              Confirmed
            </span>

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Products */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Ordered Products
            </h2>

            <div className="mt-7 space-y-6">

              {order.items?.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-5 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-28 object-cover rounded-xl"
                  />

                  <div className="flex-1">

                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    {item.category && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.category}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      Quantity: {item.quantity}
                    </p>

                    <p className="font-semibold text-gray-900 mt-2">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Total */}
            <div className="border-t border-gray-200 mt-7 pt-6 flex justify-between items-center">

              <span className="text-gray-500 text-lg">
                Order Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ₹{Number(order.total).toLocaleString("en-IN")}
              </span>

            </div>

          </div>

          {/* Right Side */}
          <div className="space-y-8">

            {/* Payment */}
            <div className="bg-white rounded-3xl p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiCreditCard
                    size={23}
                    className="text-[#C49A6C]"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Payment
                </h2>

              </div>

              <div className="mt-5 flex justify-between">

                <span className="text-gray-500">
                  Method
                </span>

                <span className="font-semibold uppercase">
                  {order.payment}
                </span>

              </div>

              <div className="mt-4 flex justify-between">

                <span className="text-gray-500">
                  Status
                </span>

                <span className="text-green-600 font-semibold">
                  Confirmed
                </span>

              </div>

            </div>

            {/* Delivery */}
            <div className="bg-white rounded-3xl p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                  <FiMapPin
                    size={23}
                    className="text-[#C49A6C]"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>

              </div>

              {order.customer ? (
                <div className="mt-5 text-gray-600 leading-7">

                  <p className="font-semibold text-gray-900">
                    {order.customer.name}
                  </p>

                  <p>
                    {order.customer.address}
                  </p>

                  <p>
                    {order.customer.city},{" "}
                    {order.customer.state}
                  </p>

                  <p>
                    PIN Code: {order.customer.pincode}
                  </p>

                  <p className="mt-2">
                    Phone: {order.customer.phone}
                  </p>

                  <p>
                    Email: {order.customer.email}
                  </p>

                </div>
              ) : (
                <p className="text-gray-500 mt-5">
                  Delivery information unavailable.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <Link
            to="/orders"
            className="flex-1 border border-gray-200 bg-white py-4 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
          >
            View All Orders
          </Link>

          <Link
            to="/shop"
            className="flex-1 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold text-center hover:bg-[#a98259] transition"
          >
            Continue Shopping
          </Link>

        </div>

      </section>

    </main>
  );
};

export default OrderDetails;
