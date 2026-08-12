
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">

                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-xl text-gray-400 hover:text-gray-600"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Content */}
                {children}

            </div>
        </div>
    );
}

export default Modal;