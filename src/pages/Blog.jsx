import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { POSTS, CATEGORIES, CATEGORY_COLORS } from '../data/posts';

// ── Category Badge ────────────────────────────────────────────────────────────
export function CategoryBadge({ category, size = 'sm' }) {
  const style = CATEGORY_COLORS[category] || { bg: '#f1f5f9', color: '#64748b' };
  return (
    <span className={`blog-category-badge ${size}`} style={{ background: style.bg, color: style.color }}>
      {category}
    </span>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────────
export function BlogCard({ post }) {
  const dateFormatted = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-cover">{post.coverEmoji}</div>
      <div className="blog-card-body">
        <CategoryBadge category={post.category} />
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-meta">
          <span>{dateFormatted}</span>
          <span className="blog-meta-dot">·</span>
          <span>{post.readTime}</span>
        </div>
        <div className="blog-card-cta">Read Article →</div>
      </div>
    </Link>
  );
}

// ── Blog Listing Page ─────────────────────────────────────────────────────────
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featuredPost = POSTS.find(p => p.featured);
  const filteredPosts = POSTS.filter(p => {
    if (p.featured && activeCategory === 'All') return false; // featured shown separately
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const featuredDate = featuredPost
    ? new Date(featuredPost.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="blog-page">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <div className="section-label" style={{ color: '#a5b4fc', marginBottom: 12 }}>
            PAGEIQ BLOG
          </div>
          <h1 className="blog-hero-headline">
            Insights on SEO, AI<br />
            <span className="hero-gradient">& Growth</span>
          </h1>
          <p className="blog-hero-sub">
            Practical guides on SEO, AI search, content strategy, and conversion
            — written for founders, marketers, and agencies who want results.
          </p>
        </div>
      </section>

      <div className="blog-page-inner">

        {/* ── Featured Post ────────────────────────────────────────── */}
        {featuredPost && activeCategory === 'All' && (
          <section className="blog-featured-section">
            <div className="section-label" style={{ marginBottom: 16 }}>FEATURED</div>
            <Link to={`/blog/${featuredPost.slug}`} className="blog-featured-card">
              <div className="blog-featured-cover">{featuredPost.coverEmoji}</div>
              <div className="blog-featured-body">
                <CategoryBadge category={featuredPost.category} size="md" />
                <h2 className="blog-featured-title">{featuredPost.title}</h2>
                <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="blog-featured-meta">
                  <span>{featuredDate}</span>
                  <span className="blog-meta-dot">·</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <div className="blog-featured-cta">Read Article →</div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Category Filter ──────────────────────────────────────── */}
        <section className="blog-filter-section">
          <div className="blog-filter-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`blog-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="blog-filter-count">
            {activeCategory === 'All'
              ? `${POSTS.length} articles`
              : `${POSTS.filter(p => p.category === activeCategory).length} articles in ${activeCategory}`
            }
          </div>
        </section>

        {/* ── Posts Grid ──────────────────────────────────────────── */}
        <section className="blog-grid-section">
          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
              <p>No articles in this category yet. Check back soon.</p>
            </div>
          )}
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="blog-cta">
          <div className="blog-cta-inner">
            <div className="blog-cta-emoji">🔍</div>
            <h2 className="blog-cta-heading">Try PageIQ on your page</h2>
            <p className="blog-cta-sub">
              Audit any URL in under 2 minutes. Get E-E-A-T scores, schema markup,
              query maps, and 8 more AI-powered insights — free, no sign-up required.
            </p>
            <Link to="/audit" className="cta-banner-primary">
              Run Free Audit →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
