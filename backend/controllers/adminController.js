const User = require("../models/User");
const Category = require("../models/Category");
const Order = require("../models/Order");

// ── Users (read-only) ──────────────────────────────────────────────────────

// Get all users — admin can only view, not modify
const getAllUsers = async (req, res) => {
  try {
    console.log("USER QUERY:", req.query);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    console.log("LIMIT:", limit);
    console.log("OFFSET:", offset);

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),

      User.countDocuments(),
    ]);

    console.log("USERS RETURNED:", users.length);
    console.log("TOTAL:", total);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      success: true,
      users,
      pagination: {
        limit,
        offset,
        total,
        totalPages,
        currentPage,
        hasNextPage: offset + users.length < total,
        hasPreviousPage: offset > 0,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── Orders (admin view + status update) ───────────────────────────────────

// Get all orders from all users, with user details populated
const getAllOrders = async (req, res) => {
  try {
    console.log("ORDER QUERY:", req.query);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    const { status } = req.query;

    console.log("LIMIT:", limit);
    console.log("OFFSET:", offset);
    console.log("STATUS:", status || "all");

    // Build filter
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),

      Order.countDocuments(filter),
    ]);

    console.log("ORDERS RETURNED:", orders.length);
    console.log("TOTAL:", total);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        limit,
        offset,
        status,
        total,
        totalPages,
        currentPage,
        hasNextPage: offset + orders.length < total,
        hasPreviousPage: offset > 0,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update the status of a specific order
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate("user", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    console.log("PRODUCT QUERY:", req.query);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    console.log("LIMIT:", limit);
    console.log("OFFSET:", offset);

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),

      Product.countDocuments(),
    ]);

    console.log("PRODUCTS RETURNED:", products.length);
    console.log("TOTAL:", total);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      success: true,
      products,
      pagination: {
        limit,
        offset,
        total,
        totalPages,
        currentPage,
        hasNextPage: offset + products.length < total,
        hasPreviousPage: offset > 0,
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    console.log("CATEGORY QUERY:", req.query);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    const { search = "" } = req.query;

    console.log("LIMIT:", limit);
    console.log("OFFSET:", offset);
    console.log("SEARCH:", search || "all");

    // Build filter
    const filter = {};

    if (search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort({ name: 1 })
        .skip(offset)
        .limit(limit),

      Category.countDocuments(filter),
    ]);

    console.log("CATEGORIES RETURNED:", categories.length);
    console.log("TOTAL:", total);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      success: true,
      categories,
      pagination: {
        limit,
        offset,
        total,
        totalPages,
        currentPage,
        hasNextPage: offset + categories.length < total,
        hasPreviousPage: offset > 0,
      },
    });
  } catch (error) {
    console.error("Get all categories error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
        update: {
          $setOnInsert: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            description: "",
            isActive: true,
          },
        },
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
    const { name, description, isActive } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const existing = await Category.findOne({ slug });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    const category = await Category.create({
      name,
      slug,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, runValidators: true },
    );
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
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
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

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
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const {
      title,
      author,
      description,
      price,
      image,
      stock,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.create({
      title,
      author,
      description,
      price: Number(price),
      image,
      stock: Number(stock) || 0,
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
      category: [category.name],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    // ── Dashboard statistics ──────────────────────────────────────────────

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments({
      isActive: { $ne: false },
    });

    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // ── Order status counts ───────────────────────────────────────────────

    const orderStatusResult = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStats = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusResult.forEach((item) => {
      if (orderStats[item._id] !== undefined) {
        orderStats[item._id] = item.count;
      }
    });

    // ── Revenue chart data ────────────────────────────────────────────────
    // Last 7 days

    const tenDaysAgo = new Date();

    tenDaysAgo.setHours(0, 0, 0, 0);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 9);

    const revenueChartResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: tenDaysAgo },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    // Create all 7 days, including days with zero sales
    const revenueChart = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date(tenDaysAgo);

      date.setDate(tenDaysAgo.getDate() + i);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const existingDay = revenueChartResult.find(
        (item) =>
          item._id.year === year &&
          item._id.month === month &&
          item._id.day === day
      );

      revenueChart.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: existingDay?.revenue || 0,
        orders: existingDay?.orders || 0,
      });
    }

    // ── Recent orders ─────────────────────────────────────────────────────

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // ── Recent users ──────────────────────────────────────────────────────

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // ── Dashboard response ────────────────────────────────────────────────

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },

      orderStats,

      revenueChart,

      recentOrders,

      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  syncCategoriesFromProducts,
  getProductsByCategory,
  addProductToCategory,
  getDashboard,
};
