import React from 'react';
import ImageCarousel from './ImageCarousel';

function formatPrice(price) {
  return `Tk${price.toLocaleString("en-IN")}`;
}

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <section className="section shop-section" id="shop">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">SHOP</span>
          <h2>Latest products</h2>
          <p>Browse the current Posh Pine product lineup and add your favorites to cart.</p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <ImageCarousel 
                  images={product.images} 
                  productName={product.name}
                />
              </div>
              <div className="product-body">
                <div className="product-title-row">
                  <h3>{product.name}</h3>
                  <span className="price">{formatPrice(product.price)}</span>
                </div>

                <p className="product-desc">{product.description}</p>

                <div className="meta-row">
                  <span className="meta-pill">Sizes: {product.sizes.join(", ")}</span>
                  <span className="meta-pill">{product.category}</span>
                </div>

                <div className="card-actions">
                  <button className="btn btn-primary" onClick={() => onAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
