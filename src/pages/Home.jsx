import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SKILLS, COLORS } from '../utils/skills';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleAnalyze(e) {
    e.preventDefault();
    let cleaned = url.trim();
    if (!cleaned) { setError('Please enter a URL'); return; }
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned;
    }
    try { new URL(cleaned); } catch { setError('Please enter a valid URL'); return; }
    setError('');
    navigate(`/audit?url=${encodeURIComponent(cleaned)}`);
  }

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          11 AI-powered SEO skills
        </div>

        <h1 className="hero-headline">
          Supercharge Your SEO with<br />
          <span className="hero-gradient">AI Intelligence</span>
        </h1>

        <p className="hero-sub">
          Audit any webpage in seconds. Get E-E-A-T scores, schema markup, query maps,
          topical clusters, and more — all powered by advanced AI.
        </p>

        <form className="hero-form" onSubmit={handleAnalyze}>
          <div className="hero-input-wrap">
            <span className="hero-input-icon">🔍</span>
            <input
              className="hero-input"
              type="text"
              placeholder="https://yourwebsite.com/page"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              autoFocus
            />
            <button className="hero-btn" type="submit">Analyze Now →</button>
          </div>
          {error && <p className="hero-input-error">{error}</p>}
          <p className="hero-input-note">Free · No login required · Results in ~30 seconds</p>
        </form>

        <div className="hero-trust">
          <span className="hero-trust-item">✅ No credit card needed</span>
          <span className="hero-trust-sep">·</span>
          <span className="hero-trust-item">✅ Instant AI analysis</span>
          <span className="hero-trust-sep">·</span>
          <span className="hero-trust-item">✅ Export PDF reports</span>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────── */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stat-item">
            <div className="stat-number">11</div>
            <div className="stat-label">SEO Skills</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">30s</div>
            <div className="stat-label">Avg Analysis Time</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">AI-Powered</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Free</div>
            <div className="stat-label">To Get Started</div>
          </div>
        </div>
      </section>

      {/* ── Skills grid ───────────────────────────────────────────────── */}
      <section className="skills-section">
        <div className="section-label" style={{ textAlign: 'center' }}>WHAT WE ANALYZE</div>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>11 Comprehensive SEO Skills</h2>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
          Every audit runs all 11 skills in parallel — no cherry-picking, no guesswork.
        </p>

        <div className="skills-grid">
          {SKILLS.map(skill => (
            <div key={skill.key} className="skill-card" style={{ '--skill-color': COLORS[skill.key] }}>
              <div className="skill-card-icon">{skill.icon}</div>
              <div className="skill-card-name">{skill.name}</div>
              <div className="skill-card-desc">{skill.desc}</div>
              <div className="skill-card-bar"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="how-section">
        <div className="section-label">HOW IT WORKS</div>
        <h2 className="section-heading">Three Steps to SEO Clarity</h2>

        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">🔗</div>
            <h3 className="step-title">Paste Your URL</h3>
            <p className="step-desc">Enter any webpage URL — a blog post, product page, landing page, or your homepage.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">⚡</div>
            <h3 className="step-title">AI Runs 11 Audits</h3>
            <p className="step-desc">Our AI analyzes your content across 11 dimensions simultaneously in about 30 seconds.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">📋</div>
            <h3 className="step-title">Get Actionable Results</h3>
            <p className="step-desc">Review scores, findings, and priority fixes. Export a PDF report or share a link.</p>
          </div>
        </div>
      </section>

      {/* ── Features highlight ────────────────────────────────────────── */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-highlight">
            <div className="feature-hl-content">
              <div className="section-label">E-E-A-T ANALYSIS</div>
              <h2 className="feature-hl-heading">Google's Quality Signals, Decoded</h2>
              <p className="feature-hl-text">
                PageIQ audits your content against Google's Experience, Expertise, Authoritativeness,
                and Trustworthiness guidelines — giving you a score and concrete recommendations for each dimension.
              </p>
              <ul className="feature-hl-list">
                <li>✅ 0–100 score per E-E-A-T dimension</li>
                <li>✅ Specific findings and missing signals</li>
                <li>✅ Priority fixes ranked by impact</li>
              </ul>
              <Link to="/audit" className="feature-hl-cta">Try It Free →</Link>
            </div>
            <div className="feature-hl-visual eeat-visual">
              <div className="eeat-card">
                <div className="eeat-row"><span>Experience</span><span className="eeat-score eeat-green">87</span></div>
                <div className="eeat-row"><span>Expertise</span><span className="eeat-score eeat-yellow">72</span></div>
                <div className="eeat-row"><span>Authoritativeness</span><span className="eeat-score eeat-green">91</span></div>
                <div className="eeat-row"><span>Trustworthiness</span><span className="eeat-score eeat-red">54</span></div>
                <div className="eeat-overall">Overall: <strong>76/100</strong></div>
              </div>
            </div>
          </div>

          <div className="feature-cards-row">
            <div className="feature-card">
              <div className="feature-card-icon">🤖</div>
              <h3>AI Citation Optimizer</h3>
              <p>Rewrite your content to be cited by ChatGPT, Perplexity, and Google SGE.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🗂️</div>
              <h3>Schema Markup Generator</h3>
              <p>Auto-generate JSON-LD structured data for rich results in Google Search.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h3>Topical Authority Cluster</h3>
              <p>Map your content to a topical cluster strategy with gap analysis and quick wins.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">💬</div>
              <h3>Conversational Query Map</h3>
              <p>Discover voice search queries and featured snippet opportunities for your page.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <h2 className="cta-banner-heading">Ready to Audit Your First Page?</h2>
        <p className="cta-banner-sub">Free, instant, no sign-up required. Or create an account to save your reports.</p>
        <div className="cta-banner-btns">
          <Link to="/audit" className="cta-banner-primary">Start Free Audit →</Link>
          <Link to="/pricing" className="cta-banner-ghost">View Pricing</Link>
        </div>
      </section>
    </div>
  );
}
