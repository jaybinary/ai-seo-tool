import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { logout } from '../utils/auth.js';

export default function Navbar() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="PageIQ" onError={e => e.target.style.display = 'none'} />
          <span>PageIQ</span>
        </Link>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/audit" onClick={() => setMenuOpen(false)}>Audit</Link>
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>

          {!loading && (
            profile ? (
              <div className="navbar-user" ref={dropdownRef}>
                <button
                  className="navbar-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {initials}
                </button>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <div className="navbar-dropdown-name">{profile.full_name || 'User'}</div>
                      <div className="navbar-dropdown-email">{profile.email}</div>
                      <span className="navbar-dropdown-plan">{profile.plan || 'free'}</span>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout}>Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/signup" className="btn-primary">Get started</Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
