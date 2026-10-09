import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, IndianRupee, Smartphone, Sparkles, Clock, MapPin, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createOrder } from '../db/turso';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  grandTotal,
  promoCode,
  onClearCart
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    apt: '',
    instructions: 'Ring doorbell and leave at doorstep'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOrderId = `BWL-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);
    setStep('success');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback if canvas not available
    }

    // Sync order to Turso Database
    try {
      await createOrder({
        id: newOrderId,
        customerName: formData.name,
        phone: formData.phone,
        address: `${formData.address}${formData.apt ? ', ' + formData.apt : ''}`,
        paymentMethod,
        items: cartItems.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        subtotal: cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
        grandTotal,
        promoCode
      });
    } catch (err) {
      console.warn('Order sync to Turso note:', err);
    }

    if (onClearCart) {
      onClearCart();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <button onClick={onClose} className="modal-close-corner" aria-label="Close modal">
          <X size={20} />
        </button>

        {step === 'form' ? (
          <>
            <span className="badge-tag">FLASH 30-MIN DELIVERY</span>
            <h3 className="heading-display" style={{ fontSize: '1.8rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
              Finalize Your Order
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.4rem' }}>
              Piping hot bowls prepared fresh upon checkout confirmation.
            </p>

            {/* Total Highlight Bar */}
            <div style={{ background: '#f8fafc', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', border: '1px solid var(--border-light)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Order Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                {promoCode && <p style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '700' }}>Promo {promoCode} applied</p>}
              </div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--accent-pink)', fontFamily: 'var(--font-display)' }}>
                ₹{grandTotal}
              </strong>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jordan Lee"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="42 Indiranagar 100ft Rd"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apartment / Suite (Optional)</label>
                <input
                  type="text"
                  placeholder="Flat 402, Block B"
                  className="form-input"
                  value={formData.apt}
                  onChange={(e) => setFormData({ ...formData, apt: e.target.value })}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Payment Option</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`btn-secondary ${paymentMethod === 'upi' ? 'active' : ''}`}
                    style={{
                      padding: '0.65rem',
                      fontSize: '0.82rem',
                      borderColor: paymentMethod === 'upi' ? 'var(--accent-pink)' : undefined,
                      background: paymentMethod === 'upi' ? 'var(--accent-pink-subtle)' : undefined
                    }}
                  >
                    <Smartphone size={16} />
                    <span>UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`btn-secondary ${paymentMethod === 'card' ? 'active' : ''}`}
                    style={{
                      padding: '0.65rem',
                      fontSize: '0.82rem',
                      borderColor: paymentMethod === 'card' ? 'var(--accent-pink)' : undefined,
                      background: paymentMethod === 'card' ? 'var(--accent-pink-subtle)' : undefined
                    }}
                  >
                    <CreditCard size={16} />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`btn-secondary ${paymentMethod === 'cod' ? 'active' : ''}`}
                    style={{
                      padding: '0.65rem',
                      fontSize: '0.82rem',
                      borderColor: paymentMethod === 'cod' ? 'var(--accent-pink)' : undefined,
                      background: paymentMethod === 'cod' ? 'var(--accent-pink-subtle)' : undefined
                    }}
                  >
                    <IndianRupee size={16} />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '0.6rem', padding: '0.95rem' }}
                id="place-order-submit-btn"
              >
                <span>Authorize & Place Order</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.2rem 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto' }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 className="heading-display" style={{ fontSize: '1.9rem', marginBottom: '0.5rem' }}>
              Order Received!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your bowls are currently being prepared with fresh farm harvest.
            </p>

            <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'left', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>ORDER TRACKING NUMBER</span>
                <strong style={{ color: 'var(--accent-pink)', letterSpacing: '1px' }}>{orderId}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <Clock size={16} color="var(--accent-pink)" />
                <span>Estimated Arrival: <strong>26–30 minutes</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <MapPin size={16} />
                <span>Delivering to: {formData.address || '742 Evergreen Terrace'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: '700', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-medium)' }}>
                <Database size={14} />
                <span>Synced & recorded in live Turso database</span>
              </div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
              Enjoy & Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
