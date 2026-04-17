// ── Blog Posts Data ───────────────────────────────────────────────────────────
// To add a new post: copy a post object, update all fields, set featured: false
// Content supports basic HTML tags for formatting in BlogPost.jsx

export const CATEGORIES = ['All', 'SEO', 'AI SEO', 'Shopify SEO', 'Content Strategy', 'CRO'];

export const CATEGORY_COLORS = {
  'SEO':              { bg: '#eef2ff', color: '#4f46e5' },
  'AI SEO':           { bg: '#f0fdf4', color: '#059669' },
  'Shopify SEO':      { bg: '#fff7ed', color: '#ea580c' },
  'Content Strategy': { bg: '#fdf4ff', color: '#9333ea' },
  'CRO':              { bg: '#fefce8', color: '#ca8a04' },
};

export const POSTS = [
  {
    slug: 'eeat-seo-guide-2024',
    title: 'E-E-A-T Explained: How Google Judges Your Content in 2024',
    excerpt: 'Google\'s quality rater guidelines have shifted. Experience is now the first signal. Here\'s what that means for your content and exactly what to add to every page.',
    category: 'SEO',
    author: 'PageIQ Team',
    date: '2024-03-12',
    readTime: '7 min read',
    featured: true,
    coverEmoji: '🏆',
    content: `
<p>Google's E-E-A-T framework — Experience, Expertise, Authoritativeness, and Trustworthiness — is not a ranking factor in the traditional sense. It's a quality signal that influences how Google's algorithms treat your content.</p>

<h2>What Changed with the Addition of "Experience"</h2>
<p>In December 2022, Google added a second "E" — Experience — to the original E-A-T framework. This was significant. It means Google now wants to see evidence that the author has <em>first-hand experience</em> with the topic they're writing about.</p>
<p>A review article written by someone who has actually used the product will outrank one written by someone who just aggregated specs. A travel guide written by someone who visited the destination beats one written from a desk.</p>

<h2>The Four Dimensions and What to Add to Your Pages</h2>

<h3>1. Experience</h3>
<p>Show personal involvement. Add first-person accounts, original photographs, case studies from your own business, or dates that show ongoing engagement with the topic.</p>
<ul>
  <li>Add "I tested this for 30 days and here's what happened" sections</li>
  <li>Include original screenshots, photos, or data you collected</li>
  <li>Reference specific experiences — dates, locations, products used</li>
</ul>

<h3>2. Expertise</h3>
<p>Demonstrate depth of knowledge. Surface your credentials, cite primary sources, and cover nuance that a generalist wouldn't know.</p>
<ul>
  <li>Add detailed author bios with specific credentials</li>
  <li>Link to original research and primary sources</li>
  <li>Cover edge cases and exceptions that shallow content skips</li>
</ul>

<h3>3. Authoritativeness</h3>
<p>Authority is built externally. It comes from other trusted sites citing you, linking to you, or mentioning your brand. On-page, you can support it with social proof.</p>
<ul>
  <li>Display press mentions, awards, or certifications</li>
  <li>Show client logos if B2B</li>
  <li>Display review counts and ratings from third-party platforms</li>
</ul>

<h3>4. Trustworthiness</h3>
<p>Trust is about accuracy, transparency, and safety. It's the most important dimension of the four according to Google's guidelines.</p>
<ul>
  <li>Keep content up to date — add "Last updated" dates</li>
  <li>Have a clear privacy policy and contact page</li>
  <li>Show secure checkout signals on e-commerce pages</li>
  <li>Be honest about limitations of products or advice</li>
</ul>

<h2>How PageIQ Audits E-E-A-T</h2>
<p>PageIQ's E-E-A-T module scores your page 0–100 across all four dimensions and gives you specific, prioritised fixes. It reads your content the way Google's quality raters would — not just checking for keywords, but evaluating whether the page genuinely demonstrates the signals Google is looking for.</p>

<h2>Quick Wins You Can Implement Today</h2>
<ul>
  <li>Add a detailed author bio with real credentials to every post</li>
  <li>Add a "Last reviewed" date to evergreen content</li>
  <li>Include at least one original data point, screenshot, or case example per page</li>
  <li>Link out to authoritative sources (don't be afraid to link externally)</li>
  <li>Add an FAQ section to address trust questions directly</li>
</ul>
    `,
  },
  {
    slug: 'ai-search-seo-perplexity-chatgpt',
    title: 'How to Get Your Content Cited by ChatGPT, Perplexity & Google SGE',
    excerpt: 'AI search engines are now answering questions directly — and they\'re citing sources. Here\'s the framework for making your content one of them.',
    category: 'AI SEO',
    author: 'PageIQ Team',
    date: '2024-03-05',
    readTime: '9 min read',
    featured: false,
    coverEmoji: '🤖',
    content: `
<p>A new layer of search has emerged. When someone asks Perplexity a question, it doesn't just show links — it gives an answer, and then cites the sources it used. Getting cited is the new equivalent of ranking on page one.</p>

<h2>Why AI Citation Matters More Than Traditional Rankings</h2>
<p>AI-generated answers are shown directly in the search interface. Users read the answer without clicking. But the cited sources — the 3–5 links shown alongside the answer — get significant traffic and, critically, brand authority.</p>
<p>Being cited by ChatGPT or Perplexity is the equivalent of a featured snippet times ten. It signals to the user that your content is trustworthy enough for an AI to stake its answer on.</p>

<h2>What Makes Content Citation-Worthy</h2>

<h3>Structured, Scannable Answers</h3>
<p>AI models parse content looking for clear answers to specific questions. Content that buries its point in paragraphs is harder to extract from. Structure your content so the answer comes first.</p>

<h3>Statistical Specificity</h3>
<p>AI engines prefer citing content with specific data points over vague claims. "Conversion rates improve by 23% when page speed drops below 2 seconds" is more citation-worthy than "fast pages convert better."</p>

<h3>Question-Answer Format</h3>
<p>Content that directly answers the question being asked — in the opening paragraph, not buried on page three — is more likely to be extracted and cited.</p>

<h3>Topical Completeness</h3>
<p>An article that covers a topic comprehensively is more likely to be cited for multiple queries. Cover the full landscape: definitions, how-to, examples, FAQs, and edge cases.</p>

<h2>The Passage-Level Optimisation Framework</h2>
<p>Google SGE and Perplexity both operate at a passage level — they can extract a single paragraph from your page if it directly answers a query. This means you need each section of your content to be independently useful.</p>
<ul>
  <li>Each H2 should answer a standalone question</li>
  <li>The first sentence of each section should state the main point</li>
  <li>Include TL;DR summaries or key takeaways</li>
  <li>Use numbered lists for processes, bulleted lists for features</li>
</ul>
    `,
  },
  {
    slug: 'shopify-seo-product-pages',
    title: 'Shopify SEO: Why Your Product Pages Aren\'t Ranking (And How to Fix It)',
    excerpt: 'Most Shopify stores have identical product page structures. Google can\'t differentiate them. This guide shows you exactly what to add to make yours stand out.',
    category: 'Shopify SEO',
    author: 'PageIQ Team',
    date: '2024-02-28',
    readTime: '8 min read',
    featured: false,
    coverEmoji: '🛍️',
    content: `
<p>Shopify is the most popular e-commerce platform in the world. It's also why so many stores have identical SEO setups. The default theme structure, auto-generated meta tags, and thin product descriptions mean Google sees thousands of near-identical pages competing for the same keywords.</p>

<h2>The Shopify SEO Problem in Plain English</h2>
<p>When you install a Shopify theme and add products, you get auto-generated title tags like "Product Name – Store Name" and meta descriptions pulled from the first 160 characters of your description. If your description starts with a feature list, that's your meta description.</p>
<p>Google has seen this pattern millions of times. It doesn't distinguish your store from anyone else selling the same product.</p>

<h2>Five Fixes That Actually Move the Needle</h2>

<h3>1. Write Unique, Intent-Matched Title Tags</h3>
<p>Your title tag should match the search intent of the buyer, not just the product name. "Nike Air Max 270 – Store Name" doesn't tell Google who this is for. "Nike Air Max 270 for Flat Feet — Free UK Delivery" does.</p>

<h3>2. Add Product Schema Markup</h3>
<p>Shopify includes basic schema, but it often misses price, availability, and review data. Adding complete Product schema gets you rich results in Google — star ratings, price, and availability shown directly in search.</p>

<h3>3. Expand Product Descriptions with Real Content</h3>
<p>Thin descriptions (under 300 words) don't rank. Add use cases, size guides, material details, care instructions, and FAQs. Each section is an opportunity to target a long-tail query.</p>

<h3>4. Target Long-Tail Variants</h3>
<p>Your product page can rank for dozens of queries beyond the product name. "Best running shoes for plantar fasciitis", "lightweight trail running shoes under £100" — create separate sections that answer these specific queries.</p>

<h3>5. Add Internal Links to Category and Blog Pages</h3>
<p>Shopify stores are often poorly interlinked. Product pages sit in silos. Adding links to related products, the parent category, and relevant blog posts distributes authority and helps Google understand your site structure.</p>
    `,
  },
  {
    slug: 'topical-authority-content-strategy',
    title: 'Topical Authority: The Content Strategy That Replaced Keyword Stuffing',
    excerpt: 'Google no longer rewards pages optimised for individual keywords. It rewards sites that comprehensively cover a topic. Here\'s how to build topical authority from scratch.',
    category: 'Content Strategy',
    author: 'PageIQ Team',
    date: '2024-02-20',
    readTime: '10 min read',
    featured: false,
    coverEmoji: '📊',
    content: `
<p>The era of optimising individual pages for individual keywords is over. Google's Helpful Content update, combined with advances in natural language understanding, means the algorithm now evaluates your <em>site</em> as a whole — specifically, whether it demonstrates genuine expertise across a topic area.</p>

<h2>What Topical Authority Actually Means</h2>
<p>A site has topical authority when it comprehensively covers a subject area. If you run a pet food blog and you have articles about nutrition, training, health conditions, breed differences, and product reviews — you're building topical authority. A single well-optimised post about "best dog food" won't rank as well as a site that covers the full topic ecosystem.</p>

<h2>The Pillar and Cluster Model</h2>
<p>The most effective structure for topical authority is the pillar-cluster model:</p>
<ul>
  <li><strong>Pillar page:</strong> A comprehensive guide covering the main topic at high level (2,000–4,000 words)</li>
  <li><strong>Cluster pages:</strong> Deeper dives into each subtopic within the pillar (800–1,500 words each)</li>
  <li><strong>Internal links:</strong> Every cluster page links back to the pillar; the pillar links to all clusters</li>
</ul>

<h2>How to Build Your Topical Map</h2>
<p>Start by identifying your core topic — the thing you want to be the authoritative source on. Then map out every subtopic, question, and use case that falls under it. Tools like PageIQ's Topical Authority Cluster module do this automatically, identifying gaps in your current coverage and suggesting specific pages to create.</p>
    `,
  },
  {
    slug: 'cro-seo-landing-page-conversion',
    title: 'The CRO + SEO Overlap: How to Optimise Pages for Both Rankings and Conversions',
    excerpt: 'Most teams treat SEO and CRO as separate workstreams. The best-performing pages treat them as one. Here\'s the framework.',
    category: 'CRO',
    author: 'PageIQ Team',
    date: '2024-02-12',
    readTime: '6 min read',
    featured: false,
    coverEmoji: '📈',
    content: `
<p>SEO gets people to your page. CRO converts them once they're there. The problem is most companies treat them as separate disciplines — SEO team optimises for rankings, CRO team optimises for conversions, and they rarely talk to each other. The result is pages that rank but don't convert, or pages that convert but never get traffic.</p>

<h2>Where SEO and CRO Overlap</h2>
<p>The Venn diagram is larger than most people think:</p>
<ul>
  <li><strong>Page speed:</strong> Impacts both bounce rate (CRO) and Core Web Vitals ranking signals (SEO)</li>
  <li><strong>Content clarity:</strong> Clear, scannable content reduces bounce (CRO) and improves dwell time (SEO)</li>
  <li><strong>Intent matching:</strong> Content that matches search intent ranks better AND converts better</li>
  <li><strong>Trust signals:</strong> Reviews, credentials, and proof elements improve both E-E-A-T and conversion trust</li>
</ul>

<h2>The Intent-First Framework</h2>
<p>Both disciplines start with the same question: what does this person actually want? For SEO, mismatched intent means low CTR and high bounce rate. For CRO, mismatched intent means low conversion rate. Getting intent right is the single highest-leverage thing you can do for both.</p>
    `,
  },
  {
    slug: 'schema-markup-rich-results-guide',
    title: 'Schema Markup in 2024: Which Types Actually Drive Rich Results',
    excerpt: 'Not all schema markup is equal. Some types reliably trigger rich results in Google search. Others are ignored. Here\'s what\'s actually worth implementing.',
    category: 'SEO',
    author: 'PageIQ Team',
    date: '2024-02-05',
    readTime: '5 min read',
    featured: false,
    coverEmoji: '🗂️',
    content: `
<p>Schema markup is JSON-LD code you add to your pages to help Google understand what the content is about. When Google understands it, it can display enhanced results in search — star ratings, prices, FAQs, event dates, and more.</p>

<h2>Schema Types That Reliably Trigger Rich Results</h2>
<ul>
  <li><strong>Product:</strong> Star ratings, price, availability in e-commerce listings</li>
  <li><strong>FAQ:</strong> Expanded Q&A shown directly below your search listing</li>
  <li><strong>HowTo:</strong> Step-by-step instructions with images in search</li>
  <li><strong>Article:</strong> Author, publish date, and breadcrumb in news results</li>
  <li><strong>BreadcrumbList:</strong> Structured site path shown in the URL line of your listing</li>
  <li><strong>Review / AggregateRating:</strong> Stars in search results for products and services</li>
</ul>

<h2>What PageIQ's Schema Module Does</h2>
<p>PageIQ's Schema Markup module reads your page content and auto-generates the correct JSON-LD for your content type. It detects whether your page is a product, article, FAQ, or how-to guide, then produces implementation-ready code you can paste directly into your Shopify theme or WordPress header.</p>
    `,
  },
  {
    slug: 'internal-linking-seo-strategy',
    title: 'Internal Linking Strategy: The Most Underused SEO Lever',
    excerpt: 'Most sites either ignore internal linking or do it randomly. A structured internal linking strategy distributes authority, boosts rankings, and costs nothing.',
    category: 'SEO',
    author: 'PageIQ Team',
    date: '2024-01-30',
    readTime: '6 min read',
    featured: false,
    coverEmoji: '🕸️',
    content: `
<p>Internal links are links between pages on your own site. They serve three purposes: they help users navigate, they help Google discover and crawl your pages, and they distribute "link equity" — the authority passed between pages.</p>

<h2>Why Most Internal Linking Is Wasted</h2>
<p>The typical approach is to add a few "related posts" links at the bottom of articles. This is better than nothing, but it misses the strategic opportunity. The highest-value internal links are contextual — links placed within the body of content, with descriptive anchor text, pointing to your most important pages.</p>

<h2>The Three Internal Linking Priorities</h2>
<ol>
  <li><strong>Link from high-traffic pages to conversion pages.</strong> Find your most-visited posts and ensure they link to the pages you want to rank and convert.</li>
  <li><strong>Link cluster content to pillar pages.</strong> Every supporting article in a topical cluster should link back to the main pillar with descriptive anchor text.</li>
  <li><strong>Fix orphan pages.</strong> Pages with no internal links pointing to them are effectively invisible to Google. Run a regular audit to find and fix these.</li>
</ol>
    `,
  },
  {
    slug: 'url-structure-seo-best-practices',
    title: 'URL Structure for SEO: Simple Rules That Most Sites Still Get Wrong',
    excerpt: 'A bad URL structure costs you rankings quietly. No error messages, no penalties — just pages that rank lower than they should. Here\'s the checklist.',
    category: 'SEO',
    author: 'PageIQ Team',
    date: '2024-01-22',
    readTime: '4 min read',
    featured: false,
    coverEmoji: '🔍',
    content: `
<p>URL structure is one of those SEO fundamentals that people set up once and forget. But a poorly structured URL can limit how well a page ranks — and migrating URLs later is painful.</p>

<h2>The Core Rules</h2>
<ul>
  <li><strong>Use hyphens, not underscores.</strong> Google treats hyphens as word separators. Underscores join words. <code>seo-guide</code> is readable as "seo guide". <code>seo_guide</code> reads as "seo_guide".</li>
  <li><strong>Keep URLs short.</strong> Shorter URLs are easier to share, easier to remember, and slightly preferred by Google. Remove stop words (the, a, and, or).</li>
  <li><strong>Include the primary keyword.</strong> The URL slug should reflect the page's main topic. <code>/blog/eeat-seo-guide</code> is better than <code>/blog/post-1234</code>.</li>
  <li><strong>Use lowercase only.</strong> Uppercase URLs can create duplicate content issues.</li>
  <li><strong>Avoid deep nesting.</strong> More than 3 levels deep (<code>/a/b/c/d/page</code>) makes crawling harder and distributes authority poorly.</li>
</ul>
    `,
  },
];
