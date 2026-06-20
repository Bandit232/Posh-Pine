import React from 'react';

function formatPrice(price) {
  return `Tk${price.toLocaleString("en-IN")}`;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  updateQuantity,
  updateSize,
  totalPrice,
  onCheckout
}) {
  return (
    <>
      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ color: "#b8b8b8" }}>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.images?.[0] || item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price)} × {item.quantity}</p>

                  <select
                    value={item.selectedSize}
                    onChange={(e) => updateSize(item.id, e.target.value)}
                    className="size-select"
                  >
                    {item.sizes.map((size) => (
                      <option key={size} value={size}>
                        Size {size}
                      </option>
                    ))}
                  </select>

                  <div className="qty-row">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <p className="delivery-note" style={{ color: '#555', fontSize: '0.95rem', margin: '8px 0' }}>
            Pay the delivery charge in advance to confirm the order. In the given number: 01860265807.
          </p>
          <p className="delivery-fees" style={{ color: '#555', fontSize: '0.95rem', margin: '4px 0 12px' }}>
            Inside Dhaka 70 tk.
            <br />
            Outside Dhaka 120 tk.
          </p>
          <button className="btn btn-primary full-width" onClick={onCheckout}>
            Checkout on WhatsApp
          </button>
        </div>
      </aside>

      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose}></div>
    </>
  );
}
