import React from 'react';
import { Link } from 'react-router-dom';

const POLICIES = [
  {
    icon: '🔒',
    title: 'Privacy Policy',
    desc: 'How we collect, use, store, and protect your personal data when you use PageIQ.',
    href: '/privacy',
    available: true,
    updated: 'April 2025',
  },
  {
    icon: '📄',
    title: 'Terms of Service',
    desc: 'The rules and conditions that govern your use of PageIQ and our platform.',
    href: '/terms',
    available: true,
    updated: 'April 2025',
  },
  {
    icon: '🍪',
    title: 'Cookie Policy',
    desc: 'How we use cookies and similar technologies to improve your experience.',
    href: null,
    available: false,
    updated: null,
  },
];

const TRUST_POINTS = [
  { icon: '🛡️', label: 'No data selling', desc: 'We never sell or share your data with third parties for marketing.' },
  { icon: '🔐', label: 'Secure by default', desc: 'All data is encrypted in transit and at rest using industry standards.' },
  { icon: '✉️', label: 'Minimal collection', desc: 'We only collect what\'s needed to run the service — nothing more.' },
  { icon: '📬', label: 'Questions welcome', desc: 'Reach us any time at support@pageiq.app with privacy or legal queries.' },
];

export default function Legal() {
  return (
    <div className="legal-page">

      {/* ── Hero ── */}
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <div className="section-label" style={{ color: '#a5b4fc', marginBottom: 12 }}>LEGAL</div>
          <h1 className="legal-hero-headline">Legal &amp; Policies</h1>
          <p className="legal-hero-sub">
            We believe in full transparency about how PageIQ works, what data we collect,
            and how we protect your trust. Everything is written in plain English — no legal jargon.
          </p>
        </div>
      </section>

      {/* ── Policy Cards ── */}
      <section className="legal-cards-section">
        <div className="legal-cards-inner">
          <div className="legal-section-header">
            <h2 className="legal-section-title">Our policies</h2>
            <p className="legal-section-sub">Click any document to read the full policy.</p>
          </div>

          <div className="legal-cards-grid">
            {POLICIES.map((p) => (
              p.available ? (
                <Link to={p.href} key={p.title} className="legal-card legal-card--available">
                  <div className="legal-card-icon">{p.icon}</div>
                  <div className="legal-card-body">
                    <div className="legal-card-title">{p.title}</div>
                    <div className="legal-card-desc">{p.desc}</div>
                    {p.updated && (
                      <div className="legal-card-meta">Last updated: {p.updated}</div>
                    )}
                  </div>
                  <div className="legal-card-arrow">→</div>
                </Link>
              ) : (
                <div key={p.title} className="legal-card legal-card--soon">
                  <div className="legal-card-icon" style={{ opacity: 0.5 }}>{p.icon}</div>
                  <div className="legal-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div className="legal-card-title" style={{ opacity: 0.5 }}>{p.title}</div>
                      <span className="legal-coming-badge">Coming soon</span>
                    </div>
                    <div className="legal-card-desc" style={{ opacity: 0.5 }}>{p.desc}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="legal-trust-section">
        <div className="legal-trust-inner">
          <h2 className="legal-trust-title">Our commitment to you</h2>
          <p className="legal-trust-sub">
            PageIQ is built on trust. Here's our promise in plain terms.
          </p>
          <div className="legal-trust-grid">
            {TRUST_POINTS.map((t) => (
              <div key={t.label} className="legal-trust-card">
                <div className="legal-trust-icon">{t.icon}</div>
                <div className="legal-trust-label">{t.label}</div>
                <div className="legal-trust-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Strip ── */}
      <section className="legal-contact-strip">
        <div className="legal-contact-inner">
          <div className="legal-contact-text">
            <div className="legal-contact-heading">Have a legal or privacy question?</div>
            <div className="legal-contact-sub">We're happy to help — most queries are answered within 24 hours.</div>
          </div>
          <a href="mailto:support@pageiq.app" className="btn-primary">
            Email support@pageiq.app →
          </a>
        </div>
      </section>

    </div>
  );
}
