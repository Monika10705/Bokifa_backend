import { useState, useEffect } from "react";
import Button from "../Button";

function CategoryProductsPanel({ category, fetchCategoryProducts, onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCategoryProducts(category._id).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [category._id, fetchCategoryProducts]);

  return (
    <div className="mt-3 border-t pt-3">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Products in this category
        </span>
        <Button
          onClick={() => onAddProduct(category)}
          className="!w-auto !py-1 px-3 text-xs !font-medium"
        >
          + Add Product
        </Button>
      </div>

      {/* Product list */}
      {loading ? (
        <p className="text-xs text-gray-400 py-2">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-xs text-gray-400 py-2 italic">
          No products in this category yet.
        </p>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-8 h-10 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                <p className="text-xs text-gray-400">{product.author} · €{product.price}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
                  product.stock > 0
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {product.stock} in stock
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProductsPanel;
