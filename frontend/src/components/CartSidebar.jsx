import { X, Minus, Plus, ShoppingBag, Trash2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const fmt = (num) => num.toFixed(2).replace(".", ",");
  const shipping = totalPrice > 50 ? 0 : 4.99;

  function go(path) {
    setIsCartOpen(false);
    navigate(path);
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f0faf4] flex items-center justify-center">
              <ShoppingBag size={17} className="text-[#1a6b3a]" />
            </div>
            <div>
              <h2 className="font-serif text-lg leading-tight">Your Cart</h2>
              <p className="text-xs text-gray-400">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={17} />
          </button>
        </div>

        {/* Free shipping progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[#f8fdf9] border-b border-gray-100">
            {shipping === 0 ? (
              <p className="text-xs text-[#1a6b3a] font-medium flex items-center gap-1.5">
                <Package size={13} /> You've unlocked free shipping!
              </p>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-1.5">
                  Add <span className="font-semibold text-gray-700">€{fmt(50 - totalPrice)}</span> more for free shipping
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a6b3a] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-10">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag size={36} strokeWidth={1} className="text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some books to get started</p>
              </div>
              <button
                onClick={() => go("/shop")}
                className="cursor-pointer mt-2 bg-[#1a6b3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#145530] transition-colors"
              >
                Browse Books
              </button>
            </div>
          ) : (
            cart.map((item) => {
              return (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                  {/* Book cover */}
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={() => go(`/products/${item.id}`)}
                    className="w-[60px] h-[80px] object-cover rounded-xl shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <p
                        onClick={() => go(`/products/${item.id}`)}
                        className="font-semibold text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#1a6b3a] transition-colors"
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-full"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-full"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Price + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#1a6b3a]">
                          €{fmt(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gray-50">
            {/* Subtotal row */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>€{fmt(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-[#1a6b3a] font-semibold" : ""}>
                  {shipping === 0 ? "Free" : `€${fmt(shipping)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#1a6b3a]">€{fmt(totalPrice + shipping)}</span>
              </div>
            </div>

            <button
              onClick={() => go("/cart")}
              className="cursor-pointer w-full bg-[#1a6b3a] text-white font-bold py-3.5 rounded-xl hover:bg-[#145530] transition-colors text-sm"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
