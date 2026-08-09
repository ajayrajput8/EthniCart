import { useContext } from "react";
import { Link } from "react-router-dom";
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

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = (product) => {
    if (!user) {
      return;
    }

    addToCart(product);
    removeFromWishlist(product.id);
  };

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

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
                My Wishlist
              </h1>

              <p className="text-gray-500 mt-3">
                Save your favorite products and shop them later.
              </p>
            </div>

            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="flex items-center justify-center gap-2 border border-red-200 text-red-500 px-5 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                <FiTrash2 />
                Clear Wishlist
              </button>
            )}

          </div>

        </div>
      </section>

      {/* =========================
          WISHLIST
      ========================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {wishlist.length === 0 ? (

          /* =========================
             EMPTY WISHLIST
          ========================= */
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto">

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
              You haven't added any products to your wishlist yet.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 bg-[#C49A6C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
            >
              <FiShoppingBag />
              Explore Products
            </Link>

          </div>

        ) : (

          /* =========================
             WISHLIST PRODUCTS
          ========================= */
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {wishlist.map((product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm group"
                >

                  {/* IMAGE */}
                  <div className="relative h-[350px] overflow-hidden bg-gray-100">

                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* WISHLIST REMOVE */}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#C49A6C] text-white flex items-center justify-center shadow-md hover:bg-red-500 transition"
                    >
                      <FiHeart
                        size={19}
                        className="fill-current"
                      />
                    </button>

                    {/* BADGE */}
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-[#C49A6C] text-white text-xs font-semibold px-3 py-2 rounded-full">
                        {product.badge}
                      </span>
                    )}

                  </div>

                  {/* DETAILS */}
                  <div className="p-5">

                    <p className="text-sm text-gray-400">
                      {product.category}
                    </p>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1 hover:text-[#C49A6C] transition">
                        {product.name}
                      </h3>
                    </Link>

                    {/* PRICE */}
                    <div className="flex items-center gap-3 mt-3">

                      <span className="text-xl font-bold text-gray-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>

                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                        </span>
                      )}

                    </div>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-5 bg-[#C49A6C] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] transition"
                    >
                      <FiShoppingBag size={18} />
                      Add to Cart
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* BACK TO SHOP */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-10 text-gray-600 font-semibold hover:text-[#C49A6C] transition"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </>
        )}

      </section>

    </main>
  );
};

export default Wishlist;