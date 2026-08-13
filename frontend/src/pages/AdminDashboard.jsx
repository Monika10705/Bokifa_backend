import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdminData } from "../hooks/useAdminData";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import ProductsTable from "../components/admin/ProductsTable";
import CategoriesTable from "../components/admin/CategoriesTable";
import UsersTable from "../components/admin/UsersTable";

import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import CategoryForm from "../components/CategoryForm";
import UserForm from "../components/UserForm";
import Button from "../components/Button";

const EMPTY_PRODUCT  = { title: "", author: "", description: "", price: "", category: "", image: "", stock: "", rating: 0, isFeatured: false };
const EMPTY_CATEGORY = { name: "", description: "" };
const EMPTY_USER     = { name: "", email: "", password: "" };

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal]             = useState(null); // { type, data, lockedCategory }

  const {
    products, categories, users,
    error, clearError,
    saveProduct, deleteProduct,
    saveCategory, deleteCategory,
    fetchCategoryProducts, addProductToCategory,
    saveUser, deleteUser,
  } = useAdminData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const openModal  = (type, data = null, extra = {}) => setModal({ type, data, ...extra });
  const closeModal = () => setModal(null);

  // ── Save handlers (close modal only on success) ────────
  const handleSaveProduct = async (form) => {
    await saveProduct(form);
    closeModal();
  };

  const handleSaveCategory = async (form) => {
    await saveCategory(form);
    closeModal();
  };

  const handleSaveUser = async (form) => {
    await saveUser(form);
    closeModal();
  };

  // Adding a new product directly from inside a category card
  const handleAddProductToCategory = async (form) => {
    await addProductToCategory(modal.categoryId, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
    closeModal();
  };

  const counts = {
    products:   products.length,
    categories: categories.length,
    users:      users.length,
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={activeTab} onLogout={handleLogout} />

        <main className="flex-1 p-6 overflow-auto">
          {/* Error banner */}
          {error && (
            <div className="flex justify-between mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              <span>{error}</span>
              <Button
                onClick={clearError}
                className="!w-auto !bg-transparent !py-0 !text-red-600 font-bold ml-2"
              >
                ×
              </Button>
            </div>
          )}

          {activeTab === "products" && (
            <ProductsTable
              products={products}
              onAdd={() => openModal("product")}
              onEdit={(product) =>
                openModal("product", {
                  ...product,
                  category: Array.isArray(product.category)
                    ? product.category.join(", ")
                    : product.category,
                })
              }
              onDelete={deleteProduct}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesTable
              categories={categories}
              onAdd={() => openModal("category")}
              onEdit={(category) => openModal("category", category)}
              onDelete={deleteCategory}
              fetchCategoryProducts={fetchCategoryProducts}
              onAddProductToCategory={(category) =>
                openModal("product-in-category", null, {
                  categoryId: category._id,
                  categoryName: category.name,
                })
              }
            />
          )}

          {activeTab === "users" && (
            <UsersTable
              users={users}
              onAdd={() => openModal("user")}
              onEdit={(user) => openModal("user", user)}
              onDelete={deleteUser}
            />
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "product" && (
        <Modal title={modal.data ? "Edit Product" : "Add Product"} onClose={closeModal}>
          <ProductForm
            initial={modal.data || EMPTY_PRODUCT}
            onSubmit={handleSaveProduct}
            onClose={closeModal}
            categories={categories}
          />
        </Modal>
      )}

      {modal?.type === "product-in-category" && (
        <Modal title={`Add Product to "${modal.categoryName}"`} onClose={closeModal}>
          <ProductForm
            initial={EMPTY_PRODUCT}
            onSubmit={handleAddProductToCategory}
            onClose={closeModal}
            categories={categories}
            lockedCategory={modal.categoryName}
          />
        </Modal>
      )}

      {modal?.type === "category" && (
        <Modal title={modal.data ? "Edit Category" : "Add Category"} onClose={closeModal}>
          <CategoryForm
            initial={modal.data || EMPTY_CATEGORY}
            onSubmit={handleSaveCategory}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "user" && (
        <Modal title={modal.data ? "Edit User" : "Add User"} onClose={closeModal}>
          <UserForm
            initial={
              modal.data
                ? { name: modal.data.name, email: modal.data.email, password: "" }
                : EMPTY_USER
            }
            onSubmit={handleSaveUser}
            onClose={closeModal}
            isEdit={!!modal.data}
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
