import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";

import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/wishlist",
        },
      });

      return;
    }

    addToCart(product);

    alert("Product added to cart!");
  };

  // =========================
  // EMPTY WISHLIST
  // =========================
  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F5F0]">

        {/* Header */}
        <section className="bg-white py-14">
          <div className="max-w-7xl mx-auto px-6">

            <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
              EthniCart
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-3">
              Products you save for later will appear here.
            </p>

          </div>
        </section>

        {/* Empty Wishlist */}
        <section className="max-w-5xl mx-auto px-6 py-16">

          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
              <FiHeart
                size={40}
                className="text-[#C49A6C]"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Your Wishlist is Empty
            </h2>

            <p className="text-gray-500 mt-2">
              Save your favorite products here and buy them later.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>

          </div>

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
  }

  // =========================
  // WISHLIST PAGE
  // =========================
  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      {/* Header */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                My Wishlist
              </h1>

              <p className="text-gray-500 mt-3">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "product" : "products"} saved.
              </p>

            </div>

            {/* Clear Wishlist */}
            <button
              onClick={clearWishlist}
              className="self-start md:self-auto flex items-center gap-2 border border-red-200 text-red-500 px-5 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              <FiTrash2 />
              Clear Wishlist
            </button>

          </div>

        </div>
      </section>

      {/* Wishlist Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

          {wishlist.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm group"
            >

              {/* Image */}
              <div className="relative h-[350px] overflow-hidden bg-gray-100">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Remove Wishlist */}
                <button
                  type="button"
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#C49A6C] text-white flex items-center justify-center shadow-md hover:bg-red-500 transition"
                  title="Remove from wishlist"
                >
                  <FiHeart
                    size={19}
                    className="fill-current"
                  />
                </button>

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#C49A6C] text-white text-xs font-semibold px-3 py-2 rounded-full">
                    {product.badge}
                  </span>
                )}

              </div>

              {/* Details */}
              <div className="p-5">

                <p className="text-sm text-gray-400">
                  {product.category || "Product"}
                </p>

                <h2 className="text-lg font-semibold text-gray-900 mt-1">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-center gap-3 mt-3">

                  <span className="text-xl font-bold text-gray-900">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </span>

                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                    </span>
                  )}

                </div>

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-5 bg-[#C49A6C] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] transition"
                >
                  <FiShoppingBag size={18} />
                  Add to Cart
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="w-full mt-3 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  <FiTrash2 size={17} />
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Back */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 mt-10 text-gray-600 font-semibold hover:text-[#C49A6C] transition"
        >
          <FiArrowLeft />
          Back to Profile
        </Link>

      </section>

    </main>
  );
};

export default Wishlist;