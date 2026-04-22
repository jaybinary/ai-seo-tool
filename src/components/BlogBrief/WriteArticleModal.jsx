// ── WriteArticleModal ─────────────────────────────────────────────────────────
// Slide-in panel: takes a brief → generates a full SEO article draft

import React, { useState, useEffect } from 'react';

// ── Simple markdown renderer ──────────────────────────────────────────────────
function MarkdownBlock({ md }) {
  if (!md) return null;
  // Convert markdown headings, bold, lists to HTML
  const html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    ;
  return (
    <div
      className="wa-article-body"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  );
}

export default function WriteArticleModal({ brief, url, onClose }) {
  const [brandName,  setBrandName]  = useState('');
  const [country,    setCountry]    = useState('India');
  const [audience,   setAudience]   = useState('');
  const [ctaGoal,    setCtaGoal]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [article,    setArticle]    = useState(null);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setArticle(null);

    try {
      const res = await fetch('/.netlify/functions/write-article', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, brandName, country, audience, ctaGoal }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');
      setArticle(data.article);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    if (!article) return;
    const text = [
      `SEO TITLE: ${article.seoTitle}`,
      `META DESCRIPTION: ${article.metaDesc}`,
      `SLUG: ${article.slug}`,
      '',
      article.articleMd,
      '',
      `SCHEMA TYPE: ${article.schemaType}`,
      '',
      'EDITOR NOTES:',
      article.editorNotes,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!article) return;
    const text = [
      `SEO TITLE: ${article.seoTitle}`,
      `META DESCRIPTION: ${article.metaDesc}`,
      `SLUG: ${article.slug}`,
      '',
      article.articleMd,
      '',
      `SCHEMA TYPE: ${article.schemaType}`,
      '',
      'EDITOR NOTES:',
      article.editorNotes,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pageiq-article-${(brief.targetKeyword || 'draft').replace(/\s+/g, '-')}.md`;
    a.click();
  }

  const LOADING_STEPS = [
    'Reading your brief…',
    'Analysing keyword intent…',
    'Structuring H1 and outline…',
    'Writing introduction…',
    'Drafting H2 sections…',
    'Weaving in entities and links…',
    'Writing FAQ answers…',
    'Adding CTA and conclusion…',
    'Polishing for readability…',
    'Finalising article…',
  ];

  return (
    <div className="bb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bb-panel wa-panel" role="dialog" aria-modal="true" aria-label="Write Full Article">

        {/* ── Header ── */}
        <div className="bb-header">
          <div className="bb-header-left">
            <div className="bb-header-icon">📝</div>
            <div>
              <div className="bb-header-title">Write Full Article</div>
              <div className="bb-header-url">{url} · {brief.targetKeyword}</div>
            </div>
          </div>
          <div className="bb-header-actions">
            {article && (
              <>
                <button className="bb-btn-ghost" onClick={() => { setArticle(null); setError(''); }}>
                  ↺ Regenerate
                </button>
                <button className="bb-btn-ghost" onClick={handleCopyAll}>
                  {copied ? '✓ Copied' : '⎘ Copy All'}
                </button>
                <button className="bb-btn-ghost" onClick={handleDownload}>
                  ↓ Download .md
                </button>
              </>
            )}
            <button className="bb-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bb-body">
          {!article ? (
            <div className="bb-form-wrap">
              <div className="bb-form-intro">
                <h2 className="bb-form-title">Generate a full SEO article draft</h2>
                <p className="bb-form-sub">
                  PageIQ will use your blog brief to write a complete, SEO-optimised article —
                  with title, meta, slug, full draft, FAQs, schema type, and editor notes.
                </p>
              </div>

              <form className="bb-form" onSubmit={handleGenerate}>
                <div className="bb-field">
                  <label className="bb-label">
                    Brand Name
                    <span className="bb-optional"> — optional</span>
                  </label>
                  <input
                    type="text"
                    className="bb-input"
                    placeholder="e.g. HiCare, Rentokil, CleanHome"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="bb-field">
                  <label className="bb-label">
                    Country / Market
                  </label>
                  <input
                    type="text"
                    className="bb-input"
                    placeholder="e.g. India, Mumbai, pan-India"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
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
                    placeholder="e.g. urban homeowners, D2C brands, IT professionals"
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                  />
                </div>

                <div className="bb-field">
                  <label className="bb-label">
                    CTA Goal
                    <span className="bb-optional"> — optional</span>
                  </label>
                  <input
                    type="text"
                    className="bb-input"
                    placeholder="e.g. Book a free inspection, Get a quote, Call us"
                    value={ctaGoal}
                    onChange={e => setCtaGoal(e.target.value)}
                  />
                </div>

                {error && <div className="bb-error">{error}</div>}

                <button type="submit" className="bb-btn-primary" disabled={loading}>
                  {loading
                    ? <><span className="bb-spinner"></span> Writing article…</>
                    : '📝 Write Full Article'
                  }
                </button>
              </form>

              {/* Brief summary chips */}
              <div className="bb-data-chips">
                <div className="bb-data-chips-label">Writing from brief:</div>
                <div className="bb-chips-row">
                  {brief.targetKeyword && <span className="bb-chip">🎯 {brief.targetKeyword}</span>}
                  {brief.outline?.h2s?.length > 0 && <span className="bb-chip">📋 {brief.outline.h2s.length} H2 sections</span>}
                  {brief.faqs?.length > 0 && <span className="bb-chip">❓ {brief.faqs.length} FAQs</span>}
                  {brief.mustIncludeEntities?.length > 0 && <span className="bb-chip">🏷️ {brief.mustIncludeEntities.length} entities</span>}
                  <span className="bb-chip">~{brief.recommendedWordCount || 1500} words</span>
                </div>
              </div>

              {loading && (
                <div className="bb-loading-card">
                  <div className="bb-loading-steps">
                    {LOADING_STEPS.map((step, i) => (
                      <div key={i} className="bb-loading-step" style={{ animationDelay: `${i * 1.2}s` }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Article Output ── */
            <div className="wa-output">

              {/* Meta strip */}
              <div className="wa-meta-strip">
                <div className="wa-meta-item">
                  <div className="wa-meta-label">SEO Title</div>
                  <div className="wa-meta-value">{article.seoTitle}</div>
                </div>
                <div className="wa-meta-item">
                  <div className="wa-meta-label">Meta Description</div>
                  <div className="wa-meta-value">{article.metaDesc}</div>
                </div>
                <div className="wa-meta-item">
                  <div className="wa-meta-label">Slug</div>
                  <div className="wa-meta-value wa-slug">/{article.slug}</div>
                </div>
                <div className="wa-meta-item">
                  <div className="wa-meta-label">Schema Type</div>
                  <div className="wa-meta-value"><span className="bb-chip">{article.schemaType}</span></div>
                </div>
              </div>

              {/* Editor notes */}
              {article.editorNotes && (
                <div className="wa-editor-notes">
                  <div className="wa-notes-label">📌 Editor Notes</div>
                  <div className="wa-notes-body">{article.editorNotes}</div>
                </div>
              )}

              {/* Full article */}
              <div className="wa-article-wrap">
                <div className="wa-article-header">
                  <span className="wa-article-label">Full Article Draft</span>
                  <button
                    className="bb-copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(article.articleMd);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
                <MarkdownBlock md={article.articleMd} />
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
