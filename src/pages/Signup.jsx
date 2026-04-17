import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signup } from '../utils/auth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = signup(name.trim(), email.trim().toLowerCase(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo-link">
          <img src="/logo.png" alt="PageIQ" className="auth-logo-img" />
          <span className="auth-logo-fallback">PageIQ</span>
        </Link>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">
          {plan === 'pro' ? '⚡ You\'re signing up for the Pro plan.' :
           plan === 'agency' ? '🏢 You\'re signing up for the Agency plan.' :
           'Get started free. No credit card required.'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-terms">
          By signing up you agree to our <a href="#" className="auth-switch-link">Terms</a> and <a href="#" className="auth-switch-link">Privacy Policy</a>.
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-switch-link">Log in</Link>
        </p>

        <div className="auth-divider">or</div>

        <Link to="/audit" className="auth-guest-link">Continue without account →</Link>
      </div>
    </div>
  );
}
