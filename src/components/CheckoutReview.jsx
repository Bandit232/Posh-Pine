import React, { useMemo, useState } from 'react';

function formatPrice(price) {
  return `Tk${price.toLocaleString('en-IN')}`;
}

export default function CheckoutReview({ cart = [], totalPrice = 0, onBack, onConfirm, isSubmitting = false, errorMessage = '' }) {
  const [location, setLocation] = useState('inside');
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });
  const [formError, setFormError] = useState('');

  const deliveryFee = useMemo(() => (location === 'inside' ? 70 : 120), [location]);
  const grandTotal = useMemo(() => totalPrice + deliveryFee, [totalPrice, deliveryFee]);

  const handleChange = (field) => (event) => {
    setShipping((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleConfirm = () => {
    const missing = ['name', 'phone', 'address', 'city'].find(
      (field) => !shipping[field]?.trim()
    );
    if (missing) {
      setFormError('Please complete all customer details before confirming.');
      return;
    }
    setFormError('');
    if (onConfirm) onConfirm(location, shipping);
  };

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
          <>
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
              </div>
            </div>

            <div className="checkout-form" style={{ marginTop: 24 }}>
              <h3>Customer details</h3>
              <div className="form-grid" style={{ display: 'grid', gap: 16, marginTop: 12 }}>
                <label>
                  Name
                  <input
                    type="text"
                    value={shipping.name}
                    onChange={handleChange('name')}
                    placeholder="Full name"
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={handleChange('phone')}
                    placeholder="Phone number"
                  />
                </label>
                <label>
                  Address
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={handleChange('address')}
                    placeholder="Street, area, house no."
                  />
                </label>
                <label>
                  Location / City
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={handleChange('city')}
                    placeholder="Dhaka, Narayanganj, etc."
                  />
                </label>
              </div>
            </div>

            {(formError || errorMessage) && (
              <div className="form-error" style={{ color: 'red', marginTop: 16 }}>
                {formError || errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn" onClick={onBack}>Back</button>
              <button
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Order'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
