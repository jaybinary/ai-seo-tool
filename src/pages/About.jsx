import React from 'react';
import { Link } from 'react-router-dom';
import { SKILLS, COLORS } from '../utils/skills';

const WHO = [
  {
    icon: '🛍️',
    title: 'Shopify Merchants',
    desc: 'Your product pages aren\'t ranking. PageIQ tells you exactly why — and what to rewrite, restructure, or add to change that.',
  },
  {
    icon: '🚀',
    title: 'D2C Founders',
    desc: 'You\'re growing fast but organic traffic isn\'t keeping up. PageIQ gives you a clear SEO roadmap without hiring an agency.',
  },
  {
    icon: '🏢',
    title: 'SEO Agencies',
    desc: 'Audit 10× more clients in a fraction of the time. Deliver branded, AI-generated reports that show real depth of analysis.',
  },
  {
    icon: '📣',
    title: 'Marketing Teams',
    desc: 'Stop guessing what content to create. PageIQ surfaces gaps, opportunities, and priority fixes across your entire site.',
  },
];

const APPROACH = [
  {
    icon: '🤖',
    title: 'AI at the Core',
    desc: 'Every audit is powered by large language models trained to analyse content the way Google and AI engines actually evaluate it.',
  },
  {
    icon: '🎯',
    title: 'Actionable by Design',
    desc: 'No raw data dumps. Every output is a specific recommendation: what to fix, rewrite, add, or restructure.',
  },
  {
    icon: '⚡',
    title: 'No Integrations Needed',
    desc: 'Paste a URL. That\'s it. No API keys, no crawl setup, no 48-hour wait. Results in under 2 minutes.',
  },
  {
    icon: '🔍',
    title: 'Full Depth, Zero Noise',
    desc: '11 specialised modules run in parallel. You get comprehensive coverage without wading through irrelevant metrics.',
  },
  {
    icon: '🏎️',
    title: 'Speed + Clarity',
    desc: 'Built for founders and marketers, not just SEO specialists. Plain English findings you can act on immediately.',
  },
  {
    icon: '📊',
    title: 'Scored & Prioritised',
    desc: 'Every audit produces a 0–100 score per dimension so you know exactly where you stand and what to tackle first.',
  },
];

export default function About() {
  return (
    <div className="about-page">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Built for clarity, not complexity
          </div>
          <h1 className="about-hero-headline">
            SEO shouldn't require a<br />
            <span className="hero-gradient">PhD to understand</span>
          </h1>
          <p className="about-hero-sub">
            PageIQ was built on a single belief: every business deserves to know exactly
            what's stopping their content from ranking — and exactly what to do about it.
          </p>
          <div className="about-hero-btns">
            <Link to="/audit" className="cta-banner-primary">Start Free Audit →</Link>
            <Link to="/pricing" className="cta-banner-ghost">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────── */}
      <section className="about-section">
        <div className="about-section-inner about-mission-grid">
          <div className="about-mission-text">
            <div className="section-label">OUR MISSION</div>
            <h2 className="section-heading">Make SEO intelligence<br />accessible to everyone</h2>
            <p className="about-body">
              SEO has a clarity problem. Most tools produce hundreds of data points and leave
              you to figure out what any of it means. Specialists hoard knowledge. Reports are
              long on findings and short on fixes.
            </p>
            <p className="about-body" style={{ marginTop: 16 }}>
              PageIQ exists to close that gap. We take the analytical power of enterprise SEO
              — E-E-A-T evaluation, topical authority mapping, AI citation optimisation — and
              deliver it as clear, prioritised, plain-English actions that any team can execute.
            </p>
          </div>
          <div className="about-mission-cards">
            <div className="about-problem-card">
              <div className="about-problem-label">The Problem</div>
              <ul className="about-problem-list">
                <li>⛔ SEO tools report metrics — not decisions</li>
                <li>⛔ Audits take days and cost thousands</li>
                <li>⛔ Findings require an expert to interpret</li>
                <li>⛔ AI search requires new signals most tools miss</li>
              </ul>
            </div>
            <div className="about-solution-card">
              <div className="about-solution-label">PageIQ's Answer</div>
              <ul className="about-solution-list">
                <li>✅ 11-skill AI audit in under 2 minutes</li>
                <li>✅ Plain-English findings, zero jargon</li>
                <li>✅ Prioritised fixes ranked by impact</li>
                <li>✅ Built for Google AND AI search engines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do ────────────────────────────────────────── */}
      <section className="about-section about-section-alt">
        <div className="about-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">WHAT WE DO</div>
            <h2 className="section-heading">11 AI modules. One complete picture.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Most audits check one or two dimensions. PageIQ runs 11 specialised AI modules
              in parallel — giving you full coverage in the time it takes to make a coffee.
            </p>
          </div>
          <div className="about-skills-grid">
            {SKILLS.map(skill => (
              <div key={skill.key} className="about-skill-card" style={{ '--skill-color': COLORS[skill.key] }}>
                <div className="about-skill-icon">{skill.icon}</div>
                <div className="about-skill-name">{skill.name}</div>
                <div className="about-skill-desc">{skill.desc}</div>
                <div className="about-skill-bar"></div>
              </div>
            ))}
          </div>
          <div className="about-skills-note">
            Every audit runs all 11 modules simultaneously — no cherry-picking, no add-ons.
          </div>
        </div>
      </section>

      {/* ── Who It's For ──────────────────────────────────────── */}
      <section className="about-section">
        <div className="about-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">WHO IT'S FOR</div>
            <h2 className="section-heading">Built for teams who move fast</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Whether you're a solo founder or managing 50 client accounts, PageIQ gives
              you the depth of an SEO agency with none of the overhead.
            </p>
          </div>
          <div className="about-who-grid">
            {WHO.map((w, i) => (
              <div key={i} className="about-who-card">
                <div className="about-who-icon">{w.icon}</div>
                <h3 className="about-who-title">{w.title}</h3>
                <p className="about-who-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Approach ──────────────────────────────────────── */}
      <section className="about-section about-section-alt">
        <div className="about-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">OUR APPROACH</div>
            <h2 className="section-heading">Designed around decisions,<br />not dashboards</h2>
          </div>
          <div className="about-approach-grid">
            {APPROACH.map((a, i) => (
              <div key={i} className="about-approach-card">
                <div className="about-approach-icon">{a.icon}</div>
                <h3 className="about-approach-title">{a.title}</h3>
                <p className="about-approach-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ────────────────────────────────────────────── */}
      <section className="about-vision">
        <div className="about-vision-inner">
          <div className="about-vision-label">OUR VISION</div>
          <h2 className="about-vision-heading">
            Beyond SEO tools.<br />Towards AI growth intelligence.
          </h2>
          <p className="about-vision-text">
            The SEO tool era is ending. Search is evolving — Google SGE, Perplexity, ChatGPT,
            voice search — and the old playbook no longer applies. PageIQ is building toward
            a world where AI understands your entire content strategy, predicts what will rank,
            and continuously tells you what to do next.
          </p>
          <div className="about-vision-milestones">
            <div className="about-milestone">
              <div className="about-milestone-dot done"></div>
              <div>
                <div className="about-milestone-title">Today — AI SEO Audits</div>
                <div className="about-milestone-desc">11-module page audits. Instant. Actionable.</div>
              </div>
            </div>
            <div className="about-milestone-line"></div>
            <div className="about-milestone">
              <div className="about-milestone-dot active"></div>
              <div>
                <div className="about-milestone-title">Next — Site-Wide Intelligence</div>
                <div className="about-milestone-desc">Audit entire domains. Track improvements over time. Benchmark vs competitors.</div>
              </div>
            </div>
            <div className="about-milestone-line"></div>
            <div className="about-milestone">
              <div className="about-milestone-dot future"></div>
              <div>
                <div className="about-milestone-title">Future — AI Growth Co-pilot</div>
                <div className="about-milestone-desc">Proactive recommendations. Predictive ranking insights. AI-native search optimisation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="cta-banner">
        <h2 className="cta-banner-heading">Start your free audit today</h2>
        <p className="cta-banner-sub">
          No sign-up required. Paste a URL and get 11 AI-powered insights in under 2 minutes.
        </p>
        <div className="cta-banner-btns">
          <Link to="/audit" className="cta-banner-primary">Run Free Audit →</Link>
          <Link to="/pricing" className="cta-banner-ghost">View Pricing</Link>
        </div>
      </section>

    </div>
  );
}
