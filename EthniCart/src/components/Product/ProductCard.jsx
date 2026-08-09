import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
const navigate = useNavigate();

const { addToCart } = useContext(CartContext);

const {
addToWishlist,
removeFromWishlist,
isInWishlist,
} = useContext(WishlistContext);

const { user } = useContext(AuthContext);

const liked = isInWishlist(product.id);

// Open product details
const handleProductClick = () => {
navigate(`/product/${product.id}`);
};

// Wishlist
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

// Add to cart
const handleAddToCart = (e) => {
e.preventDefault();
e.stopPropagation();

if (!user) {
  navigate("/login", {
    state: {
      from: "/shop",
    },
  });

  return;
}

addToCart(product);

};

return ( <article
   onClick={handleProductClick}
   className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
 >
{/* IMAGE */} <div className="relative h-[380px] overflow-hidden bg-gray-100"> <img
       src={product.image}
       alt={product.name}
       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
     />

```
    {/* BADGE */}
    {product.badge && (
      <span className="absolute top-4 left-4 bg-[#C49A6C] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
        {product.badge}
      </span>
    )}

    {/* WISHLIST */}
    <button
      type="button"
      onClick={handleWishlist}
      aria-label="Add to wishlist"
      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
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
      className="absolute bottom-4 left-4 right-4 bg-white text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 translate-y-16 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#C49A6C] hover:text-white shadow-md"
    >
      <FiShoppingBag size={18} />
      Add to Cart
    </button>
  </div>

  {/* PRODUCT INFO */}
  <div className="p-5">
    <p className="text-xs uppercase tracking-wider text-gray-400">
      {product.category}
    </p>

    <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-1">
      {product.name}
    </h3>

    {/* RATING */}
    <div className="flex items-center gap-1.5 mt-2">
      <FiStar
        size={15}
        className="text-[#C49A6C] fill-[#C49A6C]"
      />

      <span className="text-sm font-medium text-gray-700">
        {product.rating || "4.5"}
      </span>
    </div>

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
  </div>
</article>

);
};

export default ProductCard;