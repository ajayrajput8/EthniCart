import { useMemo, useState, useEffect } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
//import products from "../data/products";

const API_URL = "http://localhost:8000/api";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  const categories = ["All", "Kurtas", "Sarees", "Lehengas"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Product fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;

        const searchText = search.trim().toLowerCase();

        const matchesSearch =
          !searchText ||
          product.name?.toLowerCase().includes(searchText) ||
          product.category?.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "low") {
          return Number(a.price) - Number(b.price);
        }

        if (sort === "high") {
          return Number(b.price) - Number(a.price);
        }

        return 0;
      });
  }, [products, category, sort, search]);

  const clearFilters = () => {
    setCategory("All");
    setSort("default");
    setSearch("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C49A6C] rounded-full animate-spin" />

            <p className="text-gray-500 mt-4 text-sm">
              Loading products...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // API ERROR
  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white border border-red-100 rounded-2xl sm:rounded-3xl py-16 px-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <FiX size={22} className="text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              Unable to load products
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-6
                bg-gray-900
                hover:bg-[#C49A6C]
                text-white
                px-6
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F7] min-h-screen">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">

        {/* PAGE HEADER */}
        <div className="mb-7 sm:mb-9">

          <p className="text-[#C49A6C] uppercase tracking-[3px] text-xs sm:text-sm font-semibold">
            EthniCart Collection
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Shop All Products
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Discover elegant ethnic styles for every occasion.
              </p>
            </div>

            <p className="text-sm text-gray-500 shrink-0">
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

          </div>

        </div>

        {/* SEARCH */}
        <div className="relative mb-5 sm:mb-6">

          <FiSearch
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kurtas, sarees, lehengas..."
            className="
              w-full
              bg-white
              border
              border-gray-200
              rounded-2xl
              pl-11
              pr-11
              py-3.5
              text-sm
              text-gray-900
              placeholder:text-gray-400
              outline-none
              focus:border-[#C49A6C]
              focus:ring-2
              focus:ring-[#C49A6C]/10
              transition
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-700
                transition
              "
            >
              <FiX size={17} />
            </button>
          )}

        </div>

        {/* FILTER TOOLBAR */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 mb-7 sm:mb-9">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* CATEGORY */}
            <div className="flex items-center gap-3 min-w-0">

              <div className="hidden sm:flex items-center gap-2 text-gray-500 shrink-0">
                <FiSliders size={16} />
                <span className="text-sm font-medium">
                  Category
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`
                      shrink-0
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        category === item
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {/* SORT */}
            <div className="relative shrink-0">

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                  appearance-none
                  w-full
                  lg:w-56
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  pr-10
                  text-sm
                  font-medium
                  text-gray-700
                  outline-none
                  focus:border-gray-900
                  cursor-pointer
                "
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
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  pointer-events-none
                "
              />

            </div>

          </div>

        </div>

        {/* ACTIVE FILTER INFO */}
        {(category !== "All" || search) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">

            <span className="text-sm text-gray-500">
              Showing:
            </span>

            {category !== "All" && (
              <span className="inline-flex items-center gap-2 bg-[#C49A6C]/10 text-[#9B7045] px-3 py-1.5 rounded-full text-xs font-semibold">
                {category}

                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  aria-label="Remove category filter"
                >
                  <FiX size={13} />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                "{search}"

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Remove search"
                >
                  <FiX size={13} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-500 hover:text-[#C49A6C] ml-1"
            >
              Clear all
            </button>

          </div>
        )}

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl py-16 sm:py-20 px-5 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <FiSearch
                size={22}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No products found
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn't find anything matching your search or selected
              category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-6
                bg-gray-900
                hover:bg-[#C49A6C]
                text-white
                px-6
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition
              "
            >
              Clear Filters
            </button>

          </div>

        )}

      </section>

    </main>
  );
};

export default Shop;