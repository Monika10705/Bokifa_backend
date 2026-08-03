import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import Button from "../components/Button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      const data = await res.json();

      setProduct(data.product || data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Product not found
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-5 py-12">
      <div className="grid md:grid-cols-2 gap-12">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Product Details */}
        <div>

          <p className="text-green-700 font-semibold mb-2">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-gray-500 mb-3">
            By {product.author || "Unknown Author"}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={18}
                className={
                  index < (product.rating || 5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <h2 className="text-3xl text-green-700 font-bold mb-5">
            € {product.price}
          </h2>

          <p className="text-gray-600 leading-7 mb-8">
            {product.description}
          </p>

          <p className="mb-6">
            <span className="font-semibold">Stock :</span>{" "}
            {product.stock}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-8">

            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="border px-4 py-2 rounded"
            >
              -
            </button>

            <span className="text-xl font-semibold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border px-4 py-2 rounded"
            >
              +
            </button>

          </div>

          {/* Buttons */}
          <div className="flex gap-4">

            <Button className="w-auto px-10">
              Add To Cart
            </Button>

            <Button className="w-auto px-10 bg-black hover:bg-gray-800">
              Buy Now
            </Button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;