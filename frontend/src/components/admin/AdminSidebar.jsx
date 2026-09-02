import Button from "../Button";

const NAV_ITEMS = [
  { key: "dashboard",  label: "Dashboard",  icon: "📊" },
  { key: "categories", label: "Categories", icon: "🏷️" },
  { key: "products",   label: "Products",   icon: "📦" },
  { key: "orders",     label: "Orders",     icon: "🧾" },
  { key: "users",      label: "Users",      icon: "👥" },
];

function AdminSidebar({ activeTab, onTabChange, counts, isOpen, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 bg-white border-r flex flex-col transition-transform duration-200
          lg:static lg:translate-x-0 lg:z-auto
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          ${isOpen ? "lg:w-56" : "lg:w-16"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-5 border-b">
          <span className="text-green-700 text-xl font-bold truncate">
            {isOpen ? "Bokifa Admin" : <span className="lg:block hidden">B</span>}
            <span className="lg:hidden">Bokifa Admin</span>
          </span>
          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.key}
              onClick={() => { onTabChange(item.key); onMobileClose(); }}
              className={`!w-full flex items-center gap-3 px-3 !py-2.5 !rounded-lg text-sm !font-medium transition-colors
                ${activeTab === item.key
                  ? "!bg-green-50 !text-green-700"
                  : "!bg-transparent !text-gray-600 hover:!bg-gray-100"
                }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span className={`flex-1 text-left lg:${isOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
              {counts[item.key] !== undefined && (
                <span className={`text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full lg:${isOpen ? "inline" : "hidden"}`}>
                  {counts[item.key]}
                </span>
              )}
            </Button>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <Button
          onClick={onToggle}
          className="hidden lg:flex mx-2 mb-4 !w-auto items-center justify-center gap-2 px-3 !py-2 !rounded-lg text-xs !text-gray-400 !bg-transparent hover:!bg-gray-100 transition"
        >
          {isOpen ? "◀ Collapse" : "▶"}
        </Button>
      </aside>
    </>
  );
}

export default AdminSidebar;
