const categories = [
  {
    id: 1,
    name: "Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
  },
  {
    id: 2,
    name: "Kurtas",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
  },
  {
    id: 3,
    name: "Lehengas",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
  },
  {
    id: 4,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold">
                  {category.name}
                </h3>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Categories;