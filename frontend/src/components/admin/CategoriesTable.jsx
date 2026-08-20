import { useMemo, useState } from "react";
import Button from "../Button";
import CategoryProductsPanel from "./CategoryProductsPanel";

function CategoriesTable({ categories, onAdd, onEdit, onDelete, fetchCategoryProducts, onAddProductToCategory }) {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [category.name, category.slug, category.description]
        .some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [categories, search]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <h3 className="font-semibold text-gray-700">Categories ({categories.length})</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <Button onClick={onAdd} className="!w-auto px-4 !py-2 text-sm !font-medium">
            + Add Category
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm px-6 py-10 text-center text-gray-400 text-sm">
          No categories yet. Create one to get started.
        </div>
      )}

      {/* Category cards */}
      <div className="space-y-3">
        {filteredCategories.length === 0 && categories.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm px-6 py-10 text-center text-gray-400 text-sm">
            No categories found
          </div>
        )}
        {filteredCategories.map((category) => {
          const isExpanded = expandedId === category._id;

          return (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Card header row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Expand toggle */}
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="text-gray-400 hover:text-gray-600 transition text-sm shrink-0 w-5"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>

                {/* Category name + slug */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                      {category.slug}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${category.isActive !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {category.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Created date */}
                <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  <Button
                    onClick={() => onEdit(category)}
                    className="!w-auto !bg-transparent !py-0 !text-blue-500 text-xs hover:underline !font-medium"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(category._id)}
                    className="!w-auto !bg-transparent !py-0 !text-red-500 text-xs hover:underline !font-medium"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Expandable products panel */}
              {isExpanded && (
                <div className="px-5 pb-4">
                  <CategoryProductsPanel
                    category={category}
                    fetchCategoryProducts={fetchCategoryProducts}
                    onAddProduct={onAddProductToCategory}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesTable;
