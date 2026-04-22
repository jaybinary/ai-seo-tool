// ── PageIQ — Generate Blog Brief ─────────────────────────────────────────────
// POST /api/generate-brief
// Accepts audit snapshot + optional keyword/audience
// Calls Claude claude-sonnet-4-6 and returns a structured blog brief as JSON
// Future-ready: Ahrefs fields are stubbed as null, ready to be enriched

exports.handler.timeout = 26;

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
        max_tokens: 2000,
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
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let brief;
    try {
      brief = JSON.parse(cleaned);
    } catch {
      // Fallback: extract the first { ... } block from the response
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try { brief = JSON.parse(match[0]); }
        catch {
          console.error('JSON parse failed even after extraction. Raw:', raw.slice(0, 500));
          return { statusCode: 502, headers, body: JSON.stringify({ error: 'Failed to parse AI response. Try again.' }) };
        }
      } else {
        console.error('No JSON object found in response. Raw:', raw.slice(0, 500));
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'Failed to parse AI response. Try again.' }) };
      }
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
// skillStates shape: { querymap: { status, data: {...}, error }, eeat: { status, data, error }, ... }
// So we always access snap[skill].data to get the actual result
function buildContext(url, keyword, audience, snap) {
  const lines = [`URL: ${url}`];

  if (keyword)  lines.push(`Target Keyword (user-provided): ${keyword}`);
  if (audience) lines.push(`Target Audience (user-provided): ${audience}`);

  lines.push('\n── AUDIT SNAPSHOT ──');

  // Helper: safely get the .data payload of a skill
  const d = (key) => snap?.[key]?.data || {};

  const meta      = d('meta');
  const querymap  = d('querymap');
  const entities  = d('entities');
  const brief     = d('brief');
  const topical   = d('topical');
  const linking   = d('linking');
  const eeat      = d('eeat');

  if (meta.title)       lines.push(`Page Title: ${meta.title}`);
  if (meta.description) lines.push(`Meta Description: ${meta.description}`);

  if (querymap.primary_queries?.length) {
    lines.push('\nTop User Queries:');
    querymap.primary_queries.slice(0, 8).forEach(q =>
      lines.push(`  - "${q.query}" [${q.intent}] (${q.priority})`)
    );
  }

  if (querymap.featured_snippet_opportunities?.length) {
    lines.push('\nFeatured Snippet Opportunities:');
    querymap.featured_snippet_opportunities.slice(0, 4).forEach(o =>
      lines.push(`  - "${o.query}" → ${o.recommended_format} format (${o.current_coverage})`)
    );
  }

  if (querymap.missing_queries?.length) {
    lines.push(`\nMissing Queries (content gaps): ${querymap.missing_queries.slice(0, 6).join(', ')}`);
  }

  if (entities.entities?.length) {
    lines.push('\nKey Entities Found:');
    entities.entities.slice(0, 10).forEach(e =>
      lines.push(`  - ${e.name} (${e.type}) — ${e.relevance || 'relevant'}`)
    );
  }

  if (entities.missing_entities?.length) {
    lines.push(`\nEntity Gaps (not covered): ${entities.missing_entities.slice(0, 6).join(', ')}`);
  }

  if (brief.recommended_structure) {
    lines.push('\nContent Brief Summary:');
    lines.push(JSON.stringify(brief.recommended_structure).slice(0, 600));
  }

  if (topical.clusters?.length) {
    lines.push('\nTopical Clusters:');
    topical.clusters.slice(0, 4).forEach(c =>
      lines.push(`  - ${c.name || c.topic}: ${(c.subtopics || []).slice(0, 3).join(', ')}`)
    );
  }

  if (linking.internal_link_opportunities?.length) {
    lines.push('\nInternal Link Opportunities (from audit):');
    linking.internal_link_opportunities.slice(0, 5).forEach(l =>
      lines.push(`  - Anchor: "${l.anchor_text}" → ${l.target_url}`)
    );
  }

  if (eeat.priority_fixes?.length) {
    lines.push(`\nE-E-A-T Priority Fixes: ${eeat.priority_fixes.slice(0, 3).join('; ')}`);
  }

  lines.push('\n── END AUDIT SNAPSHOT ──');
  lines.push('\nGenerate the blog brief now. Return ONLY valid JSON matching the schema.');

  return lines.join('\n');
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an SEO content strategist. Generate a concise blog brief from audit data.

RULES:
- Return ONLY valid JSON, no markdown fences, no extra text
- Be specific and actionable, never vague
- Keep all string values short (under 20 words each)

OUTPUT THIS EXACT JSON (no extra fields, no omissions):
{
  "targetKeyword": "primary keyword",
  "secondaryKeywords": ["kw1", "kw2", "kw3"],
  "searchIntent": "informational|transactional|navigational|commercial",
  "recommendedWordCount": 1500,
  "titles": [
    "Title option 1",
    "Title option 2",
    "Title option 3"
  ],
  "outline": {
    "h1": "H1 heading",
    "intro": "What the intro covers in one sentence",
    "h2s": [
      {"heading": "H2 text", "note": "key point to cover"},
      {"heading": "H2 text", "note": "key point to cover"},
      {"heading": "H2 text", "note": "key point to cover"},
      {"heading": "H2 text", "note": "key point to cover"}
    ],
    "conclusion": "What conclusion covers"
  },
  "faqs": [
    {"q": "Question 1?", "hint": "Answer should cover..."},
    {"q": "Question 2?", "hint": "Answer should cover..."},
    {"q": "Question 3?", "hint": "Answer should cover..."}
  ],
  "mustIncludeEntities": ["entity1", "entity2", "entity3", "entity4"],
  "internalLinks": [
    {"anchor": "anchor text", "page": "page type"},
    {"anchor": "anchor text", "page": "page type"}
  ],
  "cta": "Primary CTA copy for end of article",
  "tone": "professional|conversational|authoritative|educational",
  "differentiator": "How this article beats competitors in one sentence"
}`;
