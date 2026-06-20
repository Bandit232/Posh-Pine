import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/assets/logo.svg" alt="Posh Pine logo" />
          <p>Premium printed shirts and casual style essentials.</p>
        </div>

        <div className="footer-links">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#size-chart">Size Chart</a>
          <a
            href="https://www.instagram.com/poshpinee/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
