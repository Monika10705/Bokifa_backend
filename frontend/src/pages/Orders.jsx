import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import api from "../services/api";

const STATUS_STYLES = {
  pending:    "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped:    "bg-purple-50 text-purple-700",
  delivered:  "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-600",
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function fmt(num) {
    return Number(num).toFixed(2).replace(".", ",");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} strokeWidth={1.2} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-serif mb-2">No orders yet</h1>
        <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
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
    <section className="max-w-[900px] mx-auto px-5 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Package size={28} className="text-[#1a6b3a]" />
        <div>
          <h1 className="text-3xl font-serif">My Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">{orders.length} {orders.length === 1 ? "order" : "orders"}</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedId === order._id;
          const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
            date: "numeric", hour: "numeric", minute: "numeric", hour12: true,
          });

          return (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Order header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order._id)}
                className="cursor-pointer w-full flex flex-wrap items-center justify-between gap-5 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-10">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="text-sm font-mono font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="text-sm text-gray-700">{date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 justify-center">Items</p>
                    <p className="text-sm text-gray-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <p className="text-base font-bold text-[#1a6b3a]">₹{fmt(order.total)}</p>
                  <span className="text-gray-400">{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</span>
                </div>
              </button>

              {/* Expanded items */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-800">₹{fmt(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-400">₹{fmt(item.price)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}

                  {/* Order totals */}
                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{fmt(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className={order.shipping === 0 ? "text-[#1a6b3a] font-medium" : ""}>
                        {order.shipping === 0 ? "Free" : `₹${fmt(order.shipping)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1">
                      <span>Total</span>
                      <span className="text-[#1a6b3a]">₹{fmt(order.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Orders;
