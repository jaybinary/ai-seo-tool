// Shared SKILLS array and COLORS — used by Audit page and anywhere else

export const SKILLS = [
  { key: 'eeat',        name: 'E-E-A-T Audit',              icon: '🏆', action: 'Audit E-E-A-T',      desc: 'See if Google trusts your page as a credible, expert source' },
  { key: 'rewrite',     name: 'AI Content Rewrite',          icon: '✍️', action: 'Rewrite Content',    desc: 'Get your content rewritten to rank better in AI-powered search' },
  { key: 'schema',      name: 'Schema Markup',               icon: '🗂️', action: 'Generate Schema',    desc: 'Auto-generate code that helps Google show rich results for your page' },
  { key: 'querymap',    name: 'Conversational Query Map',    icon: '💬', action: 'Map Queries',         desc: 'Find the exact questions people ask that your page should answer' },
  { key: 'entities',    name: 'Entity Coverage',             icon: '🔗', action: 'Check Entities',     desc: 'Discover key topics & people your page is missing to rank higher' },
  { key: 'brief',       name: 'Content Brief',               icon: '📋', action: 'Create Brief',       desc: 'Get a writer-ready outline to improve or expand your existing page' },
  { key: 'meta',        name: 'Title & Description',         icon: '🏷️', action: 'Optimize Meta',      desc: 'Get better page titles and descriptions that drive more clicks' },
  { key: 'linking',     name: 'Internal Linking Map',        icon: '🕸️', action: 'Map Links',          desc: 'Find which pages on your site should link to each other for SEO' },
  { key: 'topical',     name: 'Topical Authority Cluster',   icon: '📊', action: 'Build Cluster',      desc: 'Plan a content strategy that makes your site the go-to on your topic' },
  { key: 'citation',    name: 'AI Citation Optimizer',       icon: '🤖', action: 'Optimize Citations', desc: 'Make your page more likely to be quoted by ChatGPT and Perplexity' },
  { key: 'urlstructure',name: 'URL & Structure Audit',       icon: '🔍', action: 'Audit URL',          desc: 'Check if your page URL and site structure are set up correctly' },
];

export const COLORS = {
  eeat:         '#6366f1',
  rewrite:      '#8b5cf6',
  schema:       '#ec4899',
  querymap:     '#f59e0b',
  entities:     '#10b981',
  brief:        '#3b82f6',
  meta:         '#ef4444',
  linking:      '#14b8a6',
  topical:      '#f97316',
  citation:     '#06b6d4',
  urlstructure: '#0f766e',
};
