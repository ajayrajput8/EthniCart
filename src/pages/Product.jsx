import { useContext } from "react";
import { useParams } from "react-router-dom";

import products from "../data/products";
import { CartContext } from "../context/CartContext";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return <h2>Product Not Found</h2>;
  }

  return (
    <div className="p-8">
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width="250"
      />

      <p>{product.description}</p>

      <h3>Price: ₹{product.price}</h3>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;