import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
    setMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';
  const avatarLetter = displayName?.[0]?.toUpperCase() || '?';
  const plan = profile?.plan || 'free';
  const planLabel = plan === 'agency' ? '🏢 Agency' : plan === 'pro' ? '⚡ Pro' : '🆓 Free';

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="PageIQ" />
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/blog" className={`navbar-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>Blog</Link>
          <Link to="/pricing" className={`navbar-link ${isActive('/pricing') ? 'active' : ''}`}>Pricing</Link>
          {user && (
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="navbar-auth" style={{ flexShrink: 0 }}>
          {user ? (
            <>
              <Link to="/audit" className="btn-primary" style={{ fontSize: 13, padding: '7px 14px' }}>
                + New Audit
              </Link>
              <div className="navbar-user" style={{ position: 'relative' }}>
                <button
                  className="navbar-avatar"
                  onClick={() => setMenuOpen(!menuOpen)}
                  title={displayName}
                >
                  {avatarLetter}
                </button>
                {menuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <div className="navbar-dropdown-name">{displayName}</div>
                      <div className="navbar-dropdown-email">{user.email}</div>
                      <span className="navbar-dropdown-plan">{planLabel}</span>
                    </div>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/audit" onClick={() => setMenuOpen(false)}>New Audit</Link>
                    <Link to="/pricing" onClick={() => setMenuOpen(false)}>Upgrade Plan</Link>
                    <button onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-primary">Get Started Free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--border)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4
        }}>
          <Link to="/" style={mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" style={mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/blog" style={mobileLink} onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/pricing" style={mobileLink} onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/audit" style={mobileLink} onClick={() => setMenuOpen(false)}>New Audit</Link>
              <button
                onClick={handleLogout}
                style={{ ...mobileLink, background: 'none', border: 'none', textAlign: 'left', color: 'var(--red)', cursor: 'pointer' }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={mobileLink} onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" style={{ ...mobileLink, color: 'var(--accent)', fontWeight: 700 }} onClick={() => setMenuOpen(false)}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const mobileLink = {
  display: 'block', padding: '10px 12px', borderRadius: 8,
  fontSize: 14, fontWeight: 500, color: 'var(--text-2)',
};
