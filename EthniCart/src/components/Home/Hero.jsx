import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import Navbar from "../Layout/Navbar";

const Hero = () => {
  return (
    <section className="bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div className="order-2 lg:order-1 text-center lg:text-left">

            <p className="text-orange-500 font-semibold uppercase tracking-widest">
              New Collection
            </p>

            <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Discover Your
              <br />
              Perfect Style
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Explore beautiful ethnic wear for every occasion.
              Find premium sarees, kurtas, lehengas and more.
            </p>

            <Link
              to="/login"
              className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition"
            >
              Shop Now
            </Link>

          </div>

          {/* Right Side */}
          <div className="order-1 lg:order-2 flex justify-center">

            <img
               src={heroImage}
               alt="Hero"
               className="w-full h-[650px] object-cover rounded-[40px] shadow-2xl"
             />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;