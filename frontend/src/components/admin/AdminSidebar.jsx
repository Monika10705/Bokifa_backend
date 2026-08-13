import Button from "../Button";

const NAV_ITEMS = [
  { key: "products",   label: "Products",   icon: "📦" },
  { key: "categories", label: "Categories", icon: "🏷️" },
  { key: "users",      label: "Users",      icon: "👥" },
];

function AdminSidebar({ activeTab, onTabChange, counts, isOpen, onToggle }) {
  return (
    <aside className={`${isOpen ? "w-56" : "w-16"} bg-white border-r flex flex-col transition-all duration-200 shrink-0`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        <span className="text-green-700 text-xl font-bold">
          {isOpen ? "Bokifa Admin" : "B"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`!w-full flex items-center gap-3 px-3 !py-2.5 !rounded-lg text-sm !font-medium transition-colors ${
              activeTab === item.key
                ? "!bg-green-50 !text-green-700"
                : "!bg-transparent !text-gray-600 hover:!bg-gray-100"
            }`}
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {isOpen && <span className="flex-1 text-left">{item.label}</span>}
            {isOpen && counts[item.key] !== undefined && (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {counts[item.key]}
              </span>
            )}
          </Button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <Button
        onClick={onToggle}
        className="mx-2 mb-4 !w-auto flex items-center justify-center gap-2 px-3 !py-2 !rounded-lg text-xs !text-gray-400 !bg-transparent hover:!bg-gray-100 transition"
      >
        {isOpen ? "◀ Collapse" : "▶"}
      </Button>
    </aside>
  );
}

export default AdminSidebar;
