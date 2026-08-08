import { Link, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <main className="min-h-screen bg-gray-50 py-16">

      <div className="max-w-2xl mx-auto px-6">

        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <FiCheckCircle
              size={45}
              className="text-green-500"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mt-7">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 mt-3">
            Thank you for shopping with EthniCart.
          </p>

          {/* Order Details */}
          {order ? (
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-left">

              {/* Order ID */}
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Order ID
                </span>

                <span className="font-semibold">
                  {order.id}
                </span>
              </div>

              {/* Payment */}
              <div className="flex justify-between mt-4">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-semibold uppercase">
                  {order.payment}
                </span>
              </div>

              {/* Total */}
              <div className="border-t mt-5 pt-5 flex justify-between text-lg font-bold">
                <span>
                  Total
                </span>

                <span>
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>

            </div>
          ) : (
            <p className="mt-8 text-gray-500">
              Your order has been placed successfully.
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <Link
              to="/shop"
              className="flex-1 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              Continue Shopping
            </Link>

            <Link
              to="/profile"
              className="flex-1 border border-gray-200 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <FiShoppingBag />
              My Profile
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
};

export default OrderSuccess;