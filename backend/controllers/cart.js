const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { success } = require("../utils/response");

async function getCart(req, res, next) {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    await cart.populate("items.product");
    return success(res, { cart }, "Cart retrieved");
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    await cart.addItem(product, {
      quantity: Number(quantity),
      selectedSize,
      selectedColor,
    });
    await cart.populate("items.product");
    return success(res, { cart }, "Item added to cart", 201);
  } catch (err) {
    next(err);
  }
}

async function updateItemQuantity(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId, quantity, selectedSize, selectedColor } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404);
      return next(new Error("Cart not found"));
    }
    await cart.updateItemQuantity(productId, Number(quantity), {
      selectedSize,
      selectedColor,
    });
    await cart.populate("items.product");
    return success(res, { cart }, "Cart updated");
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId, selectedSize, selectedColor } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404);
      return next(new Error("Cart not found"));
    }
    await cart.removeItem(productId, { selectedSize, selectedColor });
    await cart.populate("items.product");
    return success(res, { cart }, "Item removed");
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    await cart.clear();
    return success(res, { cart }, "Cart cleared");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  clearCart,
};
