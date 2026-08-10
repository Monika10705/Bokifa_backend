import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  function addToWishlist(product) {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      const next = [...prev, product];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
    toast.success(`"${product.title}" added to wishlist`);
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  }

  function toggleWishlist(product) {
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
      toast.info(`"${product.title}" removed from wishlist`);
    } else {
      addToWishlist(product);
    }
  }

  function isWishlisted(id) {
    return wishlist.some((item) => item.id === id);
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, isWishlistOpen, setIsWishlistOpen }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
