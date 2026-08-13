import { useState } from "react";
import Button from "./Button";

function CategoryForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial);
  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <input name="name" placeholder="Category Name" value={form.name} onChange={handle} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600" />
      <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handle} rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600" />
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 !py-2 text-sm font-medium">Save</Button>
        <Button type="button" onClick={onClose} className="flex-1 !py-2 !bg-white border border-gray-300 !text-gray-700 text-sm hover:!bg-gray-50">Cancel</Button>
      </div>
    </form>
  );
}

export default CategoryForm;
