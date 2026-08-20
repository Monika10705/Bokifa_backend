import { useMemo, useState } from "react";
import { Section, EmptyRow, RowActions } from "./AdminTableHelpers";

function ProductsTable({ products, search, onSearch, onAdd, onEdit, onDelete }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (statusFilter === "active") {
      return products.filter((product) => product.isActive !== false);
    }

    if (statusFilter === "inactive") {
      return products.filter((product) => product.isActive === false);
    }

    return products;
  }, [products, statusFilter]);

  return (
    <Section
      title="Products"
      count={products.length}
      onAdd={onAdd}
      headerAction={(
        <div className="relative w-48 sm:w-64">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <p className="text-xs font-medium text-gray-500">Filter Products</p>

        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              aria-pressed={statusFilter === filter.value}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === filter.value
                  ? "border-gray-800 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Author</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Stock</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Featured</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <EmptyRow cols={8} label="No products yet" />
            ) : filteredProducts.length === 0 ? (
              <EmptyRow cols={8} label={`No ${statusFilter} products found`} />
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium max-w-[140px] truncate">
                    {product.title}
                    {/* Show author below title on mobile */}
                    <p className="sm:hidden text-xs text-gray-400 font-normal mt-0.5">{product.author}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{product.author}</td>
                  <td className="px-4 py-3">€{product.price}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.isActive !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {product.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {product.isFeatured
                      ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">★ Yes</span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(product._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export default ProductsTable;
