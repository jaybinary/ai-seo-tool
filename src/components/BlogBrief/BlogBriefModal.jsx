// ── BlogBriefModal ────────────────────────────────────────────────────────────
// Full-screen slide-in panel triggered from the Audit results page.
// Phase 1: Form (keyword + audience)
// Phase 2: Structured brief output with copy/export

import React, { useState, useEffect } from 'react';
import BlogBriefOutput from './BlogBriefOutput';

export default function BlogBriefModal({ url, auditSnapshot, onClose }) {
  const [keyword,  setKeyword]  = useState('');
  const [audience, setAudience] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [brief,    setBrief]    = useState(null);

  // Lock body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBrief(null);

    try {
      const res = await fetch('/.netlify/functions/generate-brief', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, keyword, audience, auditSnapshot }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');
      setBrief(data.brief);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setBrief(null);
    setKeyword('');
    setAudience('');
    setError('');
  }

  return (
    <div className="bb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bb-panel" role="dialog" aria-modal="true" aria-label="Generate Blog Brief">

        {/* ── Header ── */}
        <div className="bb-header">
          <div className="bb-header-left">
            <div className="bb-header-icon">✍️</div>
            <div>
              <div className="bb-header-title">Generate Blog Brief</div>
              <div className="bb-header-url">{url}</div>
            </div>
          </div>
          <div className="bb-header-actions">
            {brief && (
              <button className="bb-btn-ghost" onClick={handleReset}>
                ↺ Regenerate
              </button>
            )}
            <button className="bb-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bb-body">
          {!brief ? (
            /* ── Phase 1: Input Form ── */
            <div className="bb-form-wrap">
              <div className="bb-form-intro">
                <h2 className="bb-form-title">Build a content brief from your audit</h2>
                <p className="bb-form-sub">
                  PageIQ will use your audit data — entities, query map, content gaps, and topical clusters —
                  to generate a structured, copy-ready blog brief in seconds.
                </p>
              </div>

              <form className="bb-form" onSubmit={handleGenerate}>
                <div className="bb-field">
                  <label className="bb-label">
                    Target Keyword
                    <span className="bb-optional"> — optional (derived from audit if blank)</span>
                  </label>
                  <input
                    type="text"
                    className="bb-input"
                    placeholder="e.g. shopify seo checklist"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <div className="bb-field">
                  <label className="bb-label">
                    Target Audience
                    <span className="bb-optional"> — optional</span>
                  </label>
                  <input
                    type="text"
                    className="bb-input"
                    placeholder="e.g. Shopify store owners, D2C founders"
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="bb-error">{error}</div>
                )}

                <button type="submit" className="bb-btn-primary" disabled={loading}>
                  {loading ? (
                    <><span className="bb-spinner"></span> Generating brief…</>
                  ) : (
                    '✍️ Generate Blog Brief'
                  )}
                </button>
              </form>

              {/* Data being used */}
              <div className="bb-data-chips">
                <div className="bb-data-chips-label">Using audit data from:</div>
                <div className="bb-chips-row">
                  {['Query Map', 'Entity Gaps', 'Content Brief', 'Topical Clusters', 'Internal Links', 'E-E-A-T'].map(chip => (
                    <span key={chip} className="bb-chip">✓ {chip}</span>
                  ))}
                  <span className="bb-chip bb-chip--future">⌛ Ahrefs (coming soon)</span>
                </div>
              </div>

              {/* Loading state — immersive */}
              {loading && (
                <div className="bb-loading-card">
                  <div className="bb-loading-steps">
                    {[
                      'Reading audit data…',
                      'Analysing query intent…',
                      'Mapping entity coverage…',
                      'Structuring H2 outline…',
                      'Generating title options…',
                      'Compiling FAQ from query map…',
                      'Finalising brief…',
                    ].map((step, i) => (
                      <div key={i} className="bb-loading-step" style={{ animationDelay: `${i * 0.7}s` }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Phase 2: Brief Output ── */
            <BlogBriefOutput brief={brief} url={url} keyword={keyword} />
          )}
        </div>

      </div>
    </div>
  );
}
