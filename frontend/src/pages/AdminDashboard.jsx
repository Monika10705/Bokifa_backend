import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Imported humanized components
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import UserForm from "../components/UserForm";

const EMPTY_PRODUCT = { title: "", author: "", description: "", price: "", category: "", image: "", stock: "", isFeatured: false };
const EMPTY_USER = { name: "", email: "", password: "" };

function AdminDashboard() {
  const navigate = useNavigate();

  // State management
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null); // { type: 'product'|'user', data: null|obj }
  const [error, setError] = useState("");

  // Human logic: Helper function to get fresh authorization headers every time a network request happens
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetching Data
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/admin/products", getAuthHeader());
      setProducts(res.data.products);
    } catch (err) {
      setError("Failed to fetch products.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users", getAuthHeader());
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  }, []);

  // Run on mount
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, [fetchProducts, fetchUsers]);

  // Auth Actions
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Product Actions
  const saveProduct = async (form) => {
    try {
      const formattedCategory = typeof form.category === "string"
        ? form.category.split(",").map((c) => c.trim())
        : form.category;

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category: formattedCategory
      };

      if (modal.data) {
        await api.put(`/admin/products/${modal.data._id}`, payload, getAuthHeader());
      } else {
        await api.post("/admin/products", payload, getAuthHeader());
      }

      setModal(null);
      fetchProducts();
    } catch (e) {
      setError(e.response?.data?.message || "Error saving product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/products/${id}`, getAuthHeader());
      fetchProducts();
    } catch (e) {
      setError("Failed to delete product.");
    }
  };

  // User Actions
  const saveUser = async (form) => {
    try {
      if (modal.data) {
        await api.put(`/admin/users/${modal.data._id}`, form, getAuthHeader());
      } else {
        await api.post("/admin/users", form, getAuthHeader());
      }

      setModal(null);
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.message || "Error saving user");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`, getAuthHeader());
      fetchUsers();
    } catch (e) {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <h1 className="text-xl font-bold text-green-700">Bokifa Admin</h1>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
          Logout
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-6">

        {/* Error Alert */}
        {error && (
          <div className="flex justify-between mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold ml-2">×</button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6">
          <h2
            className='text-2xl font-semibold text-gray-700 cursor-pointer'
          >
            Products
          </h2>
          
        </div>

        {/* Products List Content */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">Products ({products.length})</h2>
              <button
                onClick={() => setModal({ type: "product", data: null })}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                + Add Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Author</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Featured</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No products found. Click "+ Add Product" to create one.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                        {/* Image */}
                        <td className="px-4 py-3">
                          <img
                            src={product.image || "https://placeholder.com"}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-lg border bg-gray-100"
                            onError={(e) => { e.target.src = "https://placeholder.com"; }}
                          />
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3 font-medium text-gray-900">{product.title}</td>

                        {/* Author */}
                        <td className="px-4 py-3 text-gray-600">{product.author || "N/A"}</td>

                        {/* Price */}
                        <td className="px-4 py-3 font-semibold text-gray-700">${Number(product.price).toFixed(2)}</td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}>
                            {product.stock} units
                          </span>
                        </td>

                        {/* Featured Status */}
                        <td className="px-4 py-3">
                          {product.isFeatured ? (
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded font-medium">★ Yes</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setModal({ type: "product", data: product })}
                              className="text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="text-sm text-red-500 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Modal Controller */}
      {modal && (
        <Modal
          title={modal.data ? `Edit ${modal.type}` : `Add ${modal.type}`}
          onClose={() => setModal(null)}
        >
          {modal.type === "product" ? (
            <ProductForm
              initial={modal.data || EMPTY_PRODUCT}
              onSubmit={saveProduct}
              onClose={() => setModal(null)}
            />
          ) : (
            <UserForm
              initial={modal.data || EMPTY_USER}
              onSubmit={saveUser}
              onClose={() => setModal(null)}
              isEdit={!!modal.data}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
