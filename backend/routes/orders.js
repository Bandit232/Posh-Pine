const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders");
const { protect, admin } = require("../middleware/auth");
const { createOrderValidator } = require("../utils/validators");

router.post("/", createOrderValidator, ordersController.createOrder);
router.use(protect);

router.get("/", admin, ordersController.getOrders);
router.get("/:id", ordersController.getOrder);

// admin update status
router.put("/:id/status", admin, ordersController.updateOrderStatus);
router.post("/:id/cancel", ordersController.cancelOrder);

module.exports = router;
