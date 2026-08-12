import { useState } from "react";

function ProductForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial);

  // Clear, readable input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <input
          name="price"
           placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <input
          name="category"
          placeholder="Category (comma separated)"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
           rows={2}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm select-none">
        <input
          type="checkbox"
          name="isFeatured"
          checked={form.isFeatured}
          onChange={handleChange}
        />
        <span>Featured</span>
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Save
        </button>
         <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductForm;