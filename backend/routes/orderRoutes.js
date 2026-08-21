const express = require("express");
const {
  placeOrder,
  getUserOrders,
  createRazorpayOrder,
  verifyPayment
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", placeOrder);
router.get("/", getUserOrders);
router.post("/create-payment-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
