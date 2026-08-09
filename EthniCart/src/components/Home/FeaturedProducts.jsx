import { Link } from "react-router-dom";
import ProductCard from "../Product/ProductCard";
import products from "../../data/products";

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          
          <div>
            <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
              Our Collection
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Featured Products
            </h2>

            <p className="text-gray-500 mt-4 max-w-xl">
              Handpicked ethnic styles designed to make every occasion special.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-[#C49A6C] font-semibold hover:underline"
          >
            View All Products →
          </Link>

        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;