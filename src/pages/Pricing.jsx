import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying PageIQ or occasional audits.',
    badge: null,
    features: [
      '5 audits per month',
      'All 11 SEO skills',
      'PDF export',
      'Share report links',
      'No login required for single audits',
    ],
    missing: [
      'Audit history & dashboard',
      'Bulk URL analysis',
      'Scheduled audits',
      'Priority AI processing',
      'Email reports',
    ],
    cta: 'Start for Free',
    ctaLink: '/audit',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For SEO professionals and content teams.',
    badge: 'Most Popular',
    features: [
      '100 audits per month',
      'All 11 SEO skills',
      'PDF export',
      'Share report links',
      'Audit history & dashboard',
      'Bulk URL analysis (up to 10)',
      'Email reports',
      'Priority AI processing',
    ],
    missing: [
      'Scheduled audits',
      'White-label reports',
      'API access',
    ],
    cta: 'Get Pro',
    ctaLink: '/signup?plan=pro',
    highlight: true,
  },
  {
    key: 'agency',
    name: 'Agency',
    price: '$79',
    period: '/month',
    description: 'For agencies managing multiple client sites.',
    badge: null,
    features: [
      'Unlimited audits',
      'All 11 SEO skills',
      'PDF export',
      'Share report links',
      'Audit history & dashboard',
      'Bulk URL analysis (unlimited)',
      'Email reports',
      'Priority AI processing',
      'Scheduled audits',
      'White-label reports',
      'API access',
    ],
    missing: [],
    cta: 'Get Agency',
    ctaLink: '/signup?plan=agency',
    highlight: false,
  },
];

export default function Pricing() {
  const user = getUser();
  const navigate = useNavigate();

  return (
    <div className="pricing-page">
      {/* Header */}
      <section className="pricing-hero">
        <div className="section-label">PRICING</div>
        <h1 className="pricing-headline">Simple, Transparent Pricing</h1>
        <p className="pricing-sub">Start free. Upgrade when you need more. No hidden fees.</p>
      </section>

      {/* Plans */}
      <section className="pricing-cards">
        {PLANS.map(plan => (
          <div key={plan.key} className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`}>
            {plan.badge && <div className="pricing-badge">{plan.badge}</div>}
            <div className="pricing-plan-name">{plan.name}</div>
            <div className="pricing-price">
              <span className="pricing-amount">{plan.price}</span>
              <span className="pricing-period">{plan.period}</span>
            </div>
            <p className="pricing-desc">{plan.description}</p>

            <Link
              to={user && plan.key === 'free' ? '/audit' : plan.ctaLink}
              className={`pricing-cta ${plan.highlight ? 'pricing-cta-primary' : 'pricing-cta-ghost'}`}
            >
              {user && plan.key === user.plan ? 'Current Plan' : plan.cta}
            </Link>

            <div className="pricing-features">
              <div className="pricing-features-heading">What's included</div>
              {plan.features.map(f => (
                <div key={f} className="pricing-feature pricing-feature-yes">
                  <span className="pricing-check">✓</span> {f}
                </div>
              ))}
              {plan.missing.map(f => (
                <div key={f} className="pricing-feature pricing-feature-no">
                  <span className="pricing-cross">✗</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="pricing-faq">
        <h2 className="pricing-faq-heading">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Do I need to sign up to use PageIQ?</h3>
            <p>No. You can run a free audit without creating an account. Sign up to save your report history and unlock dashboard features.</p>
          </div>
          <div className="faq-item">
            <h3>What counts as one audit?</h3>
            <p>One audit = one URL analyzed with all 11 skills. Re-running the same URL counts as a new audit.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes. Cancel your subscription at any time. You keep access until the end of your billing period.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial for Pro?</h3>
            <p>The Free plan is your trial — try all 11 skills with no time limit. Upgrade whenever you need more audits.</p>
          </div>
          <div className="faq-item">
            <h3>What AI model powers PageIQ?</h3>
            <p>PageIQ uses Claude Haiku, a fast and highly capable AI model, optimized for speed and accuracy on SEO analysis tasks.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>Yes — if you're not satisfied within the first 7 days of a paid plan, contact us for a full refund.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <h2 className="cta-banner-heading">Start Auditing for Free Today</h2>
        <p className="cta-banner-sub">No credit card required. Get your first report in 30 seconds.</p>
        <div className="cta-banner-btns">
          <Link to="/audit" className="cta-banner-primary">Start Free Audit →</Link>
          <Link to="/signup" className="cta-banner-ghost">Create Account</Link>
        </div>
      </section>
    </div>
  );
}
