import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: type === 'success' ? '#111317' : '#ef4444',
        color: '#ffffff',
        padding: '0.75rem 1.4rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.9rem',
        fontWeight: '700',
        animation: 'badgePop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      {type === 'success' ? (
        <CheckCircle2 size={18} color="var(--accent-pink)" />
      ) : (
        <AlertCircle size={18} color="#ffffff" />
      )}
      <span>{message}</span>
    </div>
  );
}
