import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Useful Links',
    links: [
      { label: 'Free Audit', to: '/audit' },
      { label: 'Pricing',    to: '/pricing' },
      { label: 'Sign Up',    to: '/signup' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   to: '/about' },
      { label: 'Blog',    to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Legal Hub',        to: '/legal' },
      { label: 'Privacy Policy',   to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

// Mobile accordion section
function FooterAccordion({ heading, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="footer-accordion">
      <button
        className="footer-accordion-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{heading}</span>
        <span className={`footer-accordion-icon ${open ? 'open' : ''}`}>›</span>
      </button>
      {open && (
        <div className="footer-accordion-links">
          {links.map(({ label, to }) => (
            <Link key={to} to={to} className="footer-link">{label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Desktop layout ── */}
      <div className="footer-desktop">
        {/* Brand strip */}
        <div className="footer-brand-row">
          <Link to="/" className="footer-logo-text">PageIQ</Link>
          <p className="footer-tagline">AI-powered SEO intelligence for the modern web.</p>
          <div className="footer-badges">
            <span className="footer-badge">11 AI Skills</span>
            <span className="footer-badge">E-E-A-T Analysis</span>
            <span className="footer-badge">Schema Generator</span>
          </div>
        </div>

        {/* Link columns — horizontal, compact */}
        <div className="footer-cols-row">
          {COLUMNS.map(({ heading, links }) => (
            <div key={heading} className="footer-col">
              <h4 className="footer-col-heading">{heading}</h4>
              {links.map(({ label, to }) => (
                <Link key={to} to={to} className="footer-link">{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile layout (accordion) ── */}
      <div className="footer-mobile">
        <Link to="/" className="footer-logo-text" style={{ display: 'block', marginBottom: 6 }}>PageIQ</Link>
        <p className="footer-tagline" style={{ marginBottom: 20 }}>AI-powered SEO intelligence for the modern web.</p>
        {COLUMNS.map(col => (
          <FooterAccordion key={col.heading} heading={col.heading} links={col.links} />
        ))}
      </div>

      {/* ── Bottom bar (shared) ── */}
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
