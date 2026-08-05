import { useNavigate } from "react-router-dom";
import { ProductCard } from "./HighlightsSection";
import { useCart } from "../context/CartContext";

function ProductGrid({ products, loading }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-xl p-3 animate-pulse"
          >
            <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>

            <div className="h-4 bg-gray-200 rounded mt-4"></div>

            <div className="h-3 bg-gray-200 rounded mt-2 w-2/3"></div>

            <div className="h-4 bg-gray-200 rounded mt-3 w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">
          No Products Found
        </h2>

        <p className="text-gray-500 mt-2">
          Try another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

      {products.map((product) => (

        <div
          key={product._id}
          onClick={() => navigate(`/products/${product._id}`)}
          className="cursor-pointer"
        >
          <ProductCard
            product={{
              id: product._id,
              title: product.title,
              author: product.author,
              image: product.image,
              rating: product.rating,
              price: `€${Number(product.price).toFixed(2)}`,
            }}
            isWishlisted={false}
            onToggleWishlist={() => {}}
            onQuickView={() => {}}
            onCompare={() => {}}
            onAddToCart={(p) => addToCart(p)}
          />
        </div>

      ))}

    </div>
  );
}

export default ProductGrid;