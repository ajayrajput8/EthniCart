import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/">
          <h1 className="text-3xl font-bold text-[#C49A6C]">
            EthniCart
          </h1>
        </Link>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-700 hover:text-[#C49A6C] transition"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-gray-700 hover:text-[#C49A6C] transition"
          >
            Shop
          </Link>

          <Link
            to="/wishlist"
            className="text-gray-700 hover:text-[#C49A6C] transition flex items-center gap-2"
          >
            <FiHeart size={18} />
            Wishlist
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* USER */}
          {user ? (
            <div className="relative">

              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#C49A6C] transition"
              >
                <FiUser size={18} />

                <span className="hidden sm:block font-medium">
                  {user.name}
                </span>
              </button>

              {/* DROPDOWN */}
              {showMenu && (
                <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">

                  <Link
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <FiUser size={18} />
                    Profile
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <FiHeart size={18} />
                    Wishlist
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          ) : (
            /* LOGIN */
            <Link
              to="/login"
              className="flex items-center gap-2 border border-[#C49A6C] text-[#C49A6C] px-4 py-2 rounded-xl font-semibold hover:bg-[#C49A6C] hover:text-white transition"
            >
              <FiUser size={18} />
              Login
            </Link>
          )}

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-[#C49A6C] text-white px-4 py-2 rounded-xl hover:bg-[#a98259] transition"
          >
            <FiShoppingBag size={18} />

            <span className="hidden sm:block">
              Cart
            </span>

            {/* CART COUNT */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
