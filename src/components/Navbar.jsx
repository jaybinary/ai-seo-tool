import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { logout } from '../utils/auth'

export default function Navbar() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo — image already contains "PageIQ" text */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="PageIQ" />
        </Link>

        {/* Nav links — centered via margin: 0 auto in CSS */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/audit" className="navbar-link">Audit</Link>
          <Link to="/pricing" className="navbar-link">Pricing</Link>
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {loading ? null : user ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button
                className="navbar-avatar"
                onClick={() => setDropdownOpen(o => !o)}
                aria-label="Account menu"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-name">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="navbar-dropdown-email">{user.email}</div>
                    <span className="navbar-dropdown-plan">
                      {profile?.plan || 'free'}
                    </span>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    📊 Dashboard
                  </Link>
                  <button onClick={handleLogout}>
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/signup" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar-hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
