import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Star, Check } from 'lucide-react';

export default function DishDetailModal({ dish, onClose, onAddToCart }) {
  if (!dish) return null;

  const [portion, setPortion] = useState('regular');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const availableAddons = [
    { id: 'avocado', name: 'Fresh Hass Avocado Fan', price: 60 },
    { id: 'tofu', name: 'Fire-Seared Organic Tofu', price: 70 },
    { id: 'egg', name: 'Pasture-Raised Poached Egg', price: 40 },
    { id: 'chili', name: 'Artisan Chili Crunch Glaze', price: 30 }
  ];

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const portionPriceDelta = portion === 'feast' ? 80 : 0;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = availableAddons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const unitPrice = dish.price + portionPriceDelta + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      ...dish,
      id: `${dish.id}-${Date.now()}`,
      name: `${dish.name} (${portion === 'feast' ? 'Feast Size' : 'Regular'})`,
      price: unitPrice,
      customizations: {
        portion,
        spiceLevel,
        addons: selectedAddons
      }
    }, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button onClick={onClose} className="modal-close-corner" aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Plate Image Showcase */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={dish.image}
              alt={dish.name}
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.14))'
              }}
              onError={(e) => { e.target.src = dish.fallbackImage; }}
            />
          </div>

          {/* Core Info */}
          <div>
            <span className="badge-tag">{dish.category} • CHEF SIGNATURE</span>
            <h3 className="heading-display" style={{ fontSize: '1.65rem', marginTop: '0.4rem', marginBottom: '0.3rem' }}>
              {dish.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', color: '#fbbf24' }}>
                <Star size={16} fill="#fbbf24" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{dish.rating}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>({dish.reviewsCount} reviews)</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {dish.description}
            </p>
          </div>
        </div>

        {/* Nutritional Breakdown Gauge */}
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Flame size={16} color="var(--accent-pink)" />
            <span style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.04em' }}>MACRONUTRIENT BREAKDOWN</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', textAlign: 'center' }}>
            <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: '700' }}>CALORIES</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{dish.calories}</strong>
            </div>
            <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: '700' }}>PROTEIN</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-pink)' }}>{dish.macros.protein}</strong>
            </div>
            <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: '700' }}>CARBS</span>
              <strong style={{ fontSize: '1rem', color: '#0284c7' }}>{dish.macros.carbs}</strong>
            </div>
            <div style={{ background: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: '700' }}>FAT</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-green)' }}>{dish.macros.fat}</strong>
            </div>
          </div>
        </div>

        {/* Portion Selector */}
        <div className="form-group">
          <label className="form-label">Portion Size</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <button
              type="button"
              onClick={() => setPortion('regular')}
              className={`btn-secondary ${portion === 'regular' ? 'active' : ''}`}
              style={{
                borderColor: portion === 'regular' ? 'var(--accent-pink)' : undefined,
                background: portion === 'regular' ? 'var(--accent-pink-subtle)' : undefined
              }}
            >
              Regular Portion (Standard)
            </button>
            <button
              type="button"
              onClick={() => setPortion('feast')}
              className={`btn-secondary ${portion === 'feast' ? 'active' : ''}`}
              style={{
                borderColor: portion === 'feast' ? 'var(--accent-pink)' : undefined,
                background: portion === 'feast' ? 'var(--accent-pink-subtle)' : undefined
              }}
            >
              Feast Size (+ ₹80)
            </button>
          </div>
        </div>

        {/* Spice Level Selector */}
        <div className="form-group">
          <label className="form-label">Spice Intensity</label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {['Mild', 'Medium', 'Hot', 'Fiery 🔥'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpiceLevel(level)}
                className={`menu-filter-pill ${spiceLevel === level ? 'active' : ''}`}
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Add-ons */}
        <div className="form-group">
          <label className="form-label">Artisan Add-ons</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableAddons.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    background: isChecked ? '#fff1f4' : '#fafafc',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isChecked ? 'var(--accent-pink)' : 'var(--border-light)'}`,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: '600'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: '1.5px solid var(--accent-pink)',
                        background: isChecked ? 'var(--accent-pink)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>{addon.name}</span>
                  </div>
                  <span style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>+₹{addon.price}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Quantity and Final Add Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)' }}>
          <div className="cart-qty-controls" style={{ padding: '0.4rem 0.8rem' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="qty-btn"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '1rem', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="qty-btn"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem' }}
            id="modal-add-to-cart-btn"
          >
            <span>Add to Order — ₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
