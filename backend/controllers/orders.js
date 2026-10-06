const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { success } = require("../utils/response");

async function createOrder(req, res, next) {
  try {
    const userId = req.user ? req.user._id : undefined;
    let {
      items,
      shipping = {},
      payment = {},
      deliveryFee = 0,
      subtotal,
      total,
    } = req.body || {};

    const requiredShippingFields = ["name", "phone", "address", "city"];
    for (const field of requiredShippingFields) {
      if (!shipping[field] || String(shipping[field]).trim() === "") {
        res.status(400);
        return next(new Error(`Shipping ${field} is required`));
      }
    }

    let usedCart = false;
    if (!items || !items.length) {
      const cart = await Cart.findOne({ user: userId });
      if (!cart || !cart.items.length) {
        res.status(400);
        return next(new Error("No items to create order"));
      }
      items = cart.items.map((it) => ({
        product: it.product,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        selectedSize: it.selectedSize,
        selectedColor: it.selectedColor,
      }));
      usedCart = true;
    }

    // validate products and adjust stock when product IDs match real backend products
    let computedSubtotal = 0;
    const stockUpdates = [];

    for (const it of items) {
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || 1);
      computedSubtotal += price * qty;

      // Only attempt to query MongoDB when the product id is a valid ObjectId
      let product = null;
      try {
        if (mongoose.isValidObjectId(it.product)) {
          product = await Product.findById(it.product);
        }
      } catch (e) {
        // ignore cast/other errors and treat as non-DB product (in-memory)
        product = null;
      }

      if (product) {
        if (product.stock != null && product.stock < qty) {
          res.status(400);
          return next(new Error(`Insufficient stock for ${product.name}`));
        }
        stockUpdates.push({ productId: product._id, qty });
      }
    }

    subtotal = subtotal != null ? Number(subtotal) : computedSubtotal;
    deliveryFee = Number(deliveryFee || 0);
    total = total != null ? Number(total) : subtotal + deliveryFee;

    const order = await Order.create({
      user: userId,
      items: items.map((it) => ({
        product: it.product,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        selectedSize: it.selectedSize,
        selectedColor: it.selectedColor,
      })),
      shipping,
      payment,
      subtotal,
      deliveryFee,
      total,
    });

    // decrement stock and increment soldCount for actual backend products only
    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(update.productId, {
        $inc: { stock: -update.qty, soldCount: update.qty },
      });
    }

    // clear cart if we used it
    if (usedCart) {
      const cart = await Cart.findOne({ user: userId });
      if (cart) await cart.clear();
    }

    return success(res, { order }, "Order created", 201);
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
      const skip = (page - 1) * limit;
      const items = await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Order.countDocuments();
      return success(res, { items, total, page, limit }, "Orders");
    }
    const items = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return success(res, { items }, "User orders");
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }
    if (
      String(order.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      return next(new Error("Not authorized to view this order"));
    }
    return success(res, { order }, "Order");
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }
    // If admin attempts to mark as Delivered, convert to Confirmed per business rule
    // but preserve deliveredAt timestamp
    if (status === "Delivered") {
      order.status = "Confirmed";
      // preserve or set deliveredAt
      if (!order.deliveredAt) order.deliveredAt = new Date();
    } else {
      // delegate other status changes to markAs to preserve existing hooks
      await order.markAs(status);
      return success(res, { order }, "Order status updated");
    }

    await order.save();
    return success(res, { order }, "Order status updated (mapped Delivered→Confirmed)");
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }
    // only owner or admin
    if (
      String(order.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      return next(new Error("Not authorized to cancel this order"));
    }
    if (order.status === "Cancelled") {
      return success(res, { order }, "Order already cancelled");
    }
    // restock items
    for (const it of order.items) {
      const qty = Number(it.quantity || 1);
      await Product.findByIdAndUpdate(it.product, {
        $inc: { stock: qty, soldCount: -qty },
      });
    }
    await order.markAs("Cancelled");
    return success(res, { order }, "Order cancelled");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
};
