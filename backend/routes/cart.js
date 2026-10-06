const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { protect } = require("../middleware/auth");
const {
  addToCartValidator,
  updateCartValidator,
} = require("../utils/validators");

router.use(protect);

router.get("/", cartController.getCart);
router.post("/add", addToCartValidator, cartController.addToCart);
router.post("/update", updateCartValidator, cartController.updateItemQuantity);
router.post("/remove", cartController.removeItem);
router.post("/clear", cartController.clearCart);

module.exports = router;
