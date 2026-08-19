import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

// Builds the Authorization header from the token stored in localStorage
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export function useAdminData() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  // ── Fetch all data on mount ────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/admin/products", authHeader());
      setProducts(res.data.products);
    } catch {
      setError("Failed to load products.");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // Sync first: creates Category documents for any product category
      // strings that don't have one yet, then returns the full list.
      const res = await api.post("/admin/categories/sync", {}, authHeader());
      setCategories(res.data.categories);
    } catch {
      setError("Failed to load categories.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users", authHeader());
      setUsers(res.data.users);
    } catch {
      setError("Failed to load users.");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/admin/orders", authHeader());
      setOrders(res.data.orders);
    } catch {
      setError("Failed to load orders.");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchOrders();
  }, [fetchProducts, fetchCategories, fetchUsers, fetchOrders]);

  // ── Products ───────────────────────────────────────────────────────────────

  const saveProduct = async (form) => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating ?? 0),
        category:
          typeof form.category === "string"
            ? form.category.split(",").map((c) => c.trim())
            : form.category,
      };

      if (form._id) {
        await api.put(`/admin/products/${form._id}`, payload, authHeader());
      } else {
        await api.post("/admin/products", payload, authHeader());
      }

      fetchProducts();
    } catch (e) {
      setError(e.response?.data?.message || "Error saving product.");
      throw e;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`, authHeader());
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    }
  };

  // ── Categories ─────────────────────────────────────────────────────────────

  const saveCategory = async (form) => {
    try {
      if (form._id) {
        await api.put(`/admin/categories/${form._id}`, form, authHeader());
      } else {
        await api.post("/admin/categories", form, authHeader());
      }
      // Re-sync so the list stays consistent after save
      const res = await api.post("/admin/categories/sync", {}, authHeader());
      setCategories(res.data.categories);
    } catch (e) {
      setError(e.response?.data?.message || "Error saving category.");
      throw e;
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/admin/categories/${id}`, authHeader());
      fetchCategories();
    } catch {
      setError("Failed to delete category.");
    }
  };

  // ── Category <-> Products ──────────────────────────────────────────────────

  const fetchCategoryProducts = useCallback(async (categoryId) => {
    try {
      const res = await api.get(
        `/admin/categories/${categoryId}/products`,
        authHeader(),
      );
      return res.data.products;
    } catch {
      setError("Failed to load category products.");
      return [];
    }
  }, []);

  const addProductToCategory = async (categoryId, form) => {
    try {
      await api.post(
        `/admin/categories/${categoryId}/products`,
        form,
        authHeader(),
      );
      fetchProducts();
    } catch (e) {
      setError(
        e.response?.data?.message || "Error adding product to category.",
      );
      throw e;
    }
  };

  // ── Orders ─────────────────────────────────────────────────────────────────

  // Updates the status of an order (e.g. pending → shipped)
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(
        `/admin/orders/${orderId}/status`,
        { status },
        authHeader(),
      );
      // Update just the one order in state instead of re-fetching everything
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o)),
      );
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update order status.");
    }
  };

  return {
    products,
    categories,
    users,
    orders,
    error,
    clearError,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    fetchCategoryProducts,
    addProductToCategory,
    updateOrderStatus,
  };
}
