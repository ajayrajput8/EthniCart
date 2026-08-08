import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLogOut,
  FiShoppingBag,
  FiHeart,
} from "react-icons/fi";

import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If user is not logged in
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <FiUser
              size={60}
              className="mx-auto text-gray-300"
            />

            <h1 className="text-3xl font-bold text-gray-900 mt-6">
              Please Login
            </h1>

            <p className="text-gray-500 mt-3">
              Login to access your profile.
            </p>

            <Link
              to="/login"
              className="inline-block mt-7 bg-[#C49A6C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
          EthniCart
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
          My Profile
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">

            <div className="w-24 h-24 mx-auto rounded-full bg-[#C49A6C] flex items-center justify-center text-white">
              <FiUser size={42} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mt-6">
              {user.name}
            </h2>

            <div className="flex items-center justify-center gap-2 text-gray-500 mt-2">
              <FiMail size={16} />
              <span>{user.email}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-8 border border-red-200 text-red-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition"
            >
              <FiLogOut size={18} />
              Logout
            </button>

          </div>

          {/* Account Options */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

            {/* Orders */}
            <Link
              to="/cart"
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center text-[#C49A6C] group-hover:bg-[#C49A6C] group-hover:text-white transition">
                <FiShoppingBag size={26} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-6">
                My Orders
              </h2>

              <p className="text-gray-500 mt-2">
                View your cart and shopping activity.
              </p>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center text-[#C49A6C] group-hover:bg-[#C49A6C] group-hover:text-white transition">
                <FiHeart size={26} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-6">
                Wishlist
              </h2>

              <p className="text-gray-500 mt-2">
                View products you have saved.
              </p>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Profile;