const Product = require("../models/Product");
const Category = require("../models/Category");

const addProduct = async (req, res) => {
    try {
        const { title, description, price, category, image, stock, isActive, isFeatured } = req.body;

        const product = await Product.create({
            title,
            description,
            price,
            category,
            image,
            stock,
            isActive: isActive !== undefined ? isActive : true,
            isFeatured: isFeatured || false,
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        }); 
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getAllProducts = async (req, res) => {
  try {
    const allCategoryNames = await Category.find().distinct("name");
    const activeCategoryNames = await Category.find({ isActive: { $ne: false } }).distinct("name");
    const products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });

    const visibleProducts = products.filter((product) => {
      const categories = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);

      if (!categories.length) return true;
      if (!allCategoryNames.length) return true;
      if (!activeCategoryNames.length) return false;

      return categories.some((name) => activeCategoryNames.includes(name));
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: visibleProducts.length,
      products: visibleProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const allCategoryNames = await Category.find().distinct("name");
    const activeCategoryNames = await Category.find({ isActive: { $ne: false } }).distinct("name");
    const categories = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
    const hasActiveCategory =
      !categories.length ||
      !allCategoryNames.length ||
      categories.some((name) => activeCategoryNames.includes(name));

    if (!hasActiveCategory) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}