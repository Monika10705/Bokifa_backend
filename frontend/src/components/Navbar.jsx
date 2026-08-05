import { ChevronDown, Phone } from 'lucide-react';

function Navbar() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-7 text-sm font-medium text-gray-800">
          {["Home", "Shop", "Blogs", "Pages"].map((item, i) => (
            <button
              key={item}
              className={`cursor-pointer flex items-center gap-1 hover:text-[#0d3b2e] transition-colors ${i === 0 ? "text-[#0d3b2e]" : ""
                }`}
            >
              {item}
              {item !== "Home" ? <ChevronDown size={14} /> : null}
            </button>
          ))}
          <button className="cursor-pointer hover:text-[#0d3b2e] transition-colors">
            Contact
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
          <span>Need help? Call Us:</span>
          <a
            href="tel:+842500088833"
            className="font-semibold text-gray-900 flex items-center gap-1"
          >
            <Phone size={14} />
            +84 2500 888 33
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;