const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Skill Prompts ────────────────────────────────────────────────────────────

const SKILL_PROMPTS = {
  eeat: {
    name: "E-E-A-T Audit",
    prompt: (content, url) => `
You are an expert SEO auditor specializing in Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines.

Analyze the following webpage content from ${url} and provide a detailed E-E-A-T audit.

CONTENT:
${content}

Provide your audit in this exact JSON format:
{
  "score": <overall score 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "experience": {
    "score": <0-100>,
    "findings": ["<finding 1>", "<finding 2>"],
    "recommendations": ["<rec 1>", "<rec 2>"]
  },
  "expertise": {
    "score": <0-100>,
    "findings": ["<finding 1>", "<finding 2>"],
    "recommendations": ["<rec 1>", "<rec 2>"]
  },
  "authoritativeness": {
    "score": <0-100>,
    "findings": ["<finding 1>", "<finding 2>"],
    "recommendations": ["<rec 1>", "<rec 2>"]
  },
  "trustworthiness": {
    "score": <0-100>,
    "findings": ["<finding 1>", "<finding 2>"],
    "recommendations": ["<rec 1>", "<rec 2>"]
  },
  "priority_fixes": ["<top fix 1>", "<top fix 2>", "<top fix 3>"]
}

Return ONLY valid JSON, no markdown or explanation.`
  },

  rewrite: {
    name: "AI Content Rewrite",
    prompt: (content, url) => `
You are an expert content strategist specializing in optimizing content for AI search engines (Google SGE, Perplexity AI, ChatGPT, Gemini).

Rewrite the following content from ${url} to be optimized for AI search visibility.

ORIGINAL CONTENT:
${content}

Optimization goals:
- Clear, direct answers to implied questions
- Proper use of semantic HTML structure (H1, H2, H3)
- Short, scannable paragraphs (2-3 sentences max)
- Include definitive statements AI can cite
- Add transition phrases that signal factual content
- Conversational but authoritative tone

Provide your response in this exact JSON format:
{
  "summary": "<what was changed and why>",
  "rewritten_content": "<the full rewritten content in plain text with markdown headings>",
  "key_changes": ["<change 1>", "<change 2>", "<change 3>"],
  "ai_readability_score": <0-100>,
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  schema: {
    name: "Schema Markup",
    prompt: (content, url) => `
You are a structured data expert specializing in JSON-LD schema markup for SEO.

Analyze the following content from ${url} and generate appropriate JSON-LD schema markup.

CONTENT:
${content}

Generate the most relevant schema types (Article, FAQPage, HowTo, Organization, BreadcrumbList, WebPage, etc.)

Provide your response in this exact JSON format:
{
  "summary": "<which schemas were generated and why>",
  "schemas": [
    {
      "type": "<schema type e.g. Article>",
      "json_ld": <the complete JSON-LD object>,
      "placement": "<where to add this - head or body>"
    }
  ],
  "implementation_notes": ["<note 1>", "<note 2>"],
  "missing_data": ["<data point 1 that would improve the schema>"]
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  querymap: {
    name: "Conversational Query Map",
    prompt: (content, url) => `
You are a conversational search expert specializing in voice search and AI query optimization.

Analyze the following content from ${url} and create a comprehensive conversational query map.

CONTENT:
${content}

Identify all questions this content should target including:
- "What is..." questions
- "How to..." questions
- "Why does..." questions
- "Best way to..." questions
- Comparison queries
- Voice search queries

Provide your response in this exact JSON format:
{
  "summary": "<overview of query opportunities found>",
  "primary_queries": [
    { "query": "<question>", "intent": "<informational|navigational|transactional>", "priority": "<high|medium|low>" }
  ],
  "voice_search_queries": ["<query 1>", "<query 2>", "<query 3>"],
  "featured_snippet_opportunities": [
    { "query": "<question>", "recommended_format": "<paragraph|list|table>", "current_coverage": "<covered|partial|missing>" }
  ],
  "missing_queries": ["<query your content doesn't answer but should>"],
  "total_opportunity_score": <0-100>
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  entities: {
    name: "Entity Coverage",
    prompt: (content, url) => `
You are a semantic SEO expert specializing in entity-based optimization and knowledge graph optimization.

Analyze the following content from ${url} for entity coverage.

CONTENT:
${content}

Identify all entities present and missing:
- People, Organizations, Locations
- Concepts, Topics, Products
- Events, Dates
- Relationships between entities

Provide your response in this exact JSON format:
{
  "summary": "<entity coverage assessment>",
  "covered_entities": [
    { "entity": "<name>", "type": "<Person|Organization|Concept|Product|Location>", "mentions": <count>, "prominence": "<primary|secondary|mention>" }
  ],
  "missing_entities": [
    { "entity": "<name>", "type": "<type>", "reason": "<why this entity should be included>" }
  ],
  "entity_relationships": ["<entity A> is related to <entity B> via <relationship>"],
  "topic_coverage_score": <0-100>,
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"]
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  brief: {
    name: "Content Brief",
    prompt: (content, url) => `
You are a senior content strategist creating a comprehensive content brief for improving an existing page.

Analyze the following content from ${url} and create a full content brief.

CONTENT:
${content}

Provide your response in this exact JSON format:
{
  "summary": "<brief overview and content goal>",
  "target_audience": "<who this content is for>",
  "primary_keyword": "<main keyword to target>",
  "secondary_keywords": ["<kw 1>", "<kw 2>", "<kw 3>"],
  "recommended_word_count": <number>,
  "content_structure": [
    { "section": "<H1/H2/H3>", "heading": "<suggested heading>", "notes": "<what to cover in this section>" }
  ],
  "must_include": ["<fact/point 1>", "<fact/point 2>"],
  "avoid": ["<topic to avoid 1>"],
  "tone": "<professional|conversational|technical|friendly>",
  "cta_recommendations": ["<CTA 1>", "<CTA 2>"],
  "competitive_gaps": ["<gap 1>", "<gap 2>"]
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  meta: {
    name: "Title & Description",
    prompt: (content, url) => `
You are a conversion-focused SEO copywriter specializing in meta tags that maximize click-through rates.

Analyze the following content from ${url} and generate optimized title tags and meta descriptions.

CONTENT:
${content}

Generate multiple variations optimized for:
- CTR (click-through rate)
- AI search snippets
- Featured snippets
- Mobile display

Provide your response in this exact JSON format:
{
  "summary": "<current meta assessment and optimization strategy>",
  "current_issues": ["<issue 1>", "<issue 2>"],
  "title_tags": [
    { "title": "<title text>", "length": <char count>, "type": "<CTR-focused|Keyword-focused|Question-based>", "score": <0-100> }
  ],
  "meta_descriptions": [
    { "description": "<meta description text>", "length": <char count>, "type": "<Action-focused|Question-based|Benefit-focused>", "score": <0-100> }
  ],
  "recommended_combination": {
    "title": "<best title>",
    "description": "<best description>",
    "reasoning": "<why this combination works best>"
  },
  "open_graph": {
    "og_title": "<OG title>",
    "og_description": "<OG description>"
  }
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  linking: {
    name: "Internal Linking Map",
    prompt: (content, url) => `
You are an internal linking strategist specializing in site architecture and PageRank flow optimization.

Analyze the following content from ${url} and create an internal linking strategy.

CONTENT:
${content}

Provide your response in this exact JSON format:
{
  "summary": "<internal linking assessment>",
  "page_type": "<pillar|cluster|landing|blog|product>",
  "link_opportunities": [
    { "anchor_text": "<suggested anchor>", "target_topic": "<what page this should link to>", "placement": "<where in the content>", "priority": "<high|medium|low>" }
  ],
  "pages_that_should_link_here": [
    { "topic": "<topic of page that should link here>", "reason": "<why>" }
  ],
  "orphan_risk": "<low|medium|high>",
  "silo_recommendations": ["<silo rec 1>", "<silo rec 2>"],
  "anchor_text_diversity": "<assessment of anchor text variety needed>"
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  topical: {
    name: "Topical Authority Cluster",
    prompt: (content, url) => `
You are a topical authority strategist specializing in content cluster architecture for AI-era SEO.

Analyze the following content from ${url} and design a topical authority cluster.

CONTENT:
${content}

Provide your response in this exact JSON format:
{
  "summary": "<topical authority assessment>",
  "main_topic": "<the core topic of this content>",
  "pillar_page_recommendation": {
    "topic": "<pillar page topic>",
    "is_current_page_the_pillar": <true|false>,
    "notes": "<notes on pillar structure>"
  },
  "cluster_pages": [
    { "topic": "<subtopic>", "suggested_title": "<page title>", "word_count": <recommended words>, "relationship": "<supports|extends|complements>" }
  ],
  "content_gaps": ["<missing subtopic 1>", "<missing subtopic 2>"],
  "topical_authority_score": <0-100>,
  "quick_wins": ["<content you can create immediately>"],
  "long_term_strategy": "<3-6 month content roadmap summary>"
}

Return ONLY valid JSON, no markdown code blocks.`
  },

  citation: {
    name: "AI Citation Optimizer",
    prompt: (content, url) => `
You are an AI citation optimization specialist who helps content get cited inside ChatGPT, Perplexity AI, Google SGE, and Gemini responses.

Analyze the following content from ${url} and optimize it for AI citations.

CONTENT:
${content}

Provide your response in this exact JSON format:
{
  "summary": "<AI citation potential assessment>",
  "citation_score": <0-100>,
  "citation_triggers": ["<phrase/pattern that makes AI engines cite this>"],
  "optimized_passages": [
    { "original": "<original text>", "optimized": "<rewritten for AI citation>", "reason": "<why this change helps>" }
  ],
  "missing_citation_signals": ["<signal 1>", "<signal 2>"],
  "best_citation_format": "<paragraph|list|definition|statistic>",
  "ai_engine_specific": {
    "perplexity": "<specific tip for Perplexity AI>",
    "chatgpt": "<specific tip for ChatGPT>",
    "google_sge": "<specific tip for Google SGE>"
  },
  "action_items": ["<action 1>", "<action 2>", "<action 3>"]
}

Return ONLY valid JSON, no markdown code blocks.`
  }
};

// ─── Helper: Fetch URL Content ────────────────────────────────────────────────

async function fetchPageContent(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AI-SEO-Tool/1.0)"
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);

  const html = await response.text();

  // Strip HTML tags and extract readable text
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000); // Limit to 8k chars for API efficiency

  return text;
}

// ─── Helper: Run a Single Skill ───────────────────────────────────────────────

async function runSkill(skillKey, content, url) {
  const skill = SKILL_PROMPTS[skillKey];
  if (!skill) throw new Error(`Unknown skill: ${skillKey}`);

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: skill.prompt(content, url)
      }
    ]
  });

  const text = message.content[0].text.trim();

  // Parse JSON response
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON if wrapped in markdown
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    throw new Error("Failed to parse skill response as JSON");
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { url, skills } = JSON.parse(event.body || "{}");

    if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: "URL is required" }) };
    if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }) };

    // Fetch page content
    let pageContent;
    try {
      pageContent = await fetchPageContent(url);
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: `Could not fetch URL: ${e.message}` }) };
    }

    if (!pageContent || pageContent.length < 50) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Page content too short or empty" }) };
    }

    // Determine which skills to run
    const skillsToRun = skills && skills.length > 0 ? skills : Object.keys(SKILL_PROMPTS);

    // Run skills sequentially to avoid rate limits
    const results = {};
    for (const skillKey of skillsToRun) {
      try {
        results[skillKey] = {
          name: SKILL_PROMPTS[skillKey]?.name || skillKey,
          status: "success",
          data: await runSkill(skillKey, pageContent, url)
        };
      } catch (e) {
        results[skillKey] = {
          name: SKILL_PROMPTS[skillKey]?.name || skillKey,
          status: "error",
          error: e.message
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url,
        analyzed_at: new Date().toISOString(),
        content_length: pageContent.length,
        results
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message })
    };
  }
};
