import React, { useEffect, useState } from 'react';
import { Pill, X, Clock, Check, Bell, Volume2 } from 'lucide-react';

export default function ReminderModal({ medicine, onTake, onSnooze, onClose }) {
  const [timeLeft, setTimeLeft] = useState(30); // Auto-dismiss or something? Or just show it.

  useEffect(() => {
    // Play sound if enabled
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audio.play().catch(e => console.log('Audio playback blocked'));
    
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
  }, []);

  const [isTaking, setIsTaking] = useState(false);

  const handleTake = async () => {
    setIsTaking(true);
    await onTake();
    // No need to set isTaking to false as modal will close
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 20,
      animation: 'fadeIn 0.3s ease'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .pulse-icon { animation: pulse 2s infinite ease-in-out; }
      `}</style>
      
      <div style={{
        background: 'var(--bg-card)',
        width: '100%',
        maxWidth: 400,
        borderRadius: 32,
        padding: 32,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        textAlign: 'center',
        position: 'relative',
        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: medicine?.color ? `${medicine.color}20` : 'var(--blue-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: medicine?.color || 'var(--blue)',
        }} className="pulse-icon">
          <Pill size={40} />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
          Time for your Medicine!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
          Take <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{medicine?.name}</span> ({medicine?.dosage})
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            onClick={handleTake}
            disabled={isTaking}
            style={{
              background: 'linear-gradient(135deg, var(--green) 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              padding: '18px',
              borderRadius: 18,
              fontSize: 16,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              opacity: isTaking ? 0.7 : 1,
              boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.4)'
            }}
          >
            {isTaking ? 'Taking...' : <><Check size={20} /> I\'ve Taken It</>}
          </button>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => onSnooze(3)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                padding: '16px',
                borderRadius: 18,
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <Clock size={18} /> Remind in 3 min
            </button>
            
            <button 
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                padding: '16px',
                borderRadius: 18,
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
          <Bell size={14} />
          <span>Scheduled for {medicine?.time || 'Now'}</span>
        </div>
      </div>
    </div>
  );
}
