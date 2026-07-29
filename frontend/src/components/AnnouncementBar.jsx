import { ChevronLeft, ChevronRight } from "lucide-react";

function AnnouncementBar() {
  return (
    <div className="bg-[#0d3b2e] text-white text-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
              <button
                aria-label="Previous announcement"
                className="hover:opacity-70 transition-opacity"
              >
                <ChevronLeft size={16} />
              </button>
              <p className="tracking-wide">
                All books at least <span className="font-semibold">50% off</span> list
                prices every day
              </p>
              <button
                aria-label="Next announcement"
                className="hover:opacity-70 transition-opacity"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
    
  );
}

export default AnnouncementBar;