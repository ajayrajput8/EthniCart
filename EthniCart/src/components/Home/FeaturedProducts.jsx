import products from "../../data/products";
import ProductCard from "../Product/ProductCard";

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="text-orange-500 uppercase font-semibold tracking-wider">
            Best Collection
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Featured Products
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;