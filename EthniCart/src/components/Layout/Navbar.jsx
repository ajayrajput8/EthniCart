
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-bold text-orange-500">
            EthniCart
          </h1>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-8">
          <Link className="hover:text-orange-500" to="/">
            Home
          </Link>

          <Link className="hover:text-orange-500" to="/shop">
            Shop
          </Link>

          <Link className="hover:text-orange-500" to="/wishlist">
            Wishlist
          </Link>

          <Link className="hover:text-orange-500" to="/login">
            Login
          </Link>
        </div>

        {/* Cart */}
        <div>
          <Link
            to="/cart"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Cart ({totalItems})
          </Link>

          <Link
            to="/profile"
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

