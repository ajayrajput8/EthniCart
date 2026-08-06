import { Link } from "react-router-dom";

const OfferBanner = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-orange-500 rounded-3xl overflow-hidden">

          <div className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-16">

            <div className="text-white max-w-xl">

              <p className="uppercase tracking-widest text-orange-100">
                Limited Time Offer
              </p>

              <h2 className="text-4xl lg:text-5xl font-bold mt-4">
                Flat 50% OFF
              </h2>

              <p className="mt-6 text-lg text-orange-100">
                Upgrade your wardrobe with our premium ethnic collection.
                Hurry! Offer ends soon.
              </p>

              <Link
                to="/shop"
                className="inline-block mt-8 bg-white text-orange-500 font-semibold px-8 py-4 rounded-full hover:bg-orange-100 transition"
              >
                Shop Collection
              </Link>

            </div>

            <div className="mt-10 lg:mt-0">
              <span className="text-8xl">🛍️</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default OfferBanner;