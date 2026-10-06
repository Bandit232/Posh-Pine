const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const { protect, admin } = require("../middleware/auth");
const { array: uploadArray } = require("../middleware/upload");
const { productCreateValidator } = require("../utils/validators");

router.get("/", productsController.getProducts);
router.get("/:id", productsController.getProduct);

// Admin routes
router.post(
  "/",
  protect,
  admin,
  uploadArray("images", 8),
  productCreateValidator,
  productsController.createProduct,
);
router.put(
  "/:id",
  protect,
  admin,
  uploadArray("images", 8),
  productsController.updateProduct,
);
router.delete("/:id", protect, admin, productsController.deleteProduct);

module.exports = router;
