import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">

      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
      </Link>

      <div className="p-5">

        <h3 className="text-xl font-semibold">
          {product.name}
        </h3>

        <p className="text-orange-500 text-2xl font-bold mt-2">
          ₹{product.price}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;