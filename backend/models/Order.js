const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    items: [orderItemSchema],
    shipping: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
    },
    payment: {
      method: {
        type: String,
        enum: ["cod", "stripe", "sslcommerz"],
        default: "cod",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      details: { type: mongoose.Schema.Types.Mixed },
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },
    cancelledAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true },
);

orderSchema.methods.markAs = async function (status) {
  this.status = status;
  if (status === "Cancelled") this.cancelledAt = new Date();
  if (status === "Delivered") this.deliveredAt = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model("Order", orderSchema);
