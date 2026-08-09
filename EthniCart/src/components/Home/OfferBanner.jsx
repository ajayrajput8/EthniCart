import { Link } from "react-router-dom";

const OfferBanner = () => {
  return (
    <section className="py-24 bg-[#fff8f1]">

      <div className="max-w-7xl mx-auto px-6">


        <div
          className="
            relative
            overflow-hidden
            rounded-[55px]
            bg-[#1d1b18]
            min-h-[500px]
            flex
            items-center
            shadow-2xl
          "
        >


          {/* Decorative Circle */}
          <div
            className="
              absolute
              -right-40
              -top-40
              w-[500px]
              h-[500px]
              rounded-full
              bg-orange-500/20
            "
          />


          <div
            className="
              relative
              z-10
              grid
              lg:grid-cols-2
              gap-10
              items-center
              w-full
              p-8
              sm:p-12
              lg:p-20
            "
          >


            {/* Left Content */}
            <div>


              <div
                className="
                  inline-flex
                  bg-orange-500/20
                  border
                  border-orange-400/30
                  px-5
                  py-2
                  rounded-full
                  text-orange-300
                  text-sm
                  font-semibold
                  tracking-widest
                "
              >
                FESTIVE SALE
              </div>



              <h2
                className="
                  mt-8
                  text-white
                  text-5xl
                  sm:text-6xl
                  lg:text-7xl
                  font-bold
                  leading-[1.05]
                "
              >
                Royal Style
                <br/>
                At
                <span className="text-orange-500">
                  {" "}50% OFF
                </span>
              </h2>



              <p
                className="
                  mt-7
                  text-gray-300
                  text-lg
                  max-w-lg
                  leading-8
                "
              >
                Discover handcrafted ethnic collections designed
                for weddings, festivals and unforgettable moments.
              </p>



              <Link
                to="/shop"
                className="
                  inline-flex
                  mt-10
                  bg-orange-600
                  hover:bg-orange-700
                  text-white
                  px-10
                  py-4
                  rounded-full
                  font-semibold
                  shadow-xl
                  shadow-orange-900/30
                  hover:-translate-y-1
                  transition-all
                "
              >
                Explore Collection →
              </Link>


            </div>




            {/* Right Product Area */}
            <div
              className="
                relative
                flex
                justify-center
              "
            >


              {/* Offer Badge */}
              <div
                className="
                  absolute
                  top-0
                  right-10
                  z-20
                  bg-white
                  rounded-full
                  w-28
                  h-28
                  flex
                  flex-col
                  items-center
                  justify-center
                  shadow-xl
                  rotate-12
                "
              >

                <span className="text-orange-600 text-3xl font-bold">
                  50%
                </span>

                <span className="text-xs font-semibold">
                  OFF
                </span>

              </div>



              {/* Product Card */}
              <div
                className="
                  w-72
                  h-96
                  bg-white/10
                  backdrop-blur-xl
                  rounded-[45px]
                  border
                  border-white/20
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                  duration-500
                "
              >

                <span
                  className="
                    text-[170px]
                    drop-shadow-2xl
                  "
                >
                  👗
                </span>


              </div>



            </div>


          </div>


        </div>


      </div>


    </section>
  );
};


export default OfferBanner;