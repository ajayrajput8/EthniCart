import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiPackage,
  FiHome,
  FiShoppingBag,
} from "react-icons/fi";

const OrderSuccess = () => {
  const orderId = "ETH" + Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-12">

      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-sm p-8 md:p-12 text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F3E7D8] flex items-center justify-center">
          <FiCheckCircle
            size={45}
            className="text-[#C49A6C]"
          />
        </div>

        {/* Heading */}
        <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold mt-7">
          Thank You
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-4 max-w-lg mx-auto">
          Your order has been confirmed. We will start preparing your
          beautiful ethnic collection for delivery.
        </p>

        {/* Order ID */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 mt-8">

          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="text-xl font-bold text-gray-900 mt-1">
            #{orderId}
          </p>

        </div>

        {/* Delivery Status */}
        <div className="grid grid-cols-3 gap-3 mt-8">

          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-[#F3E7D8] flex items-center justify-center">
              <FiCheckCircle className="text-[#C49A6C]" />
            </div>

            <span className="text-xs sm:text-sm font-medium">
              Confirmed
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
              <FiPackage className="text-gray-400" />
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              Preparing
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
              <FiShoppingBag className="text-gray-400" />
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              Delivered
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <Link
            to="/shop"
            className="flex-1 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold hover:bg-[#A98259] transition flex items-center justify-center gap-2"
          >
            <FiShoppingBag />
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="flex-1 border border-gray-200 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <FiHome />
            Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
};

export default OrderSuccess;