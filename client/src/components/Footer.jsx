import { Heart, Shield, HelpCircle, Mail, Github, Twitter, Instagram, Globe, Pill } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: '60px',
      padding: '60px 24px 120px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px'
      }}>
        {/* Brand Section */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="header-brand" style={{ marginBottom: 16 }}>
            <div className="header-logo">
              <Pill size={18} color="white" />
            </div>
            <div className="header-title-stack">
              <span className="header-title-main">MediDose</span>
              <span className="header-title-sub">Care</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Empowering your health journey with intelligent tracking and compassionate care. Designed for your well-being.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{
                color: 'var(--text-muted)',
                transition: 'var(--transition)',
                padding: 10,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12
              }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        <div style={{ display: 'flex', flex: '2 1 400px', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '80px' }}>
          <div>
            <h4 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>About</li>
              <li>Contact</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>Health Tips</li>
              <li>Medicine Info</li>
              <li>Community</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © {currentYear} MediDoseCare. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
