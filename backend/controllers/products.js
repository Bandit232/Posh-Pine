const mongoose = require('mongoose');
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const { success } = require("../utils/response");

// In-memory fallback dataset used when MongoDB isn't available (development)
const fallbackProducts = [
  {
    id: 'f1',
    name: 'Classic White Shirt',
    slug: 'classic-white-shirt',
    description: 'Premium cotton white formal shirt perfect for office wear',
    category: 'formal',
    price: 1299,
    images: ['/assets/shirt1.jpg'],
    sizes: ['M', 'L', 'XL'],
    stock: 10,
  },
  {
    id: 'f2',
    name: 'Blue Denim Shirt',
    slug: 'blue-denim-shirt',
    description: 'Stylish blue denim shirt for casual outings',
    category: 'casual',
    price: 1499,
    images: ['/assets/shirt2.jpg'],
    sizes: ['M', 'L', 'XL'],
    stock: 8,
  },
];

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function createProduct(req, res, next) {
  try {
    const data = req.body || {};
    // handle uploaded images
    if (req.files && req.files.length) {
      data.images = (req.files || []).map((f) => ({
        url: `/uploads/${path.basename(f.path)}`,
        alt: f.originalname,
      }));
    }
    if (!isDbConnected()) {
      const id = `f${Date.now()}`;
      const product = Object.assign({ id }, data);
      fallbackProducts.push(product);
      return success(res, { product }, 'Product created (in-memory)', 201);
    }
    const product = await Product.create(data);
    return success(res, { product }, "Product created", 201);
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
    const skip = (page - 1) * limit;

    if (!isDbConnected()) {
      // simple in-memory filtering/pagination
      let items = fallbackProducts.slice();
      if (req.query.q) {
        const q = req.query.q.toLowerCase();
        items = items.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      const total = items.length;
      items = items.slice(skip, skip + limit);
      return success(res, { items, total, page, limit }, 'Products (in-memory)');
    }

    // Attempt DB query but fall back to in-memory if Mongoose buffers/throws
    try {
      const filter = {};
    if (req.query.q) filter.$text = { $search: req.query.q };
    if (req.query.minPrice)
      filter.price = {
        ...(filter.price || {}),
        $gte: Number(req.query.minPrice),
      };
    if (req.query.maxPrice)
      filter.price = {
        ...(filter.price || {}),
        $lte: Number(req.query.maxPrice),
      };
    if (req.query.featured) filter.featured = req.query.featured === "true";

    let query = Product.find(filter).skip(skip).limit(limit);
    if (req.query.sort) {
      const sort = req.query.sort.split(",").join(" ");
      query = query.sort(sort);
    }

    const [items, total] = await Promise.all([
      query.exec(),
      Product.countDocuments(filter),
    ]);
    return success(res, { items, total, page, limit }, "Products");
    } catch (dbErr) {
      console.warn('Products DB query failed, falling back to in-memory:', dbErr.message);
      let items = fallbackProducts.slice();
      if (req.query.q) {
        const q = req.query.q.toLowerCase();
        items = items.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      const total = items.length;
      items = items.slice(skip, skip + limit);
      return success(res, { items, total, page, limit }, 'Products (in-memory)');
    }
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const product = fallbackProducts.find((p) => p.id === id || p.slug === id);
      if (!product) {
        res.status(404);
        return next(new Error('Product not found (in-memory)'));
      }
      return success(res, { product }, 'Product (in-memory)');
    }

    const { id: pid } = req.params;
    try {
      let product = null;
      if (pid.match(/^[0-9a-fA-F]{24}$/)) product = await Product.findById(pid);
      if (!product) product = await Product.findOne({ slug: pid });
      if (!product) {
        res.status(404);
        return next(new Error("Product not found"));
      }
      return success(res, { product }, "Product");
    } catch (dbErr) {
      console.warn('Product DB query failed, falling back to in-memory:', dbErr.message);
      const product = fallbackProducts.find((p) => p.id === pid || p.slug === pid);
      if (!product) {
        res.status(404);
        return next(new Error('Product not found (in-memory)'));
      }
      return success(res, { product }, 'Product (in-memory)');
    }
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = fallbackProducts.findIndex((p) => p.id === id || p.slug === id);
      if (idx === -1) {
        res.status(404);
        return next(new Error('Product not found (in-memory)'));
      }
      const updated = Object.assign({}, fallbackProducts[idx], req.body || {});
      if (req.files && req.files.length) {
        updated.images = (updated.images || []).concat((req.files || []).map((f) => `/uploads/${path.basename(f.path)}`));
      }
      fallbackProducts[idx] = updated;
      return success(res, { product: updated }, 'Product updated (in-memory)');
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }
    Object.assign(product, req.body || {});
    if (req.files && req.files.length) {
      const images = (req.files || []).map((f) => ({
        url: `/uploads/${path.basename(f.path)}`,
        alt: f.originalname,
      }));
      product.images = (product.images || []).concat(images);
    }
    await product.save();
    return success(res, { product }, "Product updated");
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const idx = fallbackProducts.findIndex((p) => p.id === id || p.slug === id);
      if (idx === -1) {
        res.status(404);
        return next(new Error('Product not found (in-memory)'));
      }
      fallbackProducts.splice(idx, 1);
      return success(res, null, 'Product deleted (in-memory)', 200);
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }
    // attempt to remove image files from disk
    try {
      (product.images || []).forEach((img) => {
        const p = path.join(
          process.cwd(),
          "backend",
          img.url.replace(/^\//, ""),
        );
        if (fs.existsSync(p)) fs.unlinkSync(p);
      });
    } catch (e) {
      // ignore filesystem errors
    }
    await product.remove();
    return success(res, null, "Product deleted", 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
