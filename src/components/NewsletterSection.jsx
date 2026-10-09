import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Copy, Check } from 'lucide-react';
import { subscribeNewsletter } from '../db/turso';

export default function NewsletterSection({ onApplyPromo }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    if (onApplyPromo) {
      onApplyPromo('TASTY20');
    }

    try {
      await subscribeNewsletter(email.trim().toLowerCase());
    } catch (err) {
      console.warn('Newsletter sync note:', err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('TASTY20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-card">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.05em' }}>
            <Sparkles size={16} />
            <span>SPECIAL WELCOME OFFER</span>
          </div>

          <h2 className="newsletter-title">
            Ready to taste the healthy life?
          </h2>

          <p className="newsletter-desc">
            Subscribe to our newsletter and get a <strong style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>20% discount</strong> on your first order. No spam, just yum (and veggies).
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address for discount"
                id="newsletter-email-input"
              />
              <button
                type="submit"
                className="newsletter-btn"
                aria-label="Submit newsletter subscription"
                id="newsletter-submit-btn"
              >
                <Send size={18} />
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
              <div className="promo-banner">
                <CheckCircle2 size={20} color="#ffffff" />
                <span>Success! Code <strong style={{ color: '#fff', letterSpacing: '1px' }}>TASTY20</strong> applied to your cart!</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="btn-secondary"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
              >
                {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied code!' : 'Copy Code: TASTY20'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
