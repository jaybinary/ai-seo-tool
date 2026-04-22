// ── PageIQ — Write Full Article ───────────────────────────────────────────────
// POST /api/write-article
// Accepts a blog brief + brand context, returns a full SEO article draft

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

  const { brief, brandName = '', country = 'India', audience = '', ctaGoal = '' } = body;
  if (!brief) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Brief is required' }) };

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }) };
  }

  const context = buildPrompt(brief, brandName, country, audience, ctaGoal);

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: context }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Claude API error:', errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service error. Try again.' }) };
    }

    const claudeData = await claudeRes.json();
    const raw = claudeData.content?.[0]?.text || '';

    // Parse the structured sections from the response
    const article = parseArticle(raw);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, article }) };

  } catch (err) {
    console.error('write-article error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Unexpected error. Please try again.' }) };
  }
};

// ── Prompt builder ────────────────────────────────────────────────────────────
function buildPrompt(brief, brandName, country, audience, ctaGoal) {
  const lines = [];

  lines.push('BLOG BRIEF:');
  lines.push(`Target Keyword: ${brief.targetKeyword}`);
  lines.push(`Secondary Keywords: ${(brief.secondaryKeywords || []).join(', ')}`);
  lines.push(`Search Intent: ${brief.searchIntent}`);
  lines.push(`Recommended Word Count: ${brief.recommendedWordCount || 1500}`);
  lines.push('');

  lines.push(`H1: ${brief.outline?.h1}`);
  lines.push(`Intro direction: ${brief.outline?.intro}`);
  lines.push('');

  lines.push('H2 SECTIONS:');
  (brief.outline?.h2s || []).forEach((s, i) => {
    lines.push(`  ${i + 1}. ${s.heading} — ${s.note}`);
  });
  lines.push('');

  lines.push(`Conclusion direction: ${brief.outline?.conclusion}`);
  lines.push('');

  if (brief.faqs?.length) {
    lines.push('FAQs TO ANSWER:');
    brief.faqs.forEach(f => lines.push(`  Q: ${f.q} | Hint: ${f.hint}`));
    lines.push('');
  }

  if (brief.mustIncludeEntities?.length) {
    lines.push(`Must-include entities: ${brief.mustIncludeEntities.join(', ')}`);
    lines.push('');
  }

  if (brief.internalLinks?.length) {
    lines.push('Internal link opportunities:');
    brief.internalLinks.forEach(l => lines.push(`  - "${l.anchor}" → ${l.page}`));
    lines.push('');
  }

  lines.push(`CTA: ${brief.cta || ctaGoal || 'Contact us for a free consultation'}`);
  lines.push(`Tone: ${brief.tone || 'professional'}`);
  lines.push(`Differentiator: ${brief.differentiator || ''}`);
  lines.push('');

  lines.push('BRAND CONTEXT:');
  if (brandName) lines.push(`Brand name: ${brandName}`);
  if (country)   lines.push(`Country/market: ${country}`);
  if (audience)  lines.push(`Target audience: ${audience}`);
  if (ctaGoal)   lines.push(`CTA goal: ${ctaGoal}`);

  return lines.join('\n');
}

// ── Response parser ───────────────────────────────────────────────────────────
function parseArticle(raw) {
  // Split by section markers and return structured object
  const extract = (marker, nextMarker) => {
    const start = raw.indexOf(marker);
    if (start === -1) return '';
    const contentStart = start + marker.length;
    const end = nextMarker ? raw.indexOf(nextMarker, contentStart) : raw.length;
    return (end === -1 ? raw.slice(contentStart) : raw.slice(contentStart, end)).trim();
  };

  return {
    seoTitle:      extract('## SEO TITLE\n', '## META DESCRIPTION'),
    metaDesc:      extract('## META DESCRIPTION\n', '## SLUG'),
    slug:          extract('## SLUG\n', '## ARTICLE'),
    articleMd:     extract('## ARTICLE\n', '## SCHEMA TYPE'),
    schemaType:    extract('## SCHEMA TYPE\n', '## EDITOR NOTES'),
    editorNotes:   extract('## EDITOR NOTES\n', null),
    raw,
  };
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert SEO strategist, content editor, and conversion copywriter. Generate a high-quality SEO article draft based on the structured blog brief provided.

WRITING RULES:
- Follow the provided brief exactly — use the H1, H2s, and outline as your structure
- Use the target keyword naturally in the title, first paragraph, at least 2 H2s, and conclusion
- Use secondary keywords naturally without stuffing
- Cover ALL required entities — weave them naturally into the content
- Maintain a professional, trustworthy, human tone
- Avoid fluff, repetition, and generic filler sentences
- Do not overuse promotional language
- Keep paragraphs to 2-4 sentences max for readability
- Use proper heading hierarchy (H1 → H2 → H3 where needed)
- Include FAQ answers at the end
- End with a soft CTA in the conclusion
- Make the article feel human-written and genuinely useful
- Optimise for both traditional search and AI search (clear definitions, direct answers, structured content)
- Aim for the recommended word count from the brief

OUTPUT FORMAT (use EXACTLY these section markers):
## SEO TITLE
[SEO-optimised title tag, 50-60 characters]

## META DESCRIPTION
[Compelling meta description, 140-155 characters, includes target keyword]

## SLUG
[url-friendly-slug-here]

## ARTICLE
[Full article in markdown — use # for H1, ## for H2, ### for H3]

## SCHEMA TYPE
[Recommended schema: Article | HowTo | FAQPage | LocalBusiness | etc.]

## EDITOR NOTES
[2-4 bullet points: what to customise, what images to add, any caveats]`;
