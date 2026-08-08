import { useState } from "react";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import ProductCard from "../components/Product/ProductCard";
import products from "../data/products";

const Shop = () => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = ["All", "Kurtas", "Sarees", "Lehengas"];

  // Filter products
  let filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  // Sort products
  if (sort === "low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  return (
    <main className="bg-[#FAF7F2] min-h-screen">

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            EthniCart Collection
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-3">
            Shop
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto mt-5">
            Explore our collection of beautiful ethnic wear,
            carefully selected for every occasion.
          </p>

        </div>
      </section>

      {/* Shop Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 text-gray-700 mr-2">
              <FiFilter />
              <span className="font-medium">Category:</span>
            </div>

            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  category === item
                    ? "bg-[#C49A6C] text-white"
                    : "bg-white text-gray-700 hover:bg-[#C49A6C] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

          {/* Sort */}
          <div className="relative">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3 pr-10 text-gray-700 outline-none cursor-pointer"
            >
              <option value="default">Sort by</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <FiChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            />

          </div>

        </div>

        {/* Product Count */}
        <div className="mb-6">
          <p className="text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try selecting another category.
            </p>
          </div>
        )}

      </section>

    </main>
  );
};

export default Shop;