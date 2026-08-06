import Hero from "../components/Home/Hero";
import Categories from "../components/Home/Categories";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import OfferBanner from "../components/Home/OfferBanner";

const Home = () => {
  return (
    <>
      <Hero />
        <Categories />
        <FeaturedProducts />
        <OfferBanner />
    </>
  );
};

export default Home; 