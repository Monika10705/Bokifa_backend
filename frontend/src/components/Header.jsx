import {
  Heart,
  ShoppingBag,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();
  return (
    <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 py-4">
              {/* Logo */}
              <div className="flex items-center gap-2 shrink-0">
                <img src={logo} alt="Logo" className="h-8" />
              </div>
    
              {/* Search bar */}
              <div className="hidden md:flex flex-1 max-w-xl">
                <div className="flex w-full rounded-full bg-gray-100 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search our store..."
                    className="flex-1 bg-transparent px-5 py-2.5 text-sm outline-none placeholder:text-gray-400"
                  />
                  <button className="cursor-pointer flex items-center gap-2 bg-[#0d3b2e] text-white text-sm font-medium px-5 py-2.5 rounded-full m-0.5 hover:bg-[#0a2f24] transition-colors">
                    <Search size={15} />
                    Search
                  </button>
                </div>
              </div>
    
              {/* Right controls */}
              <div className="flex items-center gap-5 text-sm text-gray-700 shrink-0">
                <button className="cursor-pointer hidden lg:flex items-center gap-1 hover:text-[#0d3b2e]">
                  EUR € <ChevronDown size={14} />
                </button>
                <span className="hidden lg:block text-gray-300">|</span>
                <button className="cursor-pointer hidden lg:flex items-center gap-1 hover:text-[#0d3b2e]">
                  ENGLISH <ChevronDown size={14} />
                </button>
    
                <button aria-label="Account" className="cursor-pointer hover:text-[#0d3b2e]">
                  <User size={20} />
                </button>
    
                <button onClick={() => setIsWishlistOpen(true)} aria-label="Wishlist" className="cursor-pointer relative hover:text-[#0d3b2e]">
                  <Heart size={20} />
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                </button>
    
                <button onClick={() => setIsCartOpen(true)} aria-label="Cart" className="cursor-pointer relative hover:text-[#0d3b2e]">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </button>
              </div>
            </div>
          </div>
  );
}

export default Header;