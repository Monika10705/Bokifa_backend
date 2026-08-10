import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <ShoppingBag size={40} strokeWidth={1.2} className="text-red-300" />
        </div>
        <h1 className="text-3xl font-serif mb-2">Your wishlist is empty</h1>
        <p className="text-gray-400 mb-8">Save your favourite books here.</p>
        <button
          onClick={() => navigate("/shop")}
          className="cursor-pointer bg-[#1a6b3a] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#145530] transition-colors"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-[1300px] mx-auto px-5 py-12">
      <h1 className="text-4xl font-serif mb-2">My Wishlist</h1>
      <p className="text-gray-400 text-sm mb-8">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <img
              src={item.image}
              alt={item.title}
              onClick={() => navigate(`/products/${item.id}`)}
              className="cursor-pointer w-full aspect-[3/4] object-cover rounded-xl mb-4 hover:opacity-80 transition-opacity"
            />
            <h3
              onClick={() => navigate(`/products/${item.id}`)}
              className="cursor-pointer font-semibold text-sm line-clamp-2 hover:text-[#1a6b3a] transition-colors"
            >
              {item.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
            <p className="text-[#1a6b3a] font-bold text-sm mt-1 mb-4">{item.price}</p>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                className="cursor-pointer flex-1 bg-[#1a6b3a] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#145530] transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={13} /> Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-400 text-gray-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;
