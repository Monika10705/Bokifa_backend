const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ success: true, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, message: "User not found" 
      });
    }

    res.status(200).json({ success: true, user });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reads all unique category strings from existing products and upserts them
// into the Category collection so the admin panel always stays in sync.
const syncCategoriesFromProducts = async (req, res) => {
  try {
    const Product = require("../models/Product");
    const allProducts = await Product.find({}, "category");

    const uniqueNames = [
      ...new Set(allProducts.flatMap((p) => p.category).filter(Boolean)),
    ];

    const ops = uniqueNames.map((name) => ({
      updateOne: {
        filter: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: { $setOnInsert: { name, slug: name.toLowerCase().replace(/\s+/g, "-"), description: "" } },
        upsert: true,
      },
    }));

    if (ops.length) await Category.bulkWrite(ops);

    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const existing = await Category.findOne({ slug });
    if (existing)
      return res.status(400).json({ success: false, message: "Category already exists" });
    const category = await Category.create({ name, slug, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true, runValidators: true }
    );
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Category ↔ Products ────────────────────────────────────────────────────
const Product = require("../models/Product");

const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    // Products whose category array contains this category's name
    const products = await Product.find({ category: category.name });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addProductToCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    const { title, author, description, price, image, stock, isFeatured } = req.body;

    const product = await Product.create({
      title,
      author,
      description,
      price: Number(price),
      image,
      stock: Number(stock) || 0,
      isFeatured: isFeatured || false,
      category: [category.name],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers, createUser, updateUser, deleteUser,
  getAllCategories, createCategory, updateCategory, deleteCategory,
  syncCategoriesFromProducts,
  getProductsByCategory, addProductToCategory,
};
