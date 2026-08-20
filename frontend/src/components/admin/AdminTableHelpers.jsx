import Button from "../Button";

// Color mapping for each order status
const STATUS_STYLES = {
  pending:    "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped:    "bg-purple-50 text-purple-700",
  delivered:  "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-600",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function Section({ title, count, onAdd, headerAction, children }) {
  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-4">
        <h3 className="font-semibold text-gray-700">
          {title} ({count})
        </h3>
        <div className="flex items-center gap-3">
          {headerAction}
          <Button
            onClick={onAdd}
            className="!w-auto px-4 !py-2 text-sm !font-medium"
          >
            + Add {title.slice(0, -1)}
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function TableHead({ columns }) {
  return (
    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
      <tr>
        {columns.map((col) => (
          <th key={col} className="px-4 py-3 text-left">{col}</th>
        ))}
      </tr>
    </thead>
  );
}

export function EmptyRow({ cols, label }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-gray-400 text-sm">
        {label}
      </td>
    </tr>
  );
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-3">
      <Button onClick={onEdit}   className="!w-auto !bg-transparent !py-0 !text-blue-500 text-xs hover:underline !font-medium">Edit</Button>
      <Button onClick={onDelete} className="!w-auto !bg-transparent !py-0 !text-red-500 text-xs hover:underline !font-medium">Delete</Button>
    </div>
  );
}
