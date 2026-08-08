import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiHeart,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Cart
  const { addToCart } = useContext(CartContext);

  // Wishlist
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  // Authentication
  const { user } = useContext(AuthContext);

  const liked = isInWishlist(product.id);

  // Wishlist button
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
     navigate("/login", {
     state: {
      from: window.location.pathname,
        },
     });

      return;
    }

    if (liked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Cart button
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // User not logged in
    if (!user) {
      navigate("/login", {
        state: {
          from: "/shop",
        },
      });

      return;
    }

    // User logged in
    addToCart(product);

    alert("Product added to cart!");
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">

      {/* IMAGE */}
      <div className="relative h-[380px] overflow-hidden bg-gray-100">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* BADGE */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#C49A6C] text-white text-xs font-semibold px-3 py-2 rounded-full">
            {product.badge}
          </span>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
            liked
              ? "bg-[#C49A6C] text-white"
              : "bg-white text-gray-700 hover:bg-[#C49A6C] hover:text-white"
          }`}
        >
          <FiHeart
            size={19}
            className={liked ? "fill-current" : ""}
          />
        </button>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-white text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 translate-y-16 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#C49A6C] hover:text-white"
        >
          <FiShoppingBag size={18} />

          Add to Cart
        </button>

      </div>

      {/* DETAILS */}
      <div className="p-5">

        <p className="text-sm text-gray-400">
          {product.category}
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          {product.name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-2">

          <FiStar
            size={16}
            className="text-[#C49A6C] fill-[#C49A6C]"
          />

          <span className="text-sm">
            {product.rating}
          </span>

        </div>

        {/* PRICE */}
        <div className="flex items-center gap-3 mt-3">

          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductCard;