import React, { useState, useMemo, useEffect } from "react";
import { Heart, Eye, Repeat2, ChevronRight, X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta?.env?.VITE_API_URL ||
  "http://localhost:5000";


// Formats a raw number (261.95) into "€261,95" style display text
function formatPrice(price, currency = "EUR") {
  const symbol = currency === "EUR" ? "€" : currency;
  return `${symbol}${price.toFixed(2).replace(".", ",")}`;
}

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-amber-400 stroke-amber-400" : "stroke-gray-300"}
        />
      ))}
    </div>
  );
}

function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <img
          src={product.image}
          alt={product.title}
          className="w-40 mx-auto rounded-lg mb-4 aspect-[3/4] object-cover"
        />

        <h3 className="text-center font-serif text-xl mb-1">{product.title}</h3>
        <p className="text-center text-sm text-gray-500 underline underline-offset-4 mb-2">
          {product.author}
        </p>
        <p className="text-center text-[#1a6b3a] font-bold text-lg mb-5">
          {product.price}
        </p>

        <button
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
          className="w-full bg-[#1a6b3a] text-white font-bold text-sm py-3 rounded-lg hover:bg-[#145530] transition-colors"
        >
          + Add To Cart
        </button>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onCompare,
  onAddToCart,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="cursor-pointer"
    >
      <div
        className="group relative min-w-[227px] w-[227px] shrink-0 rounded-xl border border-gray-100 p-3 cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white"
      >
        {/* Image + hover icons + rating */}
        <div className="relative rounded-[10px]">
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-[3/4] object-cover rounded-[10px] block transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </a>

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              aria-label="Toggle wishlist"
              onClick={() => onToggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${isWishlisted
                ? "bg-[#1a6b3a] text-white"
                : "bg-white text-gray-600 hover:bg-[#1a6b3a] hover:text-white"
                }`}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
            </button>

            <button
              aria-label="Quick view"
              onClick={() => onQuickView(product)}
              className="w-9 h-9 rounded-full bg-white text-gray-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#1a6b3a] hover:text-white"
            >
              <Eye size={16} />
            </button>

            <button
              aria-label="Compare"
              onClick={() => onCompare(product)}
              className="w-9 h-9 rounded-full bg-white text-gray-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#1a6b3a] hover:text-white"
            >
              <Repeat2 size={16} />
            </button>
          </div>

          <div className="absolute -bottom-[15px] left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-sm">
            <StarRating rating={product.rating} />
          </div>
        </div>

        {/* Text content */}
        <h6 className="mt-4 text-center font-serif text-base text-gray-900 font-normal line-clamp-2">
          {product.title}
        </h6>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="block text-center text-[13px] font-semibold text-gray-400 underline underline-offset-4 mt-0.5"
        >
          {product.author}
        </a>
        <p className="text-center text-[#1a6b3a] font-bold mt-1">{product.price}</p>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-[#1a6b3a] text-white text-sm font-bold py-3 rounded-lg mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#145530]"
        >
          + Add To Cart
        </button>
      </div>
    </div>
  );
}

export default function HighlightsSection({ onAddToCart, onBrowseAll }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const wishlistIds = useMemo(() => wishlist, [wishlist]);

  useEffect(() => {
    let cancelled = false;

    async function fetchHighlights() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/products`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        // Supports both:
        // 1. { products: [...] }
        // 2. [...]
        const productsArray = Array.isArray(data)
          ? data
          : data.products || [];

        const normalized = productsArray.map((p) => ({
          id: p._id,
          title: p.title,
          author: p.author || "Unknown Author",
          price: formatPrice(Number(p.price || 0), p.currency),
          image:
            p.image ||
            "https://placehold.co/300x400?text=No+Image",
          rating: p.rating || 5,
        }));

        if (!cancelled) {
          setProducts(normalized);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Couldn't load products right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchHighlights();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleWishlist(product) {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }

  function handleAddToCart(product) {
    onAddToCart?.(product);
    setToast(`Added "${product.title}" to cart`);
    setTimeout(() => setToast(null), 2000);
  }

  function handleCompare(product) {
    setToast(`Added "${product.title}" to compare`);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <section className="py-12 relative">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Top row */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-[42px] font-light text-gray-900">
            This week's highlights
          </h2>
          <button
            onClick={onBrowseAll}
            className="flex items-center gap-1.5 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Browse All <ChevronRight size={16} />
          </button>
        </div>

        {error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[227px] w-[227px] shrink-0 rounded-xl border border-gray-100 p-3 animate-pulse"
                >
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-[10px]" />
                  <div className="h-4 bg-gray-200 rounded mt-5 mx-auto w-3/4" />
                  <div className="h-3 bg-gray-200 rounded mt-2 mx-auto w-1/2" />
                  <div className="h-4 bg-gray-200 rounded mt-2 mx-auto w-1/3" />
                </div>
              ))
              : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.has(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={setQuickViewProduct}
                    onCompare={handleCompare}
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <div className="w-full py-20 text-center text-gray-500">
                  No products found.
                </div>
              )}

          </div>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </section>
  );
}
