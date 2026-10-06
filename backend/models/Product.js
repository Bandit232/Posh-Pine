const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, index: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    brand: { type: String, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    sizes: [{ type: String, trim: true, index: true }],
    colors: [{ type: String, trim: true, index: true }],
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    // popularity metrics
    soldCount: { type: Number, default: 0, index: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Text index for search across name, brand, description
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  tags: "text",
});

// Slug generation
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual for effective price after discount
productSchema.virtual("effectivePrice").get(function () {
  if (
    this.discountPrice &&
    this.discountPrice > 0 &&
    this.discountPrice < this.price
  ) {
    return this.discountPrice;
  }
  return this.price;
});

// Instance method to reduce stock when ordering
productSchema.methods.decreaseStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  this.stock -= quantity;
  this.soldCount += quantity;
  await this.save();
  return this;
};

// Static search helper
productSchema.statics.search = function (q, filters = {}, options = {}) {
  const query = {};
  if (q) {
    query.$text = { $search: q };
  }
  if (filters.category) query.category = filters.category;
  if (filters.brand) query.brand = filters.brand;
  if (filters.size) query.sizes = filters.size;
  if (filters.color) query.colors = filters.color;
  if (filters.minPrice || filters.maxPrice) query.price = {};
  if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
  if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);

  let cursor = this.find(query);

  // sorting
  if (options.sortBy === "newest") cursor = cursor.sort({ createdAt: -1 });
  else if (options.sortBy === "price_asc") cursor = cursor.sort({ price: 1 });
  else if (options.sortBy === "price_desc") cursor = cursor.sort({ price: -1 });
  else if (options.sortBy === "popularity")
    cursor = cursor.sort({ soldCount: -1 });

  if (options.limit) cursor = cursor.limit(parseInt(options.limit, 10));
  if (options.skip) cursor = cursor.skip(parseInt(options.skip, 10));

  return cursor;
};

module.exports = mongoose.model("Product", productSchema);
