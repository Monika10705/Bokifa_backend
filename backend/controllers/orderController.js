const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  try {
    const { items, subtotal, shipping, total } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      shipping,
      total,
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getUserOrders };