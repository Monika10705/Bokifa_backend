const express = require("express");
const { placeOrder, getUserOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", placeOrder);
router.get("/", getUserOrders);

module.exports = router;
