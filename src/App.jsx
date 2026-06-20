import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import ProductGrid from "./components/ProductGrid";
import SizeChart from "./components/SizeChart";
import About from "./components/About";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

const WHATSAPP_NUMBER = "01860265807";

// Comprehensive product data with multiple images per product
// Newly added products from Photo.pdf (extracted frames)
const mockProducts = [
  {
    id: 24,
    name: "Summer coded Shirt- Style 1",
    price: 899,
    images: ["/assets/photo-frames/page-01-Im1.jpg","/assets/photo-frames/page-02-Im2.jpg","/assets/photo-frames/page-03-Im3.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 1."
  },
  {
    id: 25,
    name: "Summer coded Shirt- Style 2",
    price: 899,
    images: ["/assets/photo-frames/page-04-Im4.jpg","/assets/photo-frames/page-05-Im5.jpg","/assets/photo-frames/page-06-Im6.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 4."
  },
  
  {
    id: 26,
    name: "Summer coded Shirt- Style 3",
    price: 899,
    images: ["/assets/photo-frames/page-07-Im7.jpg","/assets/photo-frames/page-08-Im8.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 7."
  },
  
  {
    id: 27,
    name: "Summer coded Shirt- Style 4",
    price: 899,
    images: ["/assets/photo-frames/page-09-Im9.jpg","/assets/photo-frames/page-10-Im10.jpg","/assets/photo-frames/page-11-Im11.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 9."
  },
  // Cuban Collar Half Sleeve Collection
  {
    id: 1,
    name: "Cuban Collar - Style 1",
    price: 779,
    images: [
      "/assets/collections/cuban collar half sleeve/IMG_9832.jpg",
      "/assets/collections/cuban collar half sleeve/IMG_9833.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "cuban-collar",
    collection: "Cuban Collar Half Sleeve",
    description: "Classic Cuban collar shirt with half sleeves. Perfect for tropical and casual summer wear with a timeless design."
  },
  {
    id: 2,
    name: "Cuban Collar - Style 2",
    price: 779,
    images: [
      "/assets/collections/cuban collar half sleeve/IMG_9835.jpg",
      "/assets/collections/cuban collar half sleeve/IMG_9836.jpg",
      "/assets/collections/cuban collar half sleeve/IMG_9837.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "cuban-collar",
    collection: "Cuban Collar Half Sleeve",
    description: "Contemporary Cuban collar design with enhanced comfort and breathable fabric for warm weather."
  },
  {
    id: 3,
    name: "Cuban Collar - Style 3",
    price: 779,
    images: [
      "/assets/collections/cuban collar half sleeve/IMG_9839.jpg",
      "/assets/collections/cuban collar half sleeve/IMG_9842.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "cuban-collar",
    collection: "Cuban Collar Half Sleeve",
    description: "Premium Cuban collar shirt with premium finish. Versatile piece for both casual and semi-formal occasions."
  },

  // Drop Shoulders Collection
  {
    id: 4,
    name: "Drop Shoulders - Style 1",
    price: 749,
    images: [
      "/assets/collections/Drop shoulders/IMG_3016.jpeg",
      "/assets/collections/Drop shoulders/IMG_3040.jpeg",
      "/assets/collections/Drop shoulders/IMG_3069.jpeg",
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "drop-shoulders",
    collection: "Drop Shoulders",
    description: "Modern drop shoulder design offering a relaxed, oversized fit. Perfect for casual streetwear and contemporary styling."
  },
  {
    id: 5,
    name: "Drop Shoulders - Style 2",
    price: 749,
    images: [
      "/assets/collections/Drop shoulders/IMG_3099.jpeg",
      "/assets/collections/Drop shoulders/IMG_3114.jpeg",
      "/assets/collections/Drop shoulders/IMG_3129.jpeg",
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "drop-shoulders",
    collection: "Drop Shoulders",
    description: "Comfortable drop shoulder shirt with excellent drape. Ideal for layering and creating effortless looks."
  },

  // High Neck Woolen Sweaters Collection
  {
    id: 6,
    name: "High Neck Sweater - Beige",
    price: 1299,
    images: [
      "/assets/collections/high neck woolen sweaters/IMG_9851.jpg",
      "/assets/collections/high neck woolen sweaters/IMG_9852.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "sweaters",
    collection: "High Neck Woolen Sweaters",
    description: "Premium woolen sweater with high neck design. Provides warmth and sophistication for cooler seasons."
  },
  {
    id: 7,
    name: "High Neck Sweater - Black & Charcoal Gray ",
    price: 1299,
    images: [
      "/assets/collections/high neck woolen sweaters/IMG_9854.jpg",
      "/assets/collections/high neck woolen sweaters/IMG_9855.jpg",
      "/assets/collections/high neck woolen sweaters/IMG_9856.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "sweaters",
    collection: "High Neck Woolen Sweaters",
    description: "Elegant high neck woolen sweater. A timeless piece for winter wardrobes with superior comfort."
  },

  // Lacoste Formal Casual Collection
  {
    id: 8,
    name: "Lacoste Formal Casual - Style 1",
    price: 999,
    images: [
      "/assets/collections/Lecoste formal casual/1dbc968d-e9e1-4967-bddc-8dcaab073397.JPG",
      "/assets/collections/Lecoste formal casual/2d5fd1be-d46f-4514-affd-704af183d434.JPG",
      "/assets/collections/Lecoste formal casual/97ca3dc4-3716-4692-b281-93195665663e.JPG",
    ],
    sizes: ["M", "L", "XL"],
    category: "formal-casual",
    collection: "Lacoste Formal Casual",
    description: "Stylish Lacoste-inspired formal casual shirt. Perfect for business casual environments and upscale social events."
  },
  {
    id: 9,
    name: "Lacoste Formal Casual - Pale Pink",
    price: 999,
    images: [
      "/assets/collections/Lecoste formal casual/a242574b-2db5-4251-acce-fe3d792e2c5d.JPG",
    ],
    sizes: ["M", "L", "XL"],
    category: "formal-casual",
    collection: "Lacoste Formal Casual",
    description: "Premium quality formal casual piece. Versatile enough for office wear and weekend outings."
  },

  // Mens Flannel Check Shirts Collection
  {
    id: 10,
    name: "Flannel Check - Blue, Ash, Red",
    price: 1499,
    images: [
      "/assets/collections/Mens Flannel check shirts/IMG_9846.jpg",
      "/assets/collections/Mens Flannel check shirts/IMG_9847.jpg",
      "/assets/collections/Mens Flannel check shirts/IMG_9848.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "flannel",
    collection: "Mens Flannel Check Shirts",
    description: "Classic red flannel check shirt. Perfect for outdoor activities and casual everyday wear."
  },
  {
    id: 11,
    name: "Flannel Check Styles",
    price: 1499,
    images: [
      "/assets/collections/Mens Flannel check shirts/IMG_9849.jpg",
      "/assets/collections/Mens Flannel check shirts/IMG_9850.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "flannel",
    collection: "Mens Flannel Check Shirts",
    description: "Comfortable blue flannel check shirt. A wardrobe staple with timeless appeal and excellent quality."
  },

  // Old Money Collection
  {
    id: 12,
    name: "Old Money - Navy Blue & Sky Blue",
    price: 1699,
    images: [
      "/assets/collections/Old Money /navy blue cotton old money .JPG",
      "/assets/collections/Old Money /sky blue old money pure cotton.jpeg",
    ],
    sizes: ["M", "L", "XL"],
    category: "old-money",
    collection: "Old Money",
    description: "Old Money style shirt made from pure cotton. Exudes sophistication and timeless elegance."
  },
  {
    id: 13,
    name: "Old Money - Stripes",
    price: 1699,
    images: [
      "/assets/collections/Old Money /red white stripes old money.JPG",
      "/assets/collections/Old Money /white stripes in black old money.jpeg",
    ],
    sizes: ["M", "L", "XL"],
    category: "old-money",
    collection: "Old Money",
    description: "Elegant striped Old Money design. Perfect for creating preppy, affluent-inspired looks."
  },

  // Old Money Shirts Collection
  {
    id: 14,
    name: "Old Money Shirt - Style 1",
    price: 1699,
    images: [
      "/assets/collections/Old money shirts/IMG_9844.jpg",
      "/assets/collections/Old money shirts/IMG_9861.jpg",
      "/assets/collections/Old money shirts/IMG_9862.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "old-money",
    collection: "Old Money Shirts",
    description: "Premium Old Money shirt collection. Features classic designs with modern comfort and quality."
  },
  {
    id: 15,
    name: "Old Money Shirt - Blue & Black",
    price: 1699,
    images: [
      "/assets/collections/Old money shirts/IMG_9863.jpg",
      "/assets/collections/Old money shirts/IMG_9864.jpg",
      "/assets/collections/Old money shirts/IMG_9865.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "old-money",
    collection: "Old Money Shirts",
    description: "Sophisticated Old Money style shirt. Ideal for formal occasions and professional settings."
  },
  
  // Round Neck Woolen Sweaters Collection
  {
    id: 17,
    name: "Round Neck Sweater - Pale Green",
    price: 2199,
    images: [
      "/assets/collections/Round neck woolen sweaters/IMG_9857.jpg",
      "/assets/collections/Round neck woolen sweaters/IMG_9858.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "sweaters",
    collection: "Round Neck Woolen Sweaters",
    description: "Soft pale green woolen sweater with round neck design. Perfect for layering and creating cozy, comfortable looks."
  },
  {
    id: 18,
    name: "Round Neck Sweater - Gray",
    price: 2199,
    images: [
      "/assets/collections/Round neck woolen sweaters/IMG_9860.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "sweaters",
    collection: "Round Neck Woolen Sweaters",
    description: "Classic gray woolen round neck sweater. A versatile piece that works with any wardrobe."
  },

  // Summer Friendly Casual Shirts Collection
  {
    id: 19,
    name: "Summer Casual - Bandana Print",
    price: 1299,
    images: [
      "/assets/collections/summer frindly casual shirts/IMG_9826.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9827.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9828.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "summer",
    collection: "Summer Friendly Casual Shirts",
    description: "Lightweight summer casual shirt perfect for warm weather. Breathable fabric keeps you cool and comfortable."
  },
  {
    id: 20,
    name: "Summer Casual - Bandana Print 2",
    price: 1299,
    images: [
      "/assets/collections/summer frindly casual shirts/IMG_9830.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9831.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "summer",
    collection: "Summer Friendly Casual Shirts",
    description: "Vibrant summer casual shirt with premium comfort. Ideal for vacations, casual outings, and outdoor activities."
  },

  // Bandana Print Shirts Collection
  {
    id: 21,
    name: "Bandana Print - Style 1",
    price: 1299,
    images: [
      "/assets/collections/summer frindly casual shirts/IMG_9826.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9827.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9828.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "bandana-print",
    collection: "Bandana Print Shirts",
    description: "Stylish bandana print shirt with vibrant patterns. Perfect for casual outings, summer events, and making a bold fashion statement."
  },
  {
    id: 22,
    name: "Bandana Print - Style 2",
    price: 1299,
    images: [
      "/assets/collections/summer frindly casual shirts/IMG_9829.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9830.jpg",
      "/assets/collections/summer frindly casual shirts/IMG_9831.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "bandana-print",
    collection: "Bandana Print Shirts",
    description: "Premium bandana design with comfortable fit. Ideal for warm weather and adds character to any casual wardrobe."
  },
  {
    id: 23,
    name: "Bandana Print - Style 3",
    price: 1299,
    images: [
      "/assets/collections/summer frindly casual shirts/IMG_9866.jpg",
    ],
    sizes: ["M", "L", "XL"],
    category: "bandana-print",
    collection: "Bandana Print Shirts",
    description: "Classic bandana print shirt with versatile appeal. Great for layering and creating effortless summer looks."
  },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Use the comprehensive collection products directly
    setProducts(mockProducts);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: product.sizes[0] }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateSize = (id, size) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedSize: size } : item
      )
    );
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  

  const handleWhatsAppCheckout = () => {
    if (!cart.length) return;

    const lines = cart.map(
      (item) =>
        `• ${item.name} | Size: ${item.selectedSize} | Qty: ${item.quantity} | Tk${item.price * item.quantity}`
    );

    const message = `Hello Posh Pine, I want to order:\n\n${lines.join(
      "\n"
    )}\n\nTotal: Tk${totalPrice}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="topbar">
        New arrivals live now • Premium printed shirts • Sizes S to XL
      </div>

      <Header cartCount={totalItems} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero />
        <Collections />
        <ProductGrid products={products} onAddToCart={addToCart} />
        <SizeChart />
        <About />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        updateSize={updateSize}
        totalPrice={totalPrice}
        onCheckout={handleWhatsAppCheckout}
      />
    </>
  );
}
