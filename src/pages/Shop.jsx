import { useState } from "react";
import { FiChevronDown, FiSliders } from "react-icons/fi";
import ProductCard from "../components/Product/ProductCard";
import products from "../data/products";

const Shop = () => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = ["All", "Kurtas", "Sarees", "Lehengas"];

  const filteredProducts = [...products]
    .filter(
      (product) =>
        category === "All" || product.category === category
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <main className="bg-[#faf9f7] min-h-screen">

      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10">

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">

            <div className="flex items-center gap-2 text-gray-600 mr-2 shrink-0">
              <FiSliders size={16} />

              <span className="text-sm font-medium">
                Category
              </span>
            </div>

            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === item
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

          {/* Sort */}
          <div className="relative shrink-0">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full lg:w-52 bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="default">
                Sort by: Featured
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>
            </select>

            <FiChevronDown
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

          </div>

        </div>

        {/* Product Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} products
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Products */}
        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center">

            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try selecting a different category.
            </p>

            <button
              onClick={() => setCategory("All")}
              className="mt-6 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              View All Products
            </button>

          </div>

        )}

      </section>

    </main>
  );
};

export default Shop;