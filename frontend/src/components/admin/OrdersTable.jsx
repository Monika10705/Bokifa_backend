import { useState } from "react";
import { EmptyRow, StatusBadge } from "./AdminTableHelpers";

const ALL_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

function OrdersTable({ orders, onUpdateStatus }) {
  const [expandedId, setExpandedId] = useState(null);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  function formatPrice(num) {
    return Number(num).toFixed(2);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Orders ({orders.length})</h3>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm px-6 py-10 text-center text-gray-400 text-sm">
            No orders yet
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedId === order._id;
            return (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Card header */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-semibold text-green-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm font-medium text-gray-800">{order.user?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right space-y-1 shrink-0">
                    <p className="text-sm font-bold text-gray-800">€{formatPrice(order.total)}</p>
                    <StatusBadge status={order.status} />
                    <p className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</p>
                  </div>
                </button>

                {/* Status update + expanded items */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Update status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-green-600 bg-white cursor-pointer"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                          <img src={item.image} alt={item.title} className="w-9 h-12 object-cover rounded shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.author}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-800">€{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-xs text-gray-400">×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-right space-y-1 pt-1 border-t border-gray-100">
                      <p className="text-gray-500">Subtotal: <span className="font-medium text-gray-700">€{formatPrice(order.subtotal)}</span></p>
                      <p className="text-gray-500">Shipping: <span className={`font-medium ${order.shipping === 0 ? "text-green-600" : "text-gray-700"}`}>{order.shipping === 0 ? "Free" : `€${formatPrice(order.shipping)}`}</span></p>
                      <p className="font-bold text-gray-800 text-sm">Total: €{formatPrice(order.total)}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Update Status"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <EmptyRow cols={7} label="No orders yet" />
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedId === order._id;
                  return (
                    <>
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="font-mono text-xs text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            {isExpanded ? "▾" : "▸"}
                            #{order._id.slice(-8).toUpperCase()}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{order.user?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400">{order.user?.email || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">€{formatPrice(order.total)}</td>
                        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-green-600 bg-white cursor-pointer"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${order._id}-items`} className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</p>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                                  <img src={item.image} alt={item.title} className="w-10 object-cover rounded shrink-0" style={{ height: "52px" }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-400">{item.author}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-gray-800">€{formatPrice(item.price * item.quantity)}</p>
                                    <p className="text-xs text-gray-400">€{formatPrice(item.price)} × {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <div className="text-xs space-y-1 text-right">
                                <p className="text-gray-500">Subtotal: <span className="font-medium text-gray-700">€{formatPrice(order.subtotal)}</span></p>
                                <p className="text-gray-500">Shipping: <span className={`font-medium ${order.shipping === 0 ? "text-green-600" : "text-gray-700"}`}>{order.shipping === 0 ? "Free" : `€${formatPrice(order.shipping)}`}</span></p>
                                <p className="text-gray-800 font-bold text-sm">Total: €{formatPrice(order.total)}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
