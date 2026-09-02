import { useState } from "react";
import { ShoppingBag, Lock, HelpCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

const fmt = (num) => num.toFixed(2).replace(".", ",");

// ── Small reusable field components ──────────────────────────────

function Field({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-sm text-gray-700 outline-none focus:border-[#1a6b3a] placeholder:text-gray-400 transition-colors bg-white"
    />
  );
}

function CheckLabel({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#1a6b3a]"
      />
      {label}
    </label>
  );
}

// ── Order summary item ────────────────────────────────────────────

function SummaryItem({ item }) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <div className="relative shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-[72px] object-cover rounded-md"
        />
        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 line-clamp-2 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
      </div>
      <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
        ₹{fmt(item.price * item.quantity)}
      </span>
    </div>
  );
}

// ── Main Checkout page ────────────────────────────────────────────

function Checkout() {
  const { cart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice > 50 ? 0 : 4.99;

  const [form, setForm] = useState({
    contact: "",
    newsletter: false,
    country: "Belgium",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    saveInfo: true,
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    billingIsSame: true,
    discountCode: "",
  });

  function set(field) {
    return (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Bokifa" className="h-8" />
        </a>
        <button
          onClick={() => navigate("/cart")}
          className="cursor-pointer relative text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#1a6b3a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[1fr_380px] gap-0">

        {/* ── LEFT: Form ── */}
        <div className="py-10 lg:pr-12 lg:border-r border-gray-200">

          {/* Contact */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Contact</h2>
            <a href="/login" className="text-xs text-[#1a6b3a] font-semibold hover:underline">
              Sign in
            </a>
          </div>
          <Field placeholder="Email or mobile phone number" value={form.contact} onChange={set("contact")} />
          <div className="mb-5">
            <CheckLabel label="Email me with news and offers" checked={form.newsletter} onChange={set("newsletter")} />
          </div>

          {/* Delivery */}
          <h2 className="text-base font-bold text-gray-900 mb-3">Delivery</h2>

          <select
            value={form.country}
            onChange={set("country")}
            className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-sm text-gray-700 outline-none focus:border-[#1a6b3a] bg-white mb-2.5 cursor-pointer"
          >
            {["Belgium", "Netherlands", "Germany", "France", "United Kingdom", "United States", "India"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <Field placeholder="First name (optional)" value={form.firstName} onChange={set("firstName")} />
            <Field placeholder="Last name" value={form.lastName} onChange={set("lastName")} />
          </div>

          <div className="relative mb-2.5">
            <Field placeholder="Address" value={form.address} onChange={set("address")} />
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="mb-2.5">
            <Field placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={set("apartment")} />
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <Field placeholder="Postal code" value={form.postalCode} onChange={set("postalCode")} />
            <Field placeholder="City" value={form.city} onChange={set("city")} />
          </div>

          <CheckLabel label="Save this information for next time" checked={form.saveInfo} onChange={set("saveInfo")} />

          {/* Shipping method */}
          <h2 className="text-base font-bold text-gray-900 mt-7 mb-3">Shipping method</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 text-sm text-gray-400 mb-6">
            Enter your shipping address to view available shipping methods.
          </div>

          {/* Payment */}
          <h2 className="text-base font-bold text-gray-900 mb-1">Payment</h2>
          <p className="text-xs text-gray-400 mb-3">All transactions are secure and encrypted.</p>

          <div className="border-2 border-blue-500 rounded-lg px-4 py-3.5 flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-gray-800">Credit card</span>
            <span className="bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded">VISA</span>
          </div>

          {/* Card fields */}
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-3">
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Card number"
                value={form.cardNumber}
                onChange={set("cardNumber")}
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
              />
              <Lock size={15} className="text-gray-400 shrink-0" />
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center px-3.5 py-3 border-r border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Expiration date (MM / YY)"
                  value={form.expiry}
                  onChange={set("expiry")}
                  className="flex-1 text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Security code"
                  value={form.cvv}
                  onChange={set("cvv")}
                  className="flex-1 text-sm outline-none placeholder:text-gray-400"
                />
                <HelpCircle size={15} className="text-gray-400 shrink-0" />
              </div>
            </div>
            <div className="flex items-center px-3.5 py-3">
              <input
                type="text"
                placeholder="Name on card"
                value={form.nameOnCard}
                onChange={set("nameOnCard")}
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="mb-6">
            <CheckLabel
              label="Use shipping address as billing address"
              checked={form.billingIsSame}
              onChange={set("billingIsSame")}
            />
          </div>

          <button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-base transition-colors">
            Pay now
          </button>

          <div className="mt-5">
            <a href="#" className="text-xs text-[#1a6b3a] hover:underline">Privacy policy</a>
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="bg-[#f8f9fb] lg:px-8 py-10 border-l-0 lg:border-l border-gray-200">

          {/* Items */}
          <div>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 mb-6">No items in cart.</p>
            ) : (
              cart.map((item) => <SummaryItem key={item.id} item={item} />)
            )}
          </div>

          {/* Discount code */}
          <div className="flex gap-2 mt-2 mb-5">
            <input
              type="text"
              placeholder="Discount code"
              value={form.discountCode}
              onChange={set("discountCode")}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#1a6b3a] bg-white"
            />
            <button className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm font-semibold px-4 rounded-md transition-colors">
              Apply
            </button>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₹{fmt(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-gray-400">
                {shipping === 0 ? <span className="text-[#1a6b3a] font-semibold">Free</span> : `₹${fmt(shipping)}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-gray-400 font-normal">INR</span>
                <span className="text-lg font-bold text-gray-900">₹{fmt(totalPrice + shipping)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
