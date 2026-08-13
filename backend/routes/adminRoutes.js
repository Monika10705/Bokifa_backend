const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllUsers, createUser, updateUser, deleteUser, getAllCategories, createCategory, updateCategory, deleteCategory, syncCategoriesFromProducts, getProductsByCategory, addProductToCategory } = require("../controllers/adminController");
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.use(adminMiddleware);

// User CRUD
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Product CRUD (admin-protected)
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Category CRUD
router.post("/categories/sync", syncCategoriesFromProducts);
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Category <-> Products
router.get("/categories/:id/products", getProductsByCategory);
router.post("/categories/:id/products", addProductToCategory);

module.exports = router;
