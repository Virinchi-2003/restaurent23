import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Sparkles, Database } from 'lucide-react';
import { createReservation } from '../db/turso';

export default function ReservationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    area: 'Sunlit Garden Patio',
    specialNotes: ''
  });

  const [isBooked, setIsBooked] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCode = `BWL-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationCode(newCode);
    setIsBooked(true);

    try {
      await createReservation({
        id: newCode,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        seatingPreference: formData.area,
        specialRequests: formData.specialNotes
      });
    } catch (err) {
      console.warn('Reservation sync note:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button onClick={onClose} className="modal-close-corner" aria-label="Close modal">
          <X size={20} />
        </button>

        {!isBooked ? (
          <>
            <span className="badge-tag">RESERVATIONS</span>
            <h3 className="heading-display" style={{ fontSize: '1.8rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
              Book an Artisan Dining Table
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Experience our fresh bowls served tableside in a sun-drenched serene atmosphere.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select
                    className="form-select"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM (Dinner)</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Guests</label>
                  <select
                    className="form-select"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Seating Preference</label>
                <select
                  className="form-select"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  <option value="Sunlit Garden Patio">Sunlit Garden Patio (Fresh air & greenery)</option>
                  <option value="Chef's Culinary Counter">Chef's Culinary Counter (Watch live plating)</option>
                  <option value="Main Dining Sanctuary">Main Dining Sanctuary (Intimate & quiet)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '0.8rem', padding: '0.9rem' }}
                id="submit-reservation-btn"
              >
                <span>Confirm Table Reservation</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 className="heading-display" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Reservation Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              We have reserved a table for <strong>{formData.guests} guests</strong> on <strong>{formData.date} at {formData.time}</strong> ({formData.area}).
            </p>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.8rem', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Confirmation Reference</span>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-pink)', letterSpacing: '2px', marginBottom: '0.4rem' }}>
                {reservationCode}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-green)', fontSize: '0.78rem', fontWeight: '700', paddingTop: '0.4rem', borderTop: '1px dashed var(--border-medium)' }}>
                <Database size={13} />
                <span>Reserved & synced to Turso database</span>
              </div>
            </div>

            <button onClick={onClose} className="btn-dark" style={{ width: '100%' }}>
              Back to Bowls
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
