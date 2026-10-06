const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

// Virtual subtotal
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
});

// Instance methods
cartSchema.methods.addItem = async function (product, opts = {}) {
  // product: { _id, name, price }
  const existing = this.items.find(
    (it) =>
      it.product.equals(product._id) &&
      it.selectedSize === opts.selectedSize &&
      it.selectedColor === opts.selectedColor,
  );
  if (existing) {
    existing.quantity += opts.quantity || 1;
  } else {
    this.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: opts.quantity || 1,
      selectedSize: opts.selectedSize,
      selectedColor: opts.selectedColor,
    });
  }
  await this.save();
  return this;
};

cartSchema.methods.updateItemQuantity = async function (
  productId,
  quantity,
  opts = {},
) {
  const idx = this.items.findIndex(
    (it) =>
      it.product.equals(productId) &&
      it.selectedSize === opts.selectedSize &&
      it.selectedColor === opts.selectedColor,
  );
  if (idx === -1) throw new Error("Item not found");
  if (quantity <= 0) {
    this.items.splice(idx, 1);
  } else {
    this.items[idx].quantity = quantity;
  }
  await this.save();
  return this;
};

cartSchema.methods.removeItem = async function (productId, opts = {}) {
  this.items = this.items.filter(
    (it) =>
      !(
        it.product.equals(productId) &&
        it.selectedSize === opts.selectedSize &&
        it.selectedColor === opts.selectedColor
      ),
  );
  await this.save();
  return this;
};

cartSchema.methods.clear = async function () {
  this.items = [];
  await this.save();
  return this;
};

module.exports = mongoose.model("Cart", cartSchema);
