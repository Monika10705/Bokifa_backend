import Button from "./Button";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 bg-white shadow-xl rounded-xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>

          <Button
            onClick={onClose}
            className="!w-auto !bg-transparent !py-0 text-xl text-gray-400 hover:text-gray-600 !font-normal"
          >
            &times;
          </Button>
        </div>

        {/* Modal Content */}
        {children}

      </div>
    </div>
  );
}

export default Modal;