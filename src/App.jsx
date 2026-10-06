import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import SizeChart from "./components/SizeChart";
import About from "./components/About";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import CheckoutReview from "./components/CheckoutReview";
import AdminLogin from "./components/AdminLogin";
import AdminOrders from "./components/AdminOrders";

import { API_URL } from "./config";

const API_BASE = API_URL;
// Comprehensive product data with multiple images per product
// Newly added products from Photo.pdf (extracted frames)
const mockProducts = [
  {
    id: 1,
    name: "Summer coded Shirt- Style 1",
    price: 899,
    images: ["/assets/photo-frames/page-01-Im1.jpg","/assets/photo-frames/page-02-Im2.jpg","/assets/photo-frames/page-03-Im3.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 1."
  },
  {
    id: 2,
    name: "Summer coded Shirt- Style 2",
    price: 899,
    images: ["/assets/photo-frames/page-04-Im4.jpg","/assets/photo-frames/page-05-Im5.jpg","/assets/photo-frames/page-06-Im6.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 4."
  },
  
  {
    id: 3,
    name: "Summer coded Shirt- Style 3",
    price: 899,
    images: ["/assets/photo-frames/page-08-Im8.jpg","/assets/photo-frames/page-07-Im7.jpg"],
    sizes: ["M", "L", "XL"],
    category: "photo-import",
    collection: "Photo PDF Collection",
    description: "Imported image from Photo.pdf — featured item 7."
  },
  
  {
    id: 4,
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
    id: 5,
    name: "Cuban Collar - Style 1",
    price: 799,
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
    id: 6,
    name: "Cuban Collar - Style 2",
    price: 799,
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
    id: 7,
    name: "Cuban Collar - Style 3",
    price: 799,
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
    id: 9,
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
    id: 10,
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
    id: 11,
    name: "High Neck Sweater - Beige",
    price: 999,
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
    id: 12,
    name: "High Neck Sweater - Black & Charcoal Gray ",
    price: 999,
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
    id: 13,
    name: "Lacoste Formal Casual -Blue- Cotton Blend",
    price: 950,
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
    id: 14,
    name: "Lacoste Formal Casual - Pale Pink -Cotton Blend",
    price: 950,
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
    id: 15,
    name: "Flannel Check - Blue, Ash, Red",
    price: 849,
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
    id: 16,
    name: "Flannel Check Styles",
    price: 849,
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
    id: 17,
    name: "Old Money - Navy Blue & Sky Blue Stripes",
    price: 999,
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
    id: 18,
    name: "Old Money - Stripes",
    price: 999,
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
    id: 19,
    name: "Old Money Shirt - Style 1",
    price: 949,
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
    id: 20,
    name: "Old Money Shirt - Blue & Black",
    price: 949,
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
    id: 21,
    name: "Round Neck Sweater - Pale Green",
    price: 899,
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
    id: 22,
    name: "Round Neck Sweater - Gray",
    price: 899,
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
    id: 23,
    name: "Summer Casual - Bandana Print",
    price: 949,
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
    id: 24,
    name: "Summer Casual - Bandana Print 2",
    price: 949,
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
    id: 25,
    name: "Bandana Print - Style 1",
    price: 949,
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
    id: 26,
    name: "Bandana Print - Style 2",
    price: 949,
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
    id: 27,
    name: "Bandana Print - Style 3",
    price: 949,
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
  const [showCheckout, setShowCheckout] = useState(false);

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

  

  const [orderResult, setOrderResult] = useState(null);
  const [orderError, setOrderError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleConfirmOrder = async (location, shipping) => {
    if (!cart.length) return;

    const deliveryFee = location === "inside" ? 70 : 120;
    const total = totalPrice + deliveryFee;

    setIsSubmitting(true);
    setOrderError("");

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
          })),
          shipping,
          subtotal: totalPrice,
          deliveryFee,
          total,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Order submission failed");
      }

      // backend returns { success, message, data: { order } }
      setOrderResult(payload.data?.order || payload.order || null);
      setCart([]);
      setShowCheckout(false);
    } catch (error) {
      setOrderError(error.message || "Unable to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToCheckout = () => {
    setCartOpen(false);
    setShowCheckout(true);
  };

  const closeCheckout = () => setShowCheckout(false);

  const fetchAdminOrders = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        credentials: "include",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Unable to load admin orders");
      }
      setAdminOrders(payload.data?.items || []);
    } catch (error) {
      setAdminError(error.message || "Unable to load admin orders");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogin = async ({ username, password }) => {
    setAdminError("");
    setAdminLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/admin-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Admin login failed");
      }
      if (!payload.data?.user || payload.data.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      await fetchAdminOrders();
    } catch (error) {
      setAdminError(error.message || "Admin login failed");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // ignore logout errors
    }
    setIsAdminLoggedIn(false);
    setAdminOrders([]);
    setAdminError("");
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      const resp = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const payload = await resp.json();
      if (!resp.ok) throw new Error(payload.error || payload.message || "Status update failed");
      // update local orders list so UI reflects change without refresh
      setAdminOrders((prev) => prev.map((o) => (o._id === orderId ? payload.data.order : o)));
    } catch (err) {
      setAdminError(err.message || "Unable to update status");
    }
  };

  if (showAdminLogin) {
    return (
      <>
        <Header
          cartCount={totalItems}
          onOpenCart={() => setCartOpen(true)}
          onAdminClick={() => setShowAdminLogin(true)}
        />
        <main>
          <AdminLogin
            onLogin={handleAdminLogin}
            onCancel={() => setShowAdminLogin(false)}
            error={adminError}
            loading={adminLoading}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <>
        <Header
          cartCount={totalItems}
          onOpenCart={() => setCartOpen(true)}
          onAdminClick={() => setShowAdminLogin(true)}
        />
        <main>
          <AdminOrders
            orders={adminOrders}
            loading={adminLoading}
            error={adminError}
            onLogout={handleAdminLogout}
            onChangeStatus={handleChangeOrderStatus}
          />
        </main>
        <Footer />
      </>
    );
  }

  if (orderResult) {
    return (
      <>
        <div className="topbar">Order confirmed • Thank you for shopping with us</div>
        <Header cartCount={totalItems} onOpenCart={() => setCartOpen(true)} onAdminClick={() => setShowAdminLogin(true)} />
        <main>
          <section className="checkout-review section">
            <div className="container">
              <div className="section-head">
                <h2>Order Confirmed</h2>
                <p>Your order has been placed successfully. Our team will process it shortly.</p>
              </div>
              <div className="order-confirmation">
                <p>
                  <strong>Order ID:</strong> {orderResult._id}
                </p>
                <p>
                  <strong>Name:</strong> {orderResult.shipping.name}
                </p>
                <p>
                  <strong>Phone:</strong> {orderResult.shipping.phone}
                </p>
                <p>
                  <strong>Address:</strong> {orderResult.shipping.address}, {orderResult.shipping.city}
                </p>
                <p>
                  <strong>Total:</strong> Tk{orderResult.total}
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (showCheckout) {
    return (
      <>
        <div className="topbar">New arrivals live now • Premium printed shirts • Sizes S to XL</div>
        <Header cartCount={totalItems} onOpenCart={() => setCartOpen(true)} onAdminClick={() => setShowAdminLogin(true)} />

        <main>
          <CheckoutReview
            cart={cart}
            totalPrice={totalPrice}
            onBack={closeCheckout}
            onConfirm={handleConfirmOrder}
            isSubmitting={isSubmitting}
            errorMessage={orderError}
          />
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        New arrivals live now • Premium printed shirts • Sizes S to XL
      </div>

      <Header cartCount={totalItems} onOpenCart={() => setCartOpen(true)} onAdminClick={() => setShowAdminLogin(true)} />

      <main>
        <Hero />
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
        onProceedToCheckout={proceedToCheckout}
      />
    </>
  );
}
