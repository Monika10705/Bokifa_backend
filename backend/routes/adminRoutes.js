const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getAllOrders, updateOrderStatus,
  getAllCategories, createCategory, updateCategory, deleteCategory,
  syncCategoriesFromProducts,
  getProductsByCategory, addProductToCategory,
} = require("../controllers/adminController");

const {
  addProduct, getAllProducts, updateProduct, deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Every route below requires a valid admin token
router.use(adminMiddleware);

// ── Users (read-only) ──────────────────────────────────────────────────────
router.get("/users", getAllUsers);

// ── Orders ─────────────────────────────────────────────────────────────────
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// ── Products ───────────────────────────────────────────────────────────────
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// ── Categories ─────────────────────────────────────────────────────────────
router.post("/categories/sync", syncCategoriesFromProducts);
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ── Category <-> Products ──────────────────────────────────────────────────
router.get("/categories/:id/products", getProductsByCategory);
router.post("/categories/:id/products", addProductToCategory);

module.exports = router;
