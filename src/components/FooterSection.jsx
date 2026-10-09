import React from 'react';
import { Heart, MapPin, Phone, Mail, Database } from 'lucide-react';

export default function FooterSection({ onOpenReservation, isDbConnected = true }) {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand">
              Bowls<span>.</span>
            </div>
            <p className="footer-bio">
              We are on a mission to make healthy eating accessible, vibrant, and most importantly:
              unforgettably delicious for everyone.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', color: '#94a3b8' }}>
              <a href="#" style={{ color: 'inherit' }} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ color: 'inherit' }} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" style={{ color: 'inherit' }} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" style={{ color: 'inherit' }} aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#promise">Our Promise</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#promise">Partner Farmers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenReservation(); }}>Table Booking</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h4 className="footer-title">Menu</h4>
            <ul className="footer-links">
              <li><a href="#menu">Harvest Bowls</a></li>
              <li><a href="#menu">High-Protein Meals</a></li>
              <li><a href="#menu">Vegan & Gluten-Free</a></li>
              <li><a href="#menu">Artisan Wraps</a></li>
              <li><a href="#menu">Cold-Pressed Elixirs</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="footer-title">Locations & Hours</h4>
            <ul className="footer-links" style={{ gap: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                <MapPin size={18} color="var(--accent-pink)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>452 Wellness Way, Culinary District, CA 94103</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                <Phone size={16} color="var(--accent-pink)" />
                <span>+1 (800) 555-BOWL</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                <Mail size={16} color="var(--accent-pink)" />
                <span>concierge@bowls.kitchen</span>
              </li>
              <li style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.4rem' }}>
                Mon – Sun: 10:30 AM – 10:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p>© {new Date().getFullYear()} Bowls Culinary Inc. All rights reserved.</p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.4rem 0.95rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            color: '#cbd5e1'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isDbConnected ? '#10b981' : '#f59e0b',
              boxShadow: isDbConnected ? '0 0 8px #10b981' : 'none',
              display: 'inline-block'
            }} />
            <Database size={13} style={{ color: 'var(--accent-pink)' }} />
            <span>Turso DB: <strong style={{ color: '#fff' }}>{isDbConnected ? 'Live & Synced' : 'Connecting...'}</strong> (AWS ap-south-1)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="var(--accent-pink)" fill="var(--accent-pink)" />
            <span>for healthy food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
