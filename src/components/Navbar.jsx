import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="PageIQ" className="navbar-logo-img" />
          <span className="navbar-logo-fallback">PageIQ</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          <Link to="/pricing" className={`navbar-link ${isActive('/pricing') ? 'active' : ''}`}>Pricing</Link>
          {user && (
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="navbar-auth">
          {user ? (
            <>
              <Link to="/audit" className="btn-nav-primary">New Audit</Link>
              <div className="navbar-user-menu">
                <button className="navbar-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="navbar-avatar">{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</div>
                  <span className="navbar-user-name">{user.name || user.email}</span>
                  <span className="navbar-chevron">▾</span>
                </button>
                {menuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-email">{user.email}</div>
                    <div className="navbar-dropdown-plan">{user.plan === 'pro' ? '⚡ Pro' : user.plan === 'agency' ? '🏢 Agency' : '🆓 Free'} Plan</div>
                    <hr className="navbar-dropdown-divider" />
                    <Link to="/dashboard" className="navbar-dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/pricing" className="navbar-dropdown-item" onClick={() => setMenuOpen(false)}>Upgrade Plan</Link>
                    <hr className="navbar-dropdown-divider" />
                    <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Log in</Link>
              <Link to="/signup" className="btn-nav-primary">Get Started Free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/pricing" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/audit" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>New Audit</Link>
              <button className="navbar-mobile-link navbar-mobile-logout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="navbar-mobile-link navbar-mobile-cta" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
