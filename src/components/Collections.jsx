import React from 'react';

export default function Collections() {
  return (
    <section className="section" id="collections">
      <div className="container">
        <div className="section-head collections-head">
          <span className="eyebrow">COLLECTIONS</span>
          <h2 className="featured-title">Featured styles</h2>
          <p>
            Statement shirts designed for casual dressing, events, outings, and standout everyday looks.
          </p>
        </div>

        <div className="collections-grid">
          <div className="collection-card">
            <img src="/assets/cream-wave-shirt-1.jpg" alt="Cream Wave Shirt" />
            <div className="collection-info">
              <h3>Neutral Prints</h3>
              <p>Clean tones with modern pattern work.</p>
            </div>
          </div>

          <div className="collection-card">
            <img src="/assets/collections/summer frindly casual shirts/IMG_9826.jpg" alt="Bandana Print Shirt" />
            <div className="collection-info">
              <h3>Bandana Print Shirts</h3>
              <p>Vibrant patterns with bold casual style.</p>
            </div>
          </div>

          <div className="collection-card">
            <img src="/assets/blue-patchwork-shirt-1.jpg" alt="Blue Patchwork Shirt" />
            <div className="collection-info">
              <h3>Fresh Color Drops</h3>
              <p>Bright casual pieces with visual character.</p>
            </div>
          </div>

          <div className="collection-card">
            <img src="/assets/collections/summer frindly casual shirts/IMG_9827.jpg" alt="Summer Wear Shirt" />
            <div className="collection-info">
              <h3>Summer Wear</h3>
              <p>Lightweight and breathable styles for warm weather.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
