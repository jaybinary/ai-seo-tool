import React from 'react';
import { Link } from 'react-router-dom';

const NAV_PRODUCT = [
  { label: 'Free Audit',  to: '/audit' },
  { label: 'Pricing',     to: '/pricing' },
  { label: 'Dashboard',   to: '/dashboard' },
  { label: 'Sign Up',     to: '/signup' },
];

const NAV_COMPANY = [
  { label: 'About',    to: '/about' },
  { label: 'Blog',     to: '/blog' },
  { label: 'Contact',  to: '/contact' },
];

const NAV_LEGAL = [
  { label: 'Legal Hub',         to: '/legal' },
  { label: 'Privacy Policy',    to: '/privacy' },
  { label: 'Terms of Service',  to: '/terms' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand column */}
        <div className="footer-brand">
          {/* Text-only logo — no img so no duplicate */}
          <Link to="/" className="footer-logo-text">PageIQ</Link>
          <p className="footer-tagline">AI-powered SEO intelligence for the modern web.</p>
          <div className="footer-badges">
            <span className="footer-badge">11 AI Skills</span>
            <span className="footer-badge">E-E-A-T Analysis</span>
            <span className="footer-badge">Schema Generator</span>
          </div>
        </div>

        {/* Link columns */}
        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-col-heading">Product</h4>
            {NAV_PRODUCT.map(({ label, to }) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4 className="footer-col-heading">Company</h4>
            {NAV_COMPANY.map(({ label, to }) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4 className="footer-col-heading">Legal</h4>
            {NAV_LEGAL.map(({ label, to }) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PageIQ. All rights reserved.</p>
        <p>
          Powered by{' '}
          <a
            href="https://www.binaryic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-powered-link"
          >
            Binaryic
          </a>
        </p>
      </div>
    </footer>
  );
}
