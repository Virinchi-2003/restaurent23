import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenReservation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Promise', href: '#promise' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#reviews' },
  ];

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo */}
          <a href="#home" className="nav-brand" id="brand-logo">
            Bowls<span>.</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="nav-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Table Reservation Button */}
            <button
              onClick={onOpenReservation}
              className="btn-secondary"
              id="nav-reservation-btn"
              style={{ padding: '0.65rem 1.3rem', fontSize: '0.86rem' }}
            >
              <Calendar size={16} color="var(--accent-pink)" />
              <span>Book Table</span>
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={onOpenCart}
              className="nav-icon-btn"
              id="nav-cart-btn"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Order Now Pill */}
            <a
              href="#menu"
              className="btn-primary"
              id="nav-order-btn"
              style={{ padding: '0.68rem 1.4rem', fontSize: '0.88rem' }}
            >
              <span>Order Now</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-toggle"
              aria-label="Toggle mobile menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="nav-brand">Bowls<span>.</span></span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="nav-icon-btn"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="mobile-menu-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Calendar size={18} color="var(--accent-pink)" />
              <span>Book a Table</span>
            </button>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <span>Order Online Now</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
