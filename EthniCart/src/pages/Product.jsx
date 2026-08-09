import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import products from "../data/products";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";

const Product = () => {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  const { user } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            The product you're looking for doesn't exist.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 bg-[#C49A6C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a98259] transition"
          >
            <FiArrowLeft />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const liked = isInWishlist(product.id);

  // =========================
  // QUANTITY
  // =========================
  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {
    if (!user) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  // =========================
  // WISHLIST
  // =========================
  const handleWishlist = () => {
    if (!user) {
      return;
    }

    if (liked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // =========================
  // RELATED PRODUCTS
  // =========================
  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  return (
    <main className="bg-[#faf9f7] min-h-screen">

      {/* =========================
          BREADCRUMB
      ========================= */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C49A6C] transition font-medium"
        >
          <FiArrowLeft />
          Back to Shop
        </Link>
      </section>

      {/* =========================
          PRODUCT
      ========================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* IMAGE */}
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm">

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] md:h-[600px] object-cover"
            />

            {product.badge && (
              <span className="absolute top-6 left-6 bg-[#C49A6C] text-white text-sm font-semibold px-4 py-2 rounded-full">
                {product.badge}
              </span>
            )}

            {/* WISHLIST */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${
                liked
                  ? "bg-[#C49A6C] text-white"
                  : "bg-white text-gray-700 hover:bg-[#C49A6C] hover:text-white"
              }`}
            >
              <FiHeart
                size={22}
                className={liked ? "fill-current" : ""}
              />
            </button>

          </div>

          {/* DETAILS */}
          <div className="pt-2">

            {/* CATEGORY */}
            <p className="text-[#C49A6C] uppercase tracking-[3px] text-sm font-semibold">
              {product.category}
            </p>

            {/* NAME */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-2 mt-5">

              <div className="flex items-center gap-1 text-[#C49A6C]">
                <FiStar
                  size={18}
                  className="fill-current"
                />
              </div>

              <span className="font-semibold text-gray-800">
                {product.rating || "4.5"}
              </span>

              <span className="text-gray-400">
                ·
              </span>

              <span className="text-gray-500">
                Customer rating
              </span>

            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4 mt-7">

              <span className="text-3xl font-bold text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}

            </div>

            {/* DESCRIPTION */}
            <div className="border-t border-gray-200 mt-8 pt-8">

              <h2 className="text-lg font-semibold text-gray-900">
                Product Description
              </h2>

              <p className="text-gray-500 leading-7 mt-3">
                {product.description ||
                  "Discover premium quality and timeless style with this EthniCart product. Designed with attention to detail and made for comfortable everyday wear."}
              </p>

            </div>

            {/* QUANTITY */}
            <div className="mt-8">

              <p className="text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </p>

              <div className="flex items-center border border-gray-200 bg-white rounded-xl w-fit overflow-hidden">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                >
                  <FiMinus />
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                >
                  <FiPlus />
                </button>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#C49A6C] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#a98259] transition"
              >
                <FiShoppingBag size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`sm:w-14 h-14 rounded-xl border flex items-center justify-center transition ${
                  liked
                    ? "bg-[#C49A6C] border-[#C49A6C] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-[#C49A6C] hover:text-[#C49A6C]"
                }`}
              >
                <FiHeart
                  size={21}
                  className={liked ? "fill-current" : ""}
                />
              </button>

            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white rounded-2xl p-5">
                <p className="text-sm text-gray-400">
                  Category
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {product.category}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5">
                <p className="text-sm text-gray-400">
                  Availability
                </p>

                <p className="font-semibold text-green-600 mt-1">
                  In Stock
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          RELATED PRODUCTS
      ========================= */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">

          <div className="border-t border-gray-200 pt-12">

            <p className="text-[#C49A6C] uppercase tracking-[3px] text-sm font-semibold">
              You may also like
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Related Products
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

              {relatedProducts.map((item) => (

                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >

                  <div className="h-64 overflow-hidden bg-gray-100">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                  </div>

                  <div className="p-5">

                    <p className="text-sm text-gray-400">
                      {item.category}
                    </p>

                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#C49A6C] transition">
                      {item.name}
                    </h3>

                    <p className="text-lg font-bold text-gray-900 mt-3">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>
      )}

    </main>
  );
};

export default Product;