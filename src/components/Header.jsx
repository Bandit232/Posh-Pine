import React from 'react';

export default function Header({ cartCount, onOpenCart }) {
  return (
    <header className="header">
      <div className="container nav">
        <a href="#home" className="brand">
          <img src="/assets/logo.svg" alt="Posh Pine logo" className="brand-logo" />
          <span className="brand-name">Posh Pine</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#collections">Collections</a>
          <a href="#shop">Shop</a>
          <a href="#size-chart">Size Chart</a>
          <a href="#about">About</a>
        </nav>

        <button className="cart-btn" onClick={onOpenCart}>
          Cart <span>{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
