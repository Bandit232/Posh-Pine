const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Product data
const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    price: 1299,
    image: "/assets/shirt1.jpg",
    sizes: ["M", "L", "XL"],
    category: "formal",
    description: "Premium cotton white formal shirt perfect for office wear"
  },
  {
    id: 2,
    name: "Blue Denim Shirt",
    price: 1499,
    image: "/assets/shirt2.jpg",
    sizes: ["M", "L", "XL"],
    category: "casual",
    description: "Stylish blue denim shirt for casual outings"
  },
  {
    id: 3,
    name: "Black Formal Shirt",
    price: 1399,
    image: "/assets/shirt3.jpg",
    sizes: ["M", "L", "XL"],
    category: "formal",
    description: "Elegant black formal shirt for professional settings"
  },
  {
    id: 4,
    name: "Striped Casual Shirt",
    price: 1199,
    image: "/assets/shirt4.jpg",
    sizes: ["M", "L", "XL"],
    category: "casual",
    description: "Comfortable striped shirt for everyday wear"
  },
  {
    id: 5,
    name: "Navy Blue Blazer",
    price: 2999,
    image: "/assets/blazer1.jpg",
    sizes: ["M", "L", "XL"],
    category: "formal",
    description: "Premium navy blue blazer for formal occasions"
  },
  {
    id: 6,
    name: "Grey Chinos",
    price: 1899,
    image: "/assets/pants1.jpg",
    sizes: ["30", "32", "34", "36"],
    category: "casual",
    description: "Comfortable grey chinos for smart casual look"
  }
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Products API available at http://localhost:${PORT}/api/products`);
});