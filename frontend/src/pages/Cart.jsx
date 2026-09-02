import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import api from "../services/api";

function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = totalPrice > 50 ? 0 : 4.99;
  const grandTotal = totalPrice + shipping;

  async function handlePlaceOrder() {
    try {
      setPlacing(true);

      const token = localStorage.getItem("token");

      // Prepare cart items for the MongoDB order
      const items = cart.map((item) => ({
        productId: item.id,
        title: item.title,
        author: item.author,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      // 1. Create Razorpay order on backend
      const response = await api.post(
        "/orders/create-payment-order",
        { total: grandTotal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayOrder = response.data.order;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Bokifa",
        description: "Book Order",
        order_id: razorpayOrder.id,

        handler: async function (paymentResponse) {
          console.log("Payment successful:", paymentResponse);

          // Only this part is responsible for payment verification
          let verifyResponse;

          try {
            verifyResponse = await api.post(
              "/orders/verify-payment",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,

                items,
                subtotal: totalPrice,
                shipping,
                total: grandTotal,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (error) {
            console.error("Payment verification request failed:", error);
            console.error("Backend response:", error.response?.data);

            toast.error(
              error.response?.data?.message ||
              "Payment succeeded, but order verification failed."
            );

            setPlacing(false);
            return;
          }

          console.log("Verification response:", verifyResponse.data);

          // Backend confirmed payment + order creation
          if (verifyResponse.data.success) {
            console.log("Order successfully created.");

            // Stop loading first
            setPlacing(false);

            // Clear cart
            clearCart();

            // Show success message
            toast.success("Order placed successfully!");

            // Go to order history
            navigate("/orders");

            return;
          }

          // Backend returned success:false
          setPlacing(false);

          toast.error(
            verifyResponse.data.message ||
            "Order verification failed."
          );
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#1a6b3a",
        },

        modal: {
          ondismiss: function () {
            setPlacing(false);
            toast.error("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (e) {
      console.error("Payment initialization failed:", e);

      toast.error(
        e.response?.data?.message ||
        "Failed to create payment order"
      );

      setPlacing(false);
    }
  }

  function fmt(num) {
    return num.toFixed(2).replace(".", ",");
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} strokeWidth={1.2} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-serif mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
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

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-serif">Shopping Cart</h1>
          <p className="text-gray-400 mt-1 text-sm">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="cursor-pointer flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a6b3a] transition-colors"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">

          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pb-2 border-b">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {cart.map((item) => {
            return (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image + info */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="w-16 h-22 object-cover rounded-xl shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ height: "88px" }}
                  />
                  <div className="min-w-0">
                    <h3
                      onClick={() => navigate(`/products/${item.id}`)}
                      className="font-semibold text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#1a6b3a] transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-2 transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                {/* Unit price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="text-xs text-gray-400 md:hidden block mb-0.5">Price</span>
                  <span className="text-sm font-medium">₹{fmt(item.price)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cursor-pointer w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cursor-pointer w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <span className="text-xs text-gray-400 md:hidden block mb-0.5">Total</span>
                  <span className="text-sm font-bold text-[#1a6b3a]">₹{fmt(item.price * item.quantity)}</span>
                </div>
              </div>
            );
          })}

          {/* Clear cart */}
          <div className="flex justify-end pt-2">
            <button
              onClick={clearCart}
              className="cursor-pointer text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
            <h2 className="font-serif text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{fmt(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-[#1a6b3a] font-semibold" : ""}>
                  {shipping === 0 ? "Free" : `₹${fmt(shipping)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{fmt(50 - totalPrice)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 mt-5 pt-5 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-[#1a6b3a] text-lg">₹{fmt(grandTotal)}</span>
            </div>

            {/* Coupon */}
            <div className="mt-5 flex gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white">
                <Tag size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 text-sm py-2.5 outline-none bg-transparent"
                />
              </div>
              <button className="cursor-pointer bg-gray-800 text-white text-sm px-4 rounded-lg hover:bg-black transition-colors">
                Apply
              </button>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="cursor-pointer w-full mt-5 bg-[#1a6b3a] text-white font-bold py-3.5 rounded-xl hover:bg-[#145530] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="cursor-pointer w-full mt-3 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Cart;
