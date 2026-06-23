import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">POSH PINE</span>
          <h1 className="vibrant-title">PORLEI POSH.</h1>
          <p>
            Poshpine is a clothing brand dedicated to delivering trendy, high-quality outfits at affordable prices. We believe style should never be compromised by cost, which is why we carefully select premium fabrics and designs that match today’s fashion trends. At Poshpine, you don’t just wear clothes you wear confidence.
          </p>

          <div className="hero-actions">
            <a href="#shop" className="btn btn-primary">Shop Now</a>
            <a href="#shop" className="btn btn-secondary">View Shop</a>
          </div>

          <div className="hero-points">
            <div>Premium finish</div>
            <div>Comfortable fit</div>
            <div>All season comfort</div>
          </div>
        </div>

        <div className="hero-card">
          <img src="/assets/photo-animation.gif" alt="Featured Posh Pine shirt animation" />
        </div>
      </div>
    </section>
  );
}
