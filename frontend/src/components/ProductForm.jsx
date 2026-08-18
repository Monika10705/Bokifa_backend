import { useState } from "react";
import Button from "./Button";

function ProductForm({ initial, onSubmit, onClose, categories = [], lockedCategory = null }) {
  const [form, setForm] = useState(() => ({
    ...initial,
    // If a category is locked (adding from category panel), pre-select it
    category: lockedCategory ? lockedCategory : initial.category || "",
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className={inputClass}
      />

      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="price"
          placeholder="Price (€)"
          value={form.price}
          onChange={handleChange}
          required
          type="number"
          min="0"
          step="0.01"
          className={inputClass}
        />
        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          type="number"
          min="0"
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500 font-medium">Rating (0 – 5)</label>
        <div className="flex items-center gap-3">
          <input
            name="rating"
            type="range"
            min="0"
            max="5"
            step="1"
            value={form.rating ?? 0}
            onChange={handleChange}
            className="flex-1 accent-green-600"
          />
          <span className="text-sm font-semibold text-green-700 w-5 text-center">
            {form.rating ?? 0}
          </span>
        </div>
      </div>

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        required
        className={inputClass}
      />

      {/* Category — dropdown if categories list provided, locked if lockedCategory set */}
      {lockedCategory ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-xs text-green-700 font-medium">Category:</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
            {lockedCategory}
          </span>
        </div>
      ) : categories.length > 0 ? (
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          name="category"
          placeholder="Category (comma separated)"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        />
      )}

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className={inputClass}
      />

      <div className="flex flex-col gap-2 pt-1">
        <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={Boolean(form.isActive ?? true)}
            onChange={handleChange}
          />
          <span>Active product</span>
        </label>

        <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={Boolean(form.isFeatured)}
            onChange={handleChange}
          />
          <span>Featured product</span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1 !py-2 text-sm font-medium">
          Save
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 !py-2 !bg-white border border-gray-300 !text-gray-700 text-sm hover:!bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
