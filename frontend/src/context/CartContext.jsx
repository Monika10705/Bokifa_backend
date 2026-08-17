import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { parsePrice } from "../utils/price";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      // Sanitize: ensure every item has a numeric quantity
      return parsed.map((item) => ({ ...item, quantity: Number(item.quantity) || 1 }));
    } catch {
      return [];
    }
  });

  function addToCart(product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const next = existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, price: parsePrice(product.price), quantity: Number(quantity) || 1 }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
    toast.success(`"${product.title}" added to cart`);
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
