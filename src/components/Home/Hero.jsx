import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import heroImage from "../../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-[#F4EEE7]">

      <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">

        {/* LEFT CONTENT */}
        <div className="flex items-center order-2 lg:order-1 px-6 py-12 sm:px-10 sm:py-14 lg:px-14 xl:px-16 lg:py-16">

          <div className="max-w-xl w-full">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#E5D8CA] rounded-full px-3.5 py-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C49A6C]" />

              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                New Collection 2026
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-[42px] leading-[1.05] sm:text-5xl md:text-6xl xl:text-[68px] font-bold tracking-tight text-gray-900">
              Discover Your
              <span className="block text-[#C49A6C] mt-1">
                Perfect Style
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 text-gray-600 max-w-lg">
              Discover elegant ethnic wear crafted for modern
              celebrations. From timeless sarees to stylish kurtas,
              find something special for every occasion.
            </p>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 mt-7 sm:mt-8">

              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#C49A6C] text-white px-6 sm:px-7 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg"
              >
                <FiShoppingBag size={17} />

                Shop Collection

                <FiArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center border border-gray-300 bg-white/70 hover:bg-white text-gray-800 px-6 sm:px-7 py-3.5 rounded-full font-semibold transition-all duration-300"
              >
                Explore Products
              </Link>

            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-8 pt-6 border-t border-[#DED2C5]">

              <div className="flex items-center gap-2">

                <div className="flex items-center gap-0.5 text-[#C49A6C]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      size={14}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <span className="text-sm font-semibold text-gray-700">
                  4.9/5
                </span>

              </div>

              <div className="hidden sm:block h-5 w-px bg-gray-300" />

              <p className="text-xs sm:text-sm text-gray-500">
                Premium quality fashion
              </p>

            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative order-1 lg:order-2 h-[360px] sm:h-[450px] lg:h-auto">

          <img
            src={heroImage}
            alt="EthniCart ethnic fashion collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          {/* Floating Card */}
          <div className="absolute bottom-4 left-4 sm:bottom-7 sm:left-7 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-xl">

            <p className="text-[9px] sm:text-xs uppercase tracking-[2px] text-gray-400 font-semibold">
              EthniCart
            </p>

            <p className="text-xs sm:text-base font-bold text-gray-900 mt-1">
              Made for every occasion
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;