import { FiArrowRight } from "react-icons/fi";
import categories from "../../data/categories";

const Categories = () => {
  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#C49A6C] uppercase tracking-[4px] font-semibold">
            Explore Collection
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Discover timeless ethnic fashion for every occasion and every member
            of your family.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative h-[420px] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold">
                  {category.name}
                </h3>

                <button className="mt-4 flex items-center gap-2 text-[#F5D07A] font-medium transition-all duration-300 group-hover:gap-4">
                  Explore
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;