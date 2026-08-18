import { Section, EmptyRow, RowActions } from "./AdminTableHelpers";

function ProductsTable({ products, onAdd, onEdit, onDelete }) {
  return (
    <Section title="Products" count={products.length} onAdd={onAdd}>
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
              <EmptyRow cols={7} label="No products yet" />
            ) : (
              products.map((product) => (
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
