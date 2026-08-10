import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import categories from "../../data/categories";

const Categories = () => {
  return (
    <section>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7 sm:mb-9">

        <div>
          <p className="text-[#C49A6C] uppercase tracking-[3px] font-semibold text-xs sm:text-sm">
            Explore Collection
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl text-sm sm:text-base leading-6">
            Explore our curated collection of ethnic styles made
            for every occasion.
          </p>
        </div>

        {/* DESKTOP VIEW ALL */}
        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#C49A6C] transition-colors"
        >
          View All
          <FiArrowUpRight size={17} />
        </Link>

      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

        {categories.slice(0, 4).map((category) => (

          <Link
            key={category.id}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="
              group
              relative
              h-[220px]
              sm:h-[290px]
              lg:h-[350px]
              rounded-2xl
              sm:rounded-3xl
              overflow-hidden
              bg-gray-100
              shadow-sm
              hover:shadow-xl
              transition-all
              duration-500
            "
          >

            {/* IMAGE */}
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-110
              "
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

            {/* ARROW */}
            <div
              className="
                absolute
                top-3
                right-3
                sm:top-5
                sm:right-5
                w-8
                h-8
                sm:w-10
                sm:h-10
                rounded-full
                bg-white/90
                backdrop-blur-sm
                flex
                items-center
                justify-center
                text-gray-800
                transition-all
                duration-300
                group-hover:bg-[#C49A6C]
                group-hover:text-white
                group-hover:rotate-45
              "
            >
              <FiArrowUpRight size={17} />
            </div>

            {/* CONTENT */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {category.name}
              </h3>

              <div className="flex items-center gap-2 mt-1.5 text-white/80 text-[11px] sm:text-sm">

                <span>
                  Explore Collection
                </span>

                <span className="w-5 sm:w-7 h-px bg-white/60 group-hover:w-10 transition-all duration-300" />

              </div>

            </div>

          </Link>

        ))}

      </div>

      {/* MOBILE VIEW ALL */}
      <Link
        to="/shop"
        className="
          sm:hidden
          flex
          items-center
          justify-center
          gap-2
          mt-5
          w-full
          border
          border-gray-200
          bg-white
          py-3
          rounded-xl
          text-sm
          font-semibold
          text-gray-800
          hover:border-[#C49A6C]
          hover:text-[#C49A6C]
          transition
        "
      >
        View All Categories
        <FiArrowUpRight size={17} />
      </Link>

    </section>
  );
};

export default Categories;