import { Section, TableHead, EmptyRow, RowActions } from "./AdminTableHelpers";

const COLUMNS = ["Image", "Title", "Author", "Price", "Stock", "Featured", "Actions"];

function ProductsTable({ products, onAdd, onEdit, onDelete }) {
  return (
    <Section title="Products" count={products.length} onAdd={onAdd}>
      <table className="w-full text-sm">
        <TableHead columns={COLUMNS} />
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
                <td className="px-4 py-3 font-medium max-w-[160px] truncate">{product.title}</td>
                <td className="px-4 py-3 text-gray-500">{product.author}</td>
                <td className="px-4 py-3">€{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
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
    </Section>
  );
}

export default ProductsTable;
