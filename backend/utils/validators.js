const { check, validationResult } = require("express-validator");
const { validationErrors } = require("./response");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationErrors(res, errors.array());
  next();
};

const registerValidator = [
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  runValidation,
];

const loginValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  runValidation,
];

const adminLoginValidator = [
  check("username").trim().notEmpty().withMessage("Username is required"),
  check("password").notEmpty().withMessage("Password is required"),
  runValidation,
];

const productCreateValidator = [
  check("title").trim().notEmpty().withMessage("Title is required"),
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  check("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  runValidation,
];

const addToCartValidator = [
  check("productId").notEmpty().withMessage("productId is required"),
  check("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("selectedSize").optional().trim(),
  check("selectedColor").optional().trim(),
  runValidation,
];

const updateCartValidator = [
  check("productId").notEmpty().withMessage("productId is required"),
  check("quantity").isInt({ min: 0 }).withMessage("Quantity must be >= 0"),
  runValidation,
];

const createOrderValidator = [
  check("shipping.name")
    .trim()
    .notEmpty()
    .withMessage("Shipping name is required"),
  check("shipping.phone")
    .trim()
    .notEmpty()
    .withMessage("Shipping phone is required"),
  check("shipping.address")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required"),
  check("shipping.city")
    .trim()
    .notEmpty()
    .withMessage("Shipping city is required"),
  check("subtotal")
    .isFloat({ gt: 0 })
    .withMessage("Subtotal must be a positive number"),
  check("total")
    .isFloat({ gt: 0 })
    .withMessage("Total must be a positive number"),
  check("payment.method")
    .optional()
    .isIn(["cod", "stripe", "sslcommerz"])
    .withMessage("Invalid payment method"),
  runValidation,
];

module.exports = {
  runValidation,
  registerValidator,
  loginValidator,
  adminLoginValidator,
  productCreateValidator,
  addToCartValidator,
  updateCartValidator,
  createOrderValidator,
};
