import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Math CAPTCHA generator ────────────────────────────────────────────────────
function generateCaptcha() {
  const ops = ['+', '−', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a + b;
  } else if (op === '−') {
    a = Math.floor(Math.random() * 9) + 5;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 5) + 2;
    b = Math.floor(Math.random() * 4) + 2;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b}`, answer };
}

// ── Validation helpers ────────────────────────────────────────────────────────
function validate(fields, captcha, captchaAnswer) {
  const errors = {};

  if (!fields.name.trim()) {
    errors.name = 'Name is required.';
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (fields.phone && !/^[+\d\s\-().]{7,20}$/.test(fields.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
  } else if (fields.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.';
  }

  if (!captchaAnswer.trim()) {
    errors.captcha = 'Please solve the CAPTCHA.';
  } else if (parseInt(captchaAnswer, 10) !== captcha.answer) {
    errors.captcha = 'Incorrect answer. Please try again.';
  }

  return errors;
}

// ── Quick Info items ─────────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: '💼',
    label: 'Sales Inquiries',
    value: 'expert@pageiq.app',
    href: 'mailto:expert@pageiq.app',
    desc: 'Pricing, partnerships, and agency plans',
  },
  {
    icon: '🛠️',
    label: 'Support',
    value: 'support@pageiq.app',
    href: 'mailto:support@pageiq.app',
    desc: 'Technical help and account questions',
  },
  {
    icon: '⏱️',
    label: 'Response Time',
    value: 'Within 24 hours',
    href: null,
    desc: 'Mon–Fri, 9am–6pm IST',
  },
];

// ── Contact Page ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [fields, setFields]           = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [errors, setErrors]           = useState({});
  const [touched, setTouched]         = useState({});
  const [captcha, setCaptcha]         = useState(generateCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef(null);

  // Refresh CAPTCHA
  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer('');
  }

  // Inline validation on blur
  function handleBlur(field) {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validate(fields, captcha, captchaAnswer);
    setErrors(errs);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    // Clear error on change if field was already touched
    if (touched[name]) {
      const updated = { ...fields, [name]: value };
      const errs = validate(updated, captcha, captchaAnswer);
      setErrors(errs);
    }
  }

  function handleCaptchaChange(e) {
    setCaptchaAnswer(e.target.value);
    if (touched.captcha) {
      const errs = validate(fields, captcha, e.target.value);
      setErrors(errs);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Mark all fields touched
    setTouched({ name: true, email: true, phone: true, company: true, message: true, captcha: true });
    const errs = validate(fields, captcha, captchaAnswer);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/.netlify/functions/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    fields.name,
          email:   fields.email,
          phone:   fields.phone,
          company: fields.company,
          message: fields.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Something went wrong. Please email us directly at support@pageiq.app');
      }
    } catch {
      setSubmitError('Unable to send. Please email us directly at support@pageiq.app');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-success">
          <div className="contact-success-icon">✅</div>
          <h2>Message received!</h2>
          <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
          <div className="contact-success-actions">
            <button
              className="btn-ghost"
              onClick={() => { setSubmitted(false); setFields({ name: '', email: '', phone: '', company: '', message: '' }); setTouched({}); setCaptchaAnswer(''); refreshCaptcha(); }}
            >
              Send another message
            </button>
            <Link to="/audit" className="btn-primary">Run a Free Audit →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="section-label" style={{ color: '#a5b4fc', marginBottom: 12 }}>CONTACT</div>
          <h1 className="contact-hero-headline">Get in touch</h1>
          <p className="contact-hero-sub">
            Questions about PageIQ, pricing, or integrations? We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="contact-layout">

        {/* ── Form ──────────────────────────────────────────────── */}
        <div className="contact-form-wrap">
          <div className="contact-form-header">
            <h2 className="contact-form-title">Send us a message</h2>
            <p className="contact-form-sub">Fields marked <span style={{ color: 'var(--red)' }}>*</span> are required.</p>
          </div>

          <form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name + Email row */}
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">
                  Full Name <span className="contact-required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`contact-input ${errors.name && touched.name ? 'error' : ''}`}
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  autoComplete="name"
                />
                {errors.name && touched.name && (
                  <span className="contact-error">{errors.name}</span>
                )}
              </div>

              <div className="contact-field">
                <label className="contact-label">
                  Email Address <span className="contact-required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`contact-input ${errors.email && touched.email ? 'error' : ''}`}
                  placeholder="jane@company.com"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                />
                {errors.email && touched.email && (
                  <span className="contact-error">{errors.email}</span>
                )}
              </div>
            </div>

            {/* Phone + Company row */}
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">
                  Phone Number
                  <span className="contact-optional"> — optional</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`contact-input ${errors.phone && touched.phone ? 'error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={fields.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  autoComplete="tel"
                />
                {errors.phone && touched.phone && (
                  <span className="contact-error">{errors.phone}</span>
                )}
              </div>

              <div className="contact-field">
                <label className="contact-label">
                  Company
                  <span className="contact-optional"> — optional</span>
                </label>
                <input
                  type="text"
                  name="company"
                  className="contact-input"
                  placeholder="Acme Inc."
                  value={fields.company}
                  onChange={handleChange}
                  autoComplete="organization"
                />
              </div>
            </div>

            {/* Message */}
            <div className="contact-field">
              <label className="contact-label">
                Message <span className="contact-required">*</span>
              </label>
              <textarea
                name="message"
                className={`contact-textarea ${errors.message && touched.message ? 'error' : ''}`}
                placeholder="Tell us what you're working on, or ask us anything about PageIQ..."
                value={fields.message}
                onChange={handleChange}
                onBlur={() => handleBlur('message')}
                rows={5}
              />
              <div className="contact-char-count" style={{ color: fields.message.length < 20 && touched.message ? 'var(--red)' : 'var(--text-3)' }}>
                {fields.message.length} / 20 minimum
              </div>
              {errors.message && touched.message && (
                <span className="contact-error">{errors.message}</span>
              )}
            </div>

            {/* CAPTCHA */}
            <div className="contact-captcha-wrap">
              <div className="contact-captcha-label">
                <span className="contact-label">
                  Spam check <span className="contact-required">*</span>
                </span>
                <span className="contact-captcha-hint">Solve the maths below</span>
              </div>
              <div className="contact-captcha-row">
                <div className="contact-captcha-question">
                  What is <strong>{captcha.question}</strong> ?
                </div>
                <input
                  type="number"
                  className={`contact-input contact-captcha-input ${errors.captcha && touched.captcha ? 'error' : ''}`}
                  placeholder="Answer"
                  value={captchaAnswer}
                  onChange={handleCaptchaChange}
                  onBlur={() => { setTouched(t => ({ ...t, captcha: true })); handleBlur('captcha'); }}
                />
                <button
                  type="button"
                  className="contact-captcha-refresh"
                  onClick={refreshCaptcha}
                  title="Get a new question"
                >
                  ↺
                </button>
              </div>
              {errors.captcha && touched.captcha && (
                <span className="contact-error">{errors.captcha}</span>
              )}
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="contact-submit-error">{submitError}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary btn-full contact-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send Message →'}
            </button>

            <p className="contact-privacy">
              🔒 We never share your information. By submitting you agree to our{' '}
              <Link to="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.
            </p>
          </form>
        </div>

        {/* ── Quick Info Sidebar ──────────────────────────────────── */}
        <aside className="contact-sidebar">

          <div className="contact-info-card">
            <h3 className="contact-info-title">Quick contact</h3>
            <div className="contact-info-list">
              {CONTACT_INFO.map((item, i) => (
                <div key={i} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div className="contact-info-body">
                    <div className="contact-info-label">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="contact-info-value">{item.value}</a>
                    ) : (
                      <div className="contact-info-value">{item.value}</div>
                    )}
                    <div className="contact-info-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-trust-card">
            <div className="contact-trust-heading">Why teams trust PageIQ</div>
            <ul className="contact-trust-list">
              <li>✅ 11 AI-powered SEO checks in under 2 min</li>
              <li>✅ No integrations or API keys needed</li>
              <li>✅ Free tier — no credit card required</li>
              <li>✅ Built for Shopify, D2C, and agencies</li>
            </ul>
          </div>

          {/* Audit CTA */}
          <div className="contact-audit-cta">
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <h3>Run a free audit instead</h3>
            <p>Get instant AI SEO insights — no form, no wait, no sign-up needed.</p>
            <Link to="/audit" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
              Try Free Audit →
            </Link>
          </div>

        </aside>
      </div>

    </div>
  );
}
