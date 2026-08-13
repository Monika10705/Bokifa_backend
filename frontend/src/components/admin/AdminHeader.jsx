import Button from "../Button";

function AdminHeader({ title, onLogout }) {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
      <h2 className="text-lg font-semibold text-gray-800 capitalize">{title}</h2>
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
