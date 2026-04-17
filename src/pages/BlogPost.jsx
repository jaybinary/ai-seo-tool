import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { POSTS, CATEGORY_COLORS } from '../data/posts';
import { CategoryBadge, BlogCard } from './Blog';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = POSTS.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // 404 fallback
  if (!post) {
    return (
      <div className="blog-post-notfound">
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <h2>Article not found</h2>
        <p>This article may have moved or doesn't exist.</p>
        <Link to="/blog" className="btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const dateFormatted = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const catStyle = CATEGORY_COLORS[post.category] || { bg: '#f1f5f9', color: '#64748b' };

  // Related posts: same category, excluding current
  const related = POSTS.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);
  const fallbackRelated = POSTS.filter(p => p.slug !== slug).slice(0, 3);
  const relatedPosts = related.length >= 2 ? related : fallbackRelated;

  return (
    <div className="blog-post-page">

      {/* ── Post Hero ────────────────────────────────────────────── */}
      <div className="blog-post-hero">
        <div className="blog-post-hero-inner">
          <Link to="/blog" className="blog-post-back">← Back to Blog</Link>
          <CategoryBadge category={post.category} size="md" />
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          <div className="blog-post-meta-row">
            <div className="blog-post-author">
              <div className="blog-post-author-avatar">P</div>
              <div>
                <div className="blog-post-author-name">{post.author}</div>
                <div className="blog-post-author-date">{dateFormatted} · {post.readTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Post Layout ──────────────────────────────────────────── */}
      <div className="blog-post-layout">

        {/* Main content */}
        <article className="blog-post-content">
          <div className="blog-post-cover-emoji">{post.coverEmoji}</div>
          <div
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* In-article CTA */}
          <div className="blog-post-inline-cta">
            <div className="blog-post-inline-cta-text">
              <strong>Audit your page with PageIQ</strong>
              <p>Get an instant AI-powered SEO audit — E-E-A-T, schema, queries, and more. Free, no sign-up required.</p>
            </div>
            <Link to="/audit" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              Run Free Audit →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="blog-post-sidebar">

          {/* Try PageIQ box */}
          <div className="blog-sidebar-card blog-sidebar-cta">
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <h3>Try PageIQ Free</h3>
            <p>Audit any page in under 2 minutes. 11 AI-powered SEO checks, instant results.</p>
            <Link to="/audit" className="btn-primary btn-full" style={{ marginTop: 16, display: 'block', textAlign: 'center' }}>
              Start Free Audit
            </Link>
          </div>

          {/* What PageIQ checks */}
          <div className="blog-sidebar-card">
            <div className="blog-sidebar-heading">What PageIQ Checks</div>
            <ul className="blog-sidebar-list">
              <li>🏆 E-E-A-T Score</li>
              <li>🗂️ Schema Markup</li>
              <li>💬 Query Map</li>
              <li>🔗 Entity Coverage</li>
              <li>📊 Topical Authority</li>
              <li>🤖 AI Citation Score</li>
              <li>🏷️ Title & Description</li>
              <li>🔍 URL & Structure</li>
            </ul>
          </div>

          {/* Category */}
          <div className="blog-sidebar-card">
            <div className="blog-sidebar-heading">Category</div>
            <span
              className="blog-category-badge md"
              style={{ background: catStyle.bg, color: catStyle.color }}
            >
              {post.category}
            </span>
          </div>

        </aside>
      </div>

      {/* ── Related Posts ─────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <div className="blog-related">
          <div className="blog-related-inner">
            <div className="section-label" style={{ marginBottom: 8 }}>MORE ARTICLES</div>
            <h2 className="blog-related-heading">Keep Reading</h2>
            <div className="blog-grid" style={{ marginTop: 24 }}>
              {relatedPosts.map(p => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="cta-banner">
        <h2 className="cta-banner-heading">Ready to audit your page?</h2>
        <p className="cta-banner-sub">
          Free, instant, no sign-up needed. Paste a URL and get 11 AI SEO insights in under 2 minutes.
        </p>
        <div className="cta-banner-btns">
          <Link to="/audit" className="cta-banner-primary">Run Free Audit →</Link>
          <Link to="/pricing" className="cta-banner-ghost">View Pricing</Link>
        </div>
      </section>

    </div>
  );
}
