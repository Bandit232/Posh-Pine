import React, { useMemo, useState } from 'react';

function formatPrice(price) {
  return `Tk${price.toLocaleString('en-IN')}`;
}

export default function CheckoutReview({ cart = [], totalPrice = 0, onBack, onConfirm }) {
  const [location, setLocation] = useState('inside');

  const deliveryFee = useMemo(() => (location === 'inside' ? 70 : 120), [location]);

  const grandTotal = useMemo(() => totalPrice + deliveryFee, [totalPrice, deliveryFee]);

  return (
    <section className="checkout-review section">
      <div className="container">
        <div className="section-head">
          <h2>Review your order</h2>
          <p>Confirm items, quantities and delivery details before placing the order.</p>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: '#777' }}>Your cart is empty.</p>
        ) : (
          <div className="receipt">
            <ul className="receipt-items">
              {cart.map((item) => (
                <li key={item.id} className="receipt-item">
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ color: '#666' }}>Size: {item.selectedSize} • Qty: {item.quantity}</div>
                  </div>
                  <div>{formatPrice(item.price * item.quantity)}</div>
                </li>
              ))}
            </ul>

            <div className="receipt-summary">
              <div className="row">
                <span>Subtotal</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <div className="row">
                <span>Delivery</span>
                <div>
                  <label style={{ marginRight: 12 }}>
                    <input
                      type="radio"
                      name="location"
                      value="inside"
                      checked={location === 'inside'}
                      onChange={() => setLocation('inside')}
                    />{' '}
                    Inside Dhaka (70 tk)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="location"
                      value="outside"
                      checked={location === 'outside'}
                      onChange={() => setLocation('outside')}
                    />{' '}
                    Outside Dhaka (120 tk)
                  </label>
                </div>
              </div>

              <div className="row total">
                <span>Total</span>
                <strong>{formatPrice(grandTotal)}</strong>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn" onClick={onBack}>Back</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                  }}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
