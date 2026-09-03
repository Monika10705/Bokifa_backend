import { ChevronRight } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import heroBg from '../assets/hero-book.png';
import React from "react";

function HeroSection() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const heroSlides = 3;

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[520px]"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pt-14 pb-10">
        {/* Left copy */}
        <div className="flex flex-col justify-center z-10">
          <p className="text-[#0d3b2e] font-medium mb-3">A brand new series.</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.05] text-gray-900 mb-5">
            THE WORLD OF
            <br />
            YOUNG ADULT
            <br />
            BOOKS
          </h1>
          <p className="text-gray-700 mb-7">Save up to 15% on new releases.</p>
          <button className="cursor-pointer inline-flex items-center gap-2 bg-white text-gray-900 font-semibold rounded-full px-6 py-3 w-fit shadow-sm hover:shadow-md transition-shadow">
            Discover Now
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right side is now empty — the image itself shows the books */}
        <div className="relative min-h-[380px] z-10">
          {/* Discount badge sits on top of the bg image */}
          <div className="absolute left-0 sm:left-6 top-10 z-20">
            <div
              className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white text-center font-bold leading-tight"
            >
              <span className="text-lg">
                15%
                <br />
                OFF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="relative z-10 flex justify-center gap-2 pb-6">
        {Array.from({ length: heroSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`cursor-pointer h-2 rounded-full transition-all ${
              activeSlide === i ? "w-6 bg-[#0d3b2e]" : "w-2 bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* STATS STRIP */}
      <div className="relative z-10 bg-[#f6f4ee] border-t border-black/5">
        <div className="max-w-7xl mx-auto overflow-hidden px-4 py-4">
          <div className="flex items-center justify-center gap-10 flex-wrap text-sm text-gray-700">
            {[
              ["20,898", "books sold"],
              ["97%", "happy customer"],
              ["15,254", "total books"],
              ["1,258", "authors"],
            ].map(([num, label], i) => (
              <React.Fragment key={label}>
                <span>
                  <span className="text-[#0d3b2e] font-bold">{num}</span>{" "}
                  {label}
                </span>
                {i < 3 && <FiPlus className="text-amber-400" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
