import logo from "../assets/logo.png";

const categories = ["Action Books", "Comedy", "Drama", "Horror", "Kids Books", "Top 50 Books"];
const usefulLinks = ["Secure Shopping", "Privacy Policy", "Terms of Use", "Shipping Policy", "Returns Policy", "Payment Option"];
const explore = ["About us", "Store Locator", "Kids Club", "Blogs"];
const getInTouch = ["Careers", "Become a Franchisee", "Contact Us"];

function FooterCol({ title, links }) {
  return (
    <div>
      <h5 className="font-serif text-xl font-normal text-gray-800 mb-3 pb-3 border-b border-gray-200">
        {title}
      </h5>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-gray-500 font-light text-sm hover:text-[#1a6b3a] transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-14 pb-8 mt-10">
      <div className="max-w-[1450px] mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-5">
              <img src={logo} alt="Bokifa Logo" className="h-10" />
            </a>
            <p className="text-gray-500 text-sm leading-7 mb-5 max-w-xs">
              Bokifa draws book lovers of all ages into a community, engage with booklovers and meet their favourite literary personalities.
            </p>
            <a href="tel:+841800463355" className="block text-[#dcbf71] text-2xl font-semibold mb-2 hover:text-[#dcbf71]">
              +(84) - 1800 - 4635
            </a>
            <a href="mailto:contact@example.com" className="text-gray-500 text-sm hover:text-[#1a6b3a] transition-colors">
              contact@example.com
            </a>
          </div>

          {/* Col 2–5: Links */}
          <FooterCol title="Category" links={categories} />
          <FooterCol title="Useful links" links={usefulLinks} />
          <FooterCol title="Explore" links={explore} />
          <FooterCol title="Get in touch" links={getInTouch} />

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            Copyright &copy; 2025 <a href="#" className="text-[#1a6b3a] font-semibold hover:underline">Bokifa</a>. All rights reserved
          </p>
          <div>
            <img src="/images/copyright/copyright_pay.png" alt="Payment methods" className="h-6 object-contain" />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
