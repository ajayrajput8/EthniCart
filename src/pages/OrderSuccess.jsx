import { Link, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiPackage,
} from "react-icons/fi";

const OrderSuccess = () => {
  const { state } = useLocation();

  const order = state?.order;

  return (
    <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6 py-12">

      <div className="max-w-2xl w-full">

        {/* SUCCESS CARD */}
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm">

          {/* ICON */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <FiCheckCircle
              size={45}
              className="text-green-500"
            />
          </div>

          {/* TITLE */}
          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold mt-7">
            EthniCart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Order Confirmed!
          </h1>

          <p className="text-gray-500 mt-4 leading-7">
            Thank you for shopping with EthniCart.
            Your order has been successfully placed.
          </p>

          {/* ORDER ID */}
          {order && (
            <div className="bg-[#F8F5F0] rounded-2xl p-5 mt-8">

              <div className="flex items-center justify-center gap-2 text-gray-500">
                <FiPackage />
                <span>Order ID</span>
              </div>

              <p className="text-xl font-bold text-gray-900 mt-2">
                {order.id}
              </p>

            </div>
          )}

          {/* TOTAL */}
          {order && (
            <div className="flex justify-between items-center border-t border-gray-200 mt-7 pt-6">

              <span className="text-gray-500">
                Order Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                ₹{Number(order.total).toLocaleString("en-IN")}
              </span>

            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <Link
              to="/shop"
              className="flex-1 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] transition"
            >
              <FiShoppingBag />
              Continue Shopping
            </Link>

            <Link
              to="/orders"
              className="flex-1 border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-[#C49A6C] hover:text-[#C49A6C] transition"
            >
              View My Orders
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
};

export default OrderSuccess;