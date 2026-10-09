import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  onApplyPromoCode
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = promoCode === 'TASTY20' ? 0.20 : 0;
  const discountAmount = Math.round(subtotal * discountPercent);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + estimatedTax);

  const freeDeliveryThreshold = 499;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'TASTY20') {
      onApplyPromoCode('TASTY20');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try code: TASTY20');
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={22} color="var(--accent-pink)" />
            <span>Your Order ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>
          <button onClick={onClose} className="cart-close-btn" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div style={{ background: '#f8fafc', padding: '0.8rem 1.8rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            <span>{amountToFreeDelivery === 0 ? '🎉 Free Delivery unlocked!' : `Add ₹${amountToFreeDelivery} more for Free Delivery`}</span>
            <span>{Math.round(deliveryProgress)}%</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${deliveryProgress}%`,
                background: deliveryProgress >= 100 ? 'var(--accent-green)' : 'var(--accent-pink)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '2rem 1rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#fff1f4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', color: 'var(--accent-pink)' }}>
                <ShoppingBag size={34} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>Your bowl bag is empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Discover our wholesome artisan bowls crafted fresh for your palate.
              </p>
              <a href="#menu" onClick={onClose} className="btn-primary" style={{ padding: '0.75rem 1.6rem' }}>
                Explore Menu
              </a>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-thumb"
                  onError={(e) => { e.target.src = item.fallbackImage; }}
                />

                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price">
                    ₹{(item.price * item.quantity)}
                    {item.quantity > 1 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal', marginLeft: '6px' }}>
                        (₹{item.price} each)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="cart-qty-controls">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', minWidth: '16px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="cart-item-delete"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Promo Code (TASTY20)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="form-input"
                style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem', textTransform: 'uppercase' }}
              />
              <button
                type="submit"
                className="btn-dark"
                style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                Apply
              </button>
            </form>

            {promoError && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>
                {promoError}
              </span>
            )}

            {promoCode === 'TASTY20' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '700' }}>
                <Sparkles size={14} />
                <span>20% Welcome Discount applied (-₹{discountAmount})</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: 'var(--accent-green)', fontWeight: '700' }}>
                <span>Discount (20%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--accent-green)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
            </div>

            <div className="cart-summary-line">
              <span>Estimated GST (5%)</span>
              <span>₹{estimatedTax}</span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.4rem' }}
              id="cart-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
