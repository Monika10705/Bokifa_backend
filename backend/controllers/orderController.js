const Order = require("../models/Order");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

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

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { total } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const options = {
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    // Check if this Razorpay order has already been used
    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order: existingOrder,
      });
    }

    // IMPORTANT:
    // Verify using the Razorpay order ID that YOUR SERVER created.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Payment is authentic
    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      shipping,
      total,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "paid",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment verified and order created successfully",
      order,
    });
  } catch (error) {
    console.error("===== VERIFY PAYMENT ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  createRazorpayOrder,
  verifyPayment,
};
