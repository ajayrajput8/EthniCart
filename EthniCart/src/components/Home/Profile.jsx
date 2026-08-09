import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiArrowRight,
} from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-md w-full">
          <FiUser
            size={55}
            className="mx-auto text-[#C49A6C]"
          />

          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            Please Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access your profile.
          </p>

          <Link
            to="/login"
            className="inline-block mt-6 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
          >
            Login
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
          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            My Profile
          </h1>

          <p className="text-gray-500 mt-3">
            Manage your account and shopping activity.
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* User Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">

            <div className="w-24 h-24 rounded-full bg-[#C49A6C]/10 flex items-center justify-center mx-auto">
              <FiUser
                size={42}
                className="text-[#C49A6C]"
              />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mt-5">
              {user.name}
            </h2>

            <div className="flex items-center justify-center gap-2 text-gray-500 mt-2">
              <FiMail />
              <span>{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-8 border border-red-200 text-red-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition"
            >
              <FiLogOut />
              Logout
            </button>

          </div>

          {/* Dashboard */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">

            {/* Orders */}
            <Link
              to="/orders"
              className="bg-white rounded-3xl p-7 shadow-sm hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center">
                <FiShoppingBag
                  size={25}
                  className="text-[#C49A6C]"
                />
              </div>

              <h2 className="text-xl font-bold mt-6">
                My Orders
              </h2>

              <p className="text-gray-500 mt-2">
                View your previous orders and order details.
              </p>

              <div className="flex items-center gap-2 text-[#C49A6C] font-semibold mt-5">
                View Orders
                <FiArrowRight />
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="bg-white rounded-3xl p-7 shadow-sm hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center">
                <FiHeart
                  size={25}
                  className="text-[#C49A6C]"
                />
              </div>

              <h2 className="text-xl font-bold mt-6">
                My Wishlist
              </h2>

              <p className="text-gray-500 mt-2">
                View products you have saved for later.
              </p>

              <div className="flex items-center gap-2 text-[#C49A6C] font-semibold mt-5">
                View Wishlist
                <FiArrowRight />
              </div>
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
};

export default Profile;