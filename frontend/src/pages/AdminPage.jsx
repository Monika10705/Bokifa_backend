import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

import { useAdminData } from "../hooks/useAdminData";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminDashboard from "../components/admin/AdminDashboard";
import ProductsTable from "../components/admin/ProductsTable";
import CategoriesTable from "../components/admin/CategoriesTable";
import OrdersTable from "../components/admin/OrdersTable";
import UsersTable from "../components/admin/UsersTable";

import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import CategoryForm from "../components/CategoryForm";
import Button from "../components/Button";
import Pagination from "../components/admin/Pagination";

// Default empty states for the add forms
const EMPTY_PRODUCT = { title: "", author: "", description: "", price: "", category: "", image: "", stock: "", rating: 0, isFeatured: false, isActive: true };
const EMPTY_CATEGORY = { name: "", description: "", isActive: true };

function AdminPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [productSearch, setProductSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState(null); // { type, data, ...extras }

  const {
    products,
    categories,
    users,
    orders,

    productPagination,
    categoryPagination,
    userPagination,
    orderPagination,

    fetchProducts,
    fetchCategories,
    fetchUsers,
    fetchOrders,

    error,
    clearError,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    fetchCategoryProducts,
    addProductToCategory,
    updateOrderStatus,
  } = useAdminData();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const openModal = (type, data = null, extra = {}) => setModal({ type, data, ...extra });
  const closeModal = () => setModal(null);

  // Close modal only after a successful save
  async function handleSaveProduct(form) {
    await saveProduct(form);
    closeModal();
  }

  async function handleSaveCategory(form) {
    await saveCategory(form);
    closeModal();
  }

  // When adding a product from inside a category card
  async function handleAddProductToCategory(form) {
    await addProductToCategory(modal.categoryId, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
    closeModal();
  }

  // Badge counts shown next to each sidebar nav item
  const counts = {
    products: products.length,
    categories: categories.length,
    orders: orders.length,
    users: users.length,
  };

  const filteredProducts = products.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return true;

    return [product.title, product.author]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen flex bg-gray-50 relative">

      {/* Left sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        // counts={counts}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        <AdminHeader title={activeTab} onLogout={handleLogout} onMenuOpen={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-6 overflow-auto">

          {/* Error banner */}
          {error && (
            <div className="flex justify-between mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              <span>{error}</span>

              <Button
                onClick={clearError}
                className="!w-auto !bg-transparent !py-0 !text-red-600 font-bold ml-2"
              >
                <FiX aria-label="Dismiss error" />
              </Button>
            </div>
          )}

          {/* Dashboard tab */}
          {activeTab === "dashboard" && (
            <AdminDashboard
              onViewOrders={() => setActiveTab("orders")}
              onViewUsers={() => setActiveTab("users")}
            />
          )}

          {/* Categories tab */}
          {activeTab === "categories" && (
            <>
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

              <Pagination
                pagination={categoryPagination}
                onPageChange={(page) => {
                  const offset = (page - 1) * categoryPagination.limit;
                  fetchCategories(offset);
                }}
              />
            </>
          )}

          {/* Products tab */}
          {activeTab === "products" && (
            <>
              <ProductsTable
                products={filteredProducts}
                search={productSearch}
                onSearch={setProductSearch}
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

              <Pagination
                pagination={productPagination}
                onPageChange={(page) => {
                  const offset = (page - 1) * productPagination.limit;
                  fetchProducts(offset);
                }}
              />
            </>
          )}

          {/* Orders tab */}
          {activeTab === "orders" && (
            <>
              <OrdersTable
                orders={orders}
                onUpdateStatus={updateOrderStatus}
              />

              <Pagination
                pagination={orderPagination}
                onPageChange={(page) => {
                  const offset = (page - 1) * orderPagination.limit;
                  fetchOrders(offset);
                }}
              />
            </>
          )}

          {/* Users tab */}
          {activeTab === "users" && (
            <>
              <UsersTable users={users} />

              <Pagination
                pagination={userPagination}
                onPageChange={(page) => {
                  const offset = (page - 1) * userPagination.limit;
                  fetchUsers(offset);
                }}
              />
            </>
          )}

        </main>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {modal?.type === "category" && (
        <Modal
          title={modal.data ? "Edit Category" : "Add Category"}
          onClose={closeModal}
        >
          <CategoryForm
            initial={modal.data || EMPTY_CATEGORY}
            onSubmit={handleSaveCategory}
            onClose={closeModal}
          />
        </Modal>
      )}
      {/* Add / Edit product */}
      {modal?.type === "product" && (
        <Modal
          title={modal.data ? "Edit Product" : "Add Product"}
          onClose={closeModal}
        >
          <ProductForm
            initial={modal.data || EMPTY_PRODUCT}
            onSubmit={handleSaveProduct}
            onClose={closeModal}
            categories={categories}
          />
        </Modal>
      )}

      {/* Add product from inside a category card */}
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

    </div>
  );
}

export default AdminPage;
