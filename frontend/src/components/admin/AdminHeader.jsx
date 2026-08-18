import Button from "../Button";

function AdminHeader({ title, onLogout, onMenuOpen }) {
  return (
    <header className="bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{title}</h2>
      </div>

      <Button
        onClick={onLogout}
        className="!w-auto !bg-transparent !py-1 !text-red-500 text-sm hover:underline !font-normal"
      >
        Logout
      </Button>
    </header>
  );
}

export default AdminHeader;
