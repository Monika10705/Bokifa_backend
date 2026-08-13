import Button from "../../components/Button";

export function Section({ title, count, onAdd, children }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">
          {title} ({count})
        </h3>
        <Button
          onClick={onAdd}
          className="!w-auto px-4 !py-2 text-sm !font-medium"
        >
          + Add {title.slice(0, -1)}
        </Button>
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
