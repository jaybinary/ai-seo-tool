// ── PageIQ — Generate Blog Brief ─────────────────────────────────────────────
// POST /api/generate-brief
// Accepts audit snapshot + optional keyword/audience
// Calls Claude claude-sonnet-4-6 and returns a structured blog brief as JSON
// Future-ready: Ahrefs fields are stubbed as null, ready to be enriched

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  const { url, keyword = '', audience = '', auditSnapshot = {} } = body;
  if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required' }) };

  // ── Build audit context from available skills ────────────────────────────
  const ctx = buildContext(url, keyword, audience, auditSnapshot);

  // ── Call Claude ──────────────────────────────────────────────────────────
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }) };
  }

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 3500,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: ctx }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Claude API error:', errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service error. Try again.' }) };
    }

    const claudeData = await claudeRes.json();
    const raw = claudeData.content?.[0]?.text || '';

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    let brief;
    try { brief = JSON.parse(cleaned); }
    catch {
      console.error('JSON parse failed. Raw:', raw);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Failed to parse AI response. Try again.' }) };
    }

    // ── Stub Ahrefs placeholders (enrich later) ──────────────────────────
    brief.ahrefs = {
      keywordVolume:    null,   // TODO: enrich via Ahrefs API
      keywordDifficulty: null,  // TODO: enrich via Ahrefs API
      competitorUrls:   [],     // TODO: enrich via Ahrefs API
    };

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, brief }) };

  } catch (err) {
    console.error('generate-brief error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Unexpected error. Please try again.' }) };
  }
};

// ── Context builder ───────────────────────────────────────────────────────────
function buildContext(url, keyword, audience, snap) {
  const s = snap;
  const lines = [`URL: ${url}`];

  if (keyword)  lines.push(`Target Keyword (user-provided): ${keyword}`);
  if (audience) lines.push(`Target Audience (user-provided): ${audience}`);

  lines.push('\n── AUDIT SNAPSHOT ──');

  if (s.meta?.title)       lines.push(`Page Title: ${s.meta.title}`);
  if (s.meta?.description) lines.push(`Meta Description: ${s.meta.description}`);

  if (s.querymap?.primary_queries?.length) {
    lines.push('\nTop User Queries:');
    s.querymap.primary_queries.slice(0, 8).forEach(q =>
      lines.push(`  - "${q.query}" [${q.intent}] (${q.priority})`)
    );
  }

  if (s.querymap?.featured_snippet_opportunities?.length) {
    lines.push('\nFeatured Snippet Opportunities:');
    s.querymap.featured_snippet_opportunities.slice(0, 4).forEach(o =>
      lines.push(`  - "${o.query}" → ${o.recommended_format} format (${o.current_coverage})`)
    );
  }

  if (s.querymap?.missing_queries?.length) {
    lines.push(`\nMissing Queries (content gaps): ${s.querymap.missing_queries.slice(0, 6).join(', ')}`);
  }

  if (s.entities?.entities?.length) {
    lines.push('\nKey Entities Found:');
    s.entities.entities.slice(0, 10).forEach(e =>
      lines.push(`  - ${e.name} (${e.type}) — ${e.relevance || 'relevant'}`)
    );
  }

  if (s.entities?.missing_entities?.length) {
    lines.push(`\nEntity Gaps (not covered): ${s.entities.missing_entities.slice(0, 6).join(', ')}`);
  }

  if (s.brief?.recommended_structure) {
    lines.push('\nContent Brief Summary:');
    lines.push(JSON.stringify(s.brief.recommended_structure).slice(0, 600));
  }

  if (s.topical?.clusters?.length) {
    lines.push('\nTopical Clusters:');
    s.topical.clusters.slice(0, 4).forEach(c =>
      lines.push(`  - ${c.name || c.topic}: ${(c.subtopics || []).slice(0, 3).join(', ')}`)
    );
  }

  if (s.linking?.internal_link_opportunities?.length) {
    lines.push('\nInternal Link Opportunities (from audit):');
    s.linking.internal_link_opportunities.slice(0, 5).forEach(l =>
      lines.push(`  - Anchor: "${l.anchor_text}" → ${l.target_url}`)
    );
  }

  if (s.eeat?.priority_fixes?.length) {
    lines.push(`\nE-E-A-T Priority Fixes: ${s.eeat.priority_fixes.slice(0, 3).join('; ')}`);
  }

  lines.push('\n── END AUDIT SNAPSHOT ──');
  lines.push('\nGenerate the blog brief now. Return ONLY valid JSON matching the schema.');

  return lines.join('\n');
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert SEO content strategist and blog architect with 10+ years of experience creating high-ranking content. Your job is to generate a structured, copy-ready blog brief based on SEO audit data.

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no code fences, no explanation text whatsoever
2. Every string value must be complete, specific, and actionable — never vague
3. Derive the target keyword from the audit data if not explicitly provided
4. All title options must be unique angles — not variations of the same title
5. The H2 structure must flow logically and cover the full topic
6. FAQs must come from real user queries in the query map
7. Internal link suggestions must reference plausible page types on the same domain
8. Content length must be justified by topic complexity and search intent

OUTPUT JSON SCHEMA (return exactly this structure, fully populated):
{
  "targetKeyword": "primary keyword string",
  "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4"],
  "searchIntent": "informational | transactional | navigational | commercial",
  "intentExplanation": "1-2 sentence explanation of why this intent and what the reader needs",
  "recommendedLength": {
    "min": 1200,
    "ideal": 1800,
    "max": 2400,
    "rationale": "why this length"
  },
  "titleOptions": [
    { "title": "...", "angle": "why this works", "emotion": "curiosity|urgency|authority|value" },
    { "title": "...", "angle": "...", "emotion": "..." },
    { "title": "...", "angle": "...", "emotion": "..." },
    { "title": "...", "angle": "...", "emotion": "..." },
    { "title": "...", "angle": "...", "emotion": "..." }
  ],
  "outline": {
    "h1": "recommended H1 (can match best title or be slightly different)",
    "intro": "2-sentence description of what the intro should cover",
    "sections": [
      {
        "h2": "Section heading",
        "purpose": "what this section achieves for the reader",
        "wordCount": 200,
        "h3s": ["Sub-heading 1", "Sub-heading 2"],
        "writingNotes": "tone, angle, or data to include"
      }
    ],
    "conclusion": "what the conclusion should summarise and lead into"
  },
  "faqSection": [
    { "question": "Real user question", "answerHint": "key points the answer should cover", "source": "query map | entity gap | common knowledge" },
    { "question": "...", "answerHint": "...", "source": "..." },
    { "question": "...", "answerHint": "...", "source": "..." },
    { "question": "...", "answerHint": "...", "source": "..." }
  ],
  "entityCoverage": [
    { "entity": "entity name", "type": "concept|tool|person|brand|place|metric", "priority": "must-include|should-include|nice-to-have", "context": "how/where to mention it" },
    { "entity": "...", "type": "...", "priority": "...", "context": "..." }
  ],
  "internalLinks": [
    { "anchorText": "suggested anchor text", "targetPageType": "e.g. pricing page, audit results, glossary", "placement": "where in the article", "reason": "why this link adds value" },
    { "anchorText": "...", "targetPageType": "...", "placement": "...", "reason": "..." }
  ],
  "ctaIdeas": [
    { "cta": "CTA copy", "placement": "intro|mid-article|end|sidebar", "goal": "conversion goal", "style": "button|inline link|banner" },
    { "cta": "...", "placement": "...", "goal": "...", "style": "..." },
    { "cta": "...", "placement": "...", "goal": "...", "style": "..." }
  ],
  "toneAndVoice": {
    "recommended": "professional|conversational|authoritative|educational",
    "avoid": "what tone to avoid",
    "examples": ["phrase example 1", "phrase example 2"]
  },
  "competitorAngle": "How this article should differentiate from typical content on this topic"
}`;
