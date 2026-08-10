import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistSidebar() {
  const { wishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  function go(path) {
    setIsWishlistOpen(false);
    navigate(path);
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isWishlistOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <Heart size={17} className="text-red-400 fill-red-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg leading-tight">Wishlist</h2>
              <p className="text-xs text-gray-400">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={17} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 pb-10">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Heart size={36} strokeWidth={1} className="text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Your wishlist is empty</p>
                <p className="text-sm text-gray-400 mt-1">Save books you love for later</p>
              </div>
              <button
                onClick={() => go("/shop")}
                className="cursor-pointer mt-2 bg-[#1a6b3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#145530] transition-colors"
              >
                Browse Books
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() => go(`/products/${item.id}`)}
                  className="w-[60px] h-[80px] object-cover rounded-xl shrink-0 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <p
                      onClick={() => go(`/products/${item.id}`)}
                      className="font-semibold text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#1a6b3a] transition-colors"
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
                    <p className="text-sm font-bold text-[#1a6b3a] mt-1">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-[#1a6b3a] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#145530] transition-colors"
                    >
                      <ShoppingBag size={13} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors border border-gray-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
            <button
              onClick={() => go("/wishlist")}
              className="cursor-pointer w-full border border-[#1a6b3a] text-[#1a6b3a] font-bold py-3 rounded-xl hover:bg-[#f0faf4] transition-colors text-sm"
            >
              View Full Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
}
