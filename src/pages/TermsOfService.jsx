import React from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'April 2025';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    content: `By accessing or using PageIQ ("the Service") at pageiq.app, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all visitors, users, and anyone who accesses the Service.`,
  },
  {
    id: 'service',
    title: '2. Description of service',
    content: `PageIQ provides AI-powered SEO audit tools for websites, including on-page analysis, technical SEO checks, and actionable recommendations. The Service is offered on a freemium basis with paid plans providing additional features, higher usage limits, and priority support.`,
  },
  {
    id: 'accounts',
    title: '3. Accounts',
    items: [
      { label: 'Eligibility', text: 'You must be at least 18 years old and capable of forming a legally binding contract to use the Service.' },
      { label: 'Accuracy', text: 'You agree to provide accurate, current, and complete information during registration.' },
      { label: 'Security', text: 'You are responsible for maintaining the confidentiality of your password and for all activity under your account.' },
      { label: 'One account', text: 'You may not create multiple accounts to circumvent plan limits or access restrictions.' },
    ],
  },
  {
    id: 'plans',
    title: '4. Plans, billing, and payment',
    items: [
      { label: 'Free plan', text: 'Available with limited audits and features. No credit card required.' },
      { label: 'Paid plans', text: 'Billed monthly or annually. All prices are listed on the Pricing page in USD.' },
      { label: 'Payment', text: 'Processed securely by Stripe. By subscribing, you authorise recurring charges.' },
      { label: 'Cancellation', text: 'You may cancel at any time from your account dashboard. Access continues until the end of the billing period.' },
      { label: 'Refunds', text: 'We offer a 7-day money-back guarantee on first-time paid subscriptions. Contact support@pageiq.app to request a refund.' },
      { label: 'Price changes', text: 'We may change pricing with 30 days\' notice to existing subscribers.' },
    ],
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable use',
    content: `You agree not to misuse the Service. Prohibited activities include:`,
    items: [
      { label: 'Scraping', text: 'Automated scraping or bulk downloading of audit results.' },
      { label: 'Abuse', text: 'Submitting URLs to audit competitor sites at scale or for malicious purposes.' },
      { label: 'Interference', text: 'Attempting to disrupt, overload, or gain unauthorised access to our servers.' },
      { label: 'Circumvention', text: 'Bypassing plan limits, rate limits, or access controls.' },
      { label: 'Illegal use', text: 'Using the Service for any unlawful purpose or in violation of any applicable law.' },
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual property',
    content: `The Service, including its design, software, content, and branding, is owned by PageIQ and protected by intellectual property laws. You retain ownership of the URLs and content you submit for analysis. By using the Service, you grant us a limited, non-exclusive licence to process your submitted data solely for the purpose of delivering audit results to you.`,
  },
  {
    id: 'disclaimer',
    title: '7. Disclaimer of warranties',
    content: `The Service is provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee that audit results will be error-free, complete, or that acting on recommendations will improve your search rankings. SEO outcomes depend on many factors outside our control.`,
  },
  {
    id: 'liability',
    title: '8. Limitation of liability',
    content: `To the fullest extent permitted by law, PageIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you for any claim shall not exceed the amount you paid us in the 3 months preceding the claim.`,
  },
  {
    id: 'termination',
    title: '9. Termination',
    content: `We reserve the right to suspend or terminate your account at any time if you violate these Terms or engage in conduct harmful to other users, the Service, or third parties. You may delete your account at any time. Upon termination, your right to use the Service ceases immediately.`,
  },
  {
    id: 'changes',
    title: '10. Changes to these terms',
    content: `We may update these Terms from time to time. We will notify you of material changes by email or by posting a notice on the platform at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes your acceptance of the updated Terms.`,
  },
  {
    id: 'governing-law',
    title: '11. Governing law',
    content: `These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: `If you have questions about these Terms, please contact us at support@pageiq.app. We aim to respond to all legal queries within 2 business days.`,
  },
];

export default function TermsOfService() {
  return (
    <div className="policy-page">

      {/* ── Hero ── */}
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <Link to="/legal" className="policy-back">← Legal &amp; Policies</Link>
          <div className="policy-hero-icon">📄</div>
          <h1 className="policy-hero-title">Terms of Service</h1>
          <p className="policy-hero-meta">Last updated: {LAST_UPDATED}</p>
          <p className="policy-hero-sub">
            These Terms set out the rules for using PageIQ. By signing up or using our platform,
            you agree to the following. We've kept it as clear and concise as possible.
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
            </section>
          ))}

          {/* Footer nav */}
          <div className="policy-footer-nav">
            <Link to="/legal" className="btn-ghost">← Back to Legal hub</Link>
            <Link to="/privacy" className="btn-ghost">Privacy Policy →</Link>
          </div>
        </article>

      </div>
    </div>
  );
}
