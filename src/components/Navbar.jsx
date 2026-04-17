import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

// Desktop nav links (order matches user spec)
const NAV_LINKS = [
  { label: 'Home',     to: '/',        exact: true },
  { label: 'Blog',     to: '/blog',    startsWith: true },
  { label: 'Pricing',  to: '/pricing' },
  { label: 'About',    to: '/about' },
  { label: 'Contact',  to: '/contact' },
];

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate             = useNavigate();
  const location             = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
    setMenuOpen(false);
  }

  function isActive(link) {
    if (link.exact)       return location.pathname === link.to;
    if (link.startsWith)  return location.pathname.startsWith(link.to);
    return location.pathname === link.to;
  }

  const displayName  = profile?.full_name || user?.email?.split('@')[0] || '';
  const avatarLetter = displayName?.[0]?.toUpperCase() || '?';
  const plan         = profile?.plan || 'free';
  const planLabel    = plan === 'agency' ? '🏢 Agency' : plan === 'pro' ? '⚡ Pro' : '🆓 Free';

  function close() { setMenuOpen(false); }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar-logo" onClick={close}>
          <img src="/logo.png" alt="PageIQ" />
        </Link>

        {/* ── Desktop links ── */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${isActive(link) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* ── Desktop auth ── */}
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
                    <Link to="/dashboard"  onClick={close}>Dashboard</Link>
                    <Link to="/audit"      onClick={close}>New Audit</Link>
                    <Link to="/pricing"    onClick={close}>Upgrade Plan</Link>
                    <button onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-primary">Get Started Free</Link>
            </>
          )}
        </div>

        {/* ── Hamburger ── */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span><span></span><span></span>
        </button>

      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="navbar-mobile-menu">

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...mobileLink,
                ...(isActive(link) ? { color: 'var(--accent)', fontWeight: 700 } : {}),
              }}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link to="/dashboard" style={mobileLink} onClick={close}>Dashboard</Link>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

          {/* Auth */}
          {user ? (
            <>
              <Link to="/audit" style={{ ...mobileLink, color: 'var(--accent)', fontWeight: 700 }} onClick={close}>
                + New Audit
              </Link>
              <button
                onClick={handleLogout}
                style={{ ...mobileLink, background: 'none', border: 'none', textAlign: 'left', color: 'var(--red)', cursor: 'pointer' }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  style={mobileLink} onClick={close}>Log in</Link>
              <Link to="/signup" style={{ ...mobileLink, color: 'var(--accent)', fontWeight: 700 }} onClick={close}>
                Get Started Free →
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
