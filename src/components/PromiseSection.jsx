import React, { useState } from 'react';
import { Leaf, Zap, Award, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

export default function PromiseSection({ onOpenStoryModal }) {
  const [farmersModalOpen, setFarmersModalOpen] = useState(false);

  return (
    <section className="section-wrapper promise-section" id="promise">
      <div className="container">
        {/* Centered Section Header */}
        <div className="section-header-centered">
          <span className="badge-tag" style={{ background: '#fff1f4', color: '#ff2a5f' }}>
            OUR PROMISE
          </span>
          <h2 className="section-title">
            We don't just cook.{' '}
            <span className="text-gradient-pink">We craft experiences.</span>
          </h2>
          <p className="section-subtitle">
            Every bowl is a celebration of vibrant colors, nutrient-dense ingredients, and mindful culinary craftsmanship.
          </p>
        </div>

        {/* 2 Iconic Cards from Reference Video */}
        <div className="promise-cards-grid">
          {/* Card 1: Farm-to-Table */}
          <div className="promise-card card-fresh">
            <div>
              <div className="promise-icon-pill green">
                <Leaf size={28} />
              </div>
              <h3 className="promise-card-title" style={{ marginTop: '1.2rem' }}>
                Farm-to-Table Freshness
              </h3>
              <p className="promise-card-desc">
                We partner directly with local regenerative farms to ensure that every single vegetable
                in your bowl was harvested less than 24 hours ago. Crisp textures, vibrant natural vitamins,
                and zero cold-storage delays.
              </p>
            </div>
            <div>
              <button
                onClick={() => setFarmersModalOpen(true)}
                className="promise-link"
                id="meet-farmers-link"
              >
                <span>Meet our partner farmers</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <img
              src="/images/basil_leaf.png"
              alt="Leaf decoration"
              className="promise-bg-art"
            />
          </div>

          {/* Card 2: Flash Delivery */}
          <div className="promise-card card-delivery">
            <div>
              <div className="promise-icon-pill pink">
                <Zap size={28} />
              </div>
              <h3 className="promise-card-title" style={{ marginTop: '1.2rem' }}>
                Flash 30-Min Delivery
              </h3>
              <p className="promise-card-desc">
                Hunger doesn't wait, and neither should you. Our custom thermal-pressured packaging preserves
                piping-hot steam and crunchy textures, backed by our guaranteed 30-minute doorstep promise.
              </p>
            </div>
            <div>
              <a href="#menu" className="promise-link">
                <span>Browse hot menu selection</span>
                <ArrowRight size={16} />
              </a>
            </div>
            <img
              src="/images/cherry_tomato.png"
              alt="Tomato decoration"
              className="promise-bg-art"
            />
          </div>
        </div>

        {/* Culinary Heritage Banner */}
        <div className="story-banner">
          <div>
            <span className="badge-tag" style={{ background: '#ecfdf5', color: '#10b981' }}>
              REGENERATIVE AGRICULTURE
            </span>
            <h3 className="heading-display" style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', marginTop: '0.8rem', marginBottom: '1rem' }}>
              Zero compromise on nutrition, flavor, and planet health.
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.98rem' }}>
              From cold-pressed extra virgin olive oil to non-GMO heirloom grains, we refuse shortcuts.
              Our kitchen operates 100% free of artificial seed oils, preservatives, and processed sugars.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ borderLeft: '3px solid var(--accent-pink)', paddingLeft: '0.8rem' }}>
                <h4 style={{ fontSize: '1.4rem', fontWeight: '800' }}>100%</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Organic Produce</p>
              </div>
              <div style={{ borderLeft: '3px solid var(--accent-green)', paddingLeft: '0.8rem' }}>
                <h4 style={{ fontSize: '1.4rem', fontWeight: '800' }}>15+</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Local Partner Farms</p>
              </div>
              <div style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '0.8rem' }}>
                <h4 style={{ fontSize: '1.4rem', fontWeight: '800' }}>0g</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Seed Oils Used</p>
              </div>
            </div>

            <a href="#menu" className="btn-dark">
              <span>Taste the Freshness</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="/images/farm_harvest.jpg"
              alt="Fresh heirloom farm harvest"
              className="story-image"
              loading="lazy"
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-15px',
                right: '20px',
                background: '#ffffff',
                padding: '0.8rem 1.4rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}
            >
              <ShieldCheck size={26} color="var(--accent-green)" />
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: '800' }}>Certified Organic</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily Quality Tested</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Farmers Modal */}
      {farmersModalOpen && (
        <div className="modal-overlay" onClick={() => setFarmersModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFarmersModalOpen(false)}
              className="modal-close-corner"
              aria-label="Close modal"
            >
              ✕
            </button>
            <span className="badge-tag">LOCAL ALLIANCES</span>
            <h3 className="heading-display" style={{ fontSize: '1.8rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Meet Our Organic Agricultural Partners
            </h3>
            <img
              src="/images/farm_harvest.jpg"
              alt="Harvest table"
              style={{ borderRadius: 'var(--radius-md)', marginBottom: '1.2rem', maxHeight: '240px', objectFit: 'cover', width: '100%' }}
            />
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              We collaborate exclusively with certified organic family growers located within 50 miles of our kitchen.
              Our soil partners use biodynamic composting and crop rotation to nurture nutrient-dense greens, heirloom tomatoes, and crisp herbs without synthetic pesticides.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setFarmersModalOpen(false)} className="btn-primary">
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
