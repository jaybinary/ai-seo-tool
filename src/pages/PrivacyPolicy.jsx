import React from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'April 2025';

const SECTIONS = [
  {
    id: 'overview',
    title: '1. Overview',
    content: `PageIQ ("we", "us", "our") operates the website pageiq.app and provides AI-powered SEO audit services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform. Please read it carefully. If you disagree with its terms, please stop using the service.`,
  },
  {
    id: 'data-collected',
    title: '2. Information we collect',
    items: [
      { label: 'Account data', text: 'Name, email address, and password when you sign up.' },
      { label: 'Profile data', text: 'Optional details like company name and job role.' },
      { label: 'Usage data', text: 'Pages visited, features used, audit history, and session duration.' },
      { label: 'URL data', text: 'The website URLs you submit for SEO audits.' },
      { label: 'Payment data', text: 'Processed securely by Stripe. We never store card details.' },
      { label: 'Communications', text: 'Messages you send us via the contact form or email.' },
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How we use your information',
    items: [
      { label: 'Provide the service', text: 'Run SEO audits, store results, and display your dashboard.' },
      { label: 'Improve PageIQ', text: 'Analyse usage patterns to improve features and performance.' },
      { label: 'Communications', text: 'Send transactional emails (audit results, invoices, security alerts).' },
      { label: 'Customer support', text: 'Respond to your queries and troubleshoot issues.' },
      { label: 'Legal compliance', text: 'Meet our obligations under applicable laws and regulations.' },
    ],
  },
  {
    id: 'sharing',
    title: '4. Sharing your data',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who help us operate the platform (e.g. Supabase for database hosting, Stripe for payments, Resend for email delivery). These providers are contractually bound to keep your data secure and use it only for the specified purpose.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    content: `We use essential cookies to keep you logged in and remember your preferences. We may use analytics cookies (e.g. basic page-view tracking) to understand how the platform is used. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though some features may not function correctly.`,
  },
  {
    id: 'data-retention',
    title: '6. Data retention',
    content: `We retain your account data for as long as your account is active. Audit results are stored for the period covered by your plan. If you delete your account, all associated personal data is permanently removed within 30 days, except where we are required to retain it for legal or financial reasons.`,
  },
  {
    id: 'security',
    title: '7. Security',
    content: `We use industry-standard security measures including TLS encryption for data in transit, encrypted database storage, and strict access controls. While we take every precaution, no method of transmission over the Internet is 100% secure. Please use a strong, unique password for your account.`,
  },
  {
    id: 'rights',
    title: '8. Your rights',
    items: [
      { label: 'Access', text: 'Request a copy of the personal data we hold about you.' },
      { label: 'Correction', text: 'Ask us to correct inaccurate or incomplete data.' },
      { label: 'Deletion', text: 'Request deletion of your account and all associated data.' },
      { label: 'Portability', text: 'Receive your data in a portable, machine-readable format.' },
      { label: 'Objection', text: 'Object to processing of your data for direct marketing.' },
    ],
    footer: 'To exercise any of these rights, email us at support@pageiq.app.',
  },
  {
    id: 'third-party',
    title: '9. Third-party links',
    content: `Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies independently.`,
  },
  {
    id: 'children',
    title: '10. Children\'s privacy',
    content: `PageIQ is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.`,
  },
  {
    id: 'changes',
    title: '11. Changes to this policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, for material changes, notify you by email or a notice on the platform.`,
  },
  {
    id: 'contact',
    title: '12. Contact us',
    content: `If you have questions or concerns about this Privacy Policy, please contact us at support@pageiq.app or via the Contact page on our website.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="policy-page">

      {/* ── Hero ── */}
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <Link to="/legal" className="policy-back">← Legal &amp; Policies</Link>
          <div className="policy-hero-icon">🔒</div>
          <h1 className="policy-hero-title">Privacy Policy</h1>
          <p className="policy-hero-meta">Last updated: {LAST_UPDATED}</p>
          <p className="policy-hero-sub">
            We believe you should know exactly what data we collect and why. This document explains
            everything in plain English — no legalese, no hidden clauses.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="policy-layout">

        {/* Sticky TOC */}
        <nav className="policy-toc">
          <div className="policy-toc-title">Contents</div>
          <ul className="policy-toc-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="policy-toc-link">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Body */}
        <article className="policy-body">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="policy-section">
              <h2 className="policy-section-title">{s.title}</h2>
              {s.content && (
                <p className="policy-text">{s.content}</p>
              )}
              {s.items && (
                <ul className="policy-item-list">
                  {s.items.map((item) => (
                    <li key={item.label} className="policy-item">
                      <span className="policy-item-label">{item.label}:</span>
                      <span className="policy-item-text"> {item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.footer && (
                <p className="policy-text policy-section-footer">{s.footer}</p>
              )}
            </section>
          ))}

          {/* Footer nav */}
          <div className="policy-footer-nav">
            <Link to="/legal" className="btn-ghost">← Back to Legal hub</Link>
            <Link to="/terms" className="btn-primary">Terms of Service →</Link>
          </div>
        </article>

      </div>
    </div>
  );
}
