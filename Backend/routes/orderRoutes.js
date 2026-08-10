const express = require("express");

const {
  addOrder,
  cancelOrder,
  getOrders,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addOrder);

router.get("/", protect, getOrders);

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

module.exports = router;