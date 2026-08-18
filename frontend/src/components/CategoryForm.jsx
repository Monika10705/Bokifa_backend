import { useState } from "react";
import Button from "./Button";

function CategoryForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(() => ({
    ...initial,
    isActive: initial?.isActive ?? true,
  }));

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <input name="name" placeholder="Category Name" value={form.name} onChange={handle} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600" />
      <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handle} rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600" />
      <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
        <input
          type="checkbox"
          name="isActive"
          checked={Boolean(form.isActive ?? true)}
          onChange={handle}
        />
        <span>Active category</span>
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 !py-2 text-sm font-medium">Save</Button>
        <Button type="button" onClick={onClose} className="flex-1 !py-2 !bg-white border border-gray-300 !text-gray-700 text-sm hover:!bg-gray-50">Cancel</Button>
      </div>
    </form>
  );
}

export default CategoryForm;
