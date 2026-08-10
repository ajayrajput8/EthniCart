import Hero from "../components/Home/Hero";
import Categories from "../components/Home/Categories";
import FeaturedProducts from "../components/Home/FeaturedProducts";

const Home = () => {
  return (
    <main className="bg-[#FAF9F7] text-gray-900 overflow-hidden">

      {/* HERO */}
      <section className="px-3 sm:px-5 lg:px-8 pt-3 sm:pt-5 lg:pt-7">
        <div className="max-w-7xl mx-auto">
          <Hero />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-3 sm:px-5 lg:px-8 pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto">
          <Categories />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-3 sm:px-5 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <FeaturedProducts />
        </div>
      </section>

    </main>
  );
};

export default Home;