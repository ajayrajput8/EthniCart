import { createContext, useState } from "react";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  // =========================
  // LOAD WISHLIST
  // =========================
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("ethnicartWishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // =========================
  // ADD TO WISHLIST
  // =========================
  const addToWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current;
      }

      const updatedWishlist = [
        ...current,
        product,
      ];

      localStorage.setItem(
        "ethnicartWishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist = (id) => {
    setWishlist((current) => {
      const updatedWishlist = current.filter(
        (item) => item.id !== id
      );

      localStorage.setItem(
        "ethnicartWishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  // =========================
  // CHECK WISHLIST
  // =========================
  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };

  // =========================
  // CLEAR WISHLIST
  // =========================
  const clearWishlist = () => {
    setWishlist([]);

    localStorage.removeItem(
      "ethnicartWishlist"
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
