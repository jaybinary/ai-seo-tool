// Uses native fetch (Node 18+) — no SDK dependency needed

const SKILL_PROMPTS = {
  eeat: {
    name: "E-E-A-T Audit",
    prompt: (content, url) => `You are an expert SEO auditor specializing in Google's E-E-A-T guidelines. Analyze this webpage content from ${url} and provide a detailed E-E-A-T audit. Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{"score":<0-100>,"summary":"<2-3 sentence summary>","experience":{"score":<0-100>,"findings":["<f1>","<f2>"],"recommendations":["<r1>","<r2>"]},"expertise":{"score":<0-100>,"findings":["<f1>","<f2>"],"recommendations":["<r1>","<r2>"]},"authoritativeness":{"score":<0-100>,"findings":["<f1>","<f2>"],"recommendations":["<r1>","<r2>"]},"trustworthiness":{"score":<0-100>,"findings":["<f1>","<f2>"],"recommendations":["<r1>","<r2>"]},"priority_fixes":["<fix1>","<fix2>","<fix3>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  rewrite: {
    name: "AI Content Rewrite",
    prompt: (content, url) => `You are an expert content strategist optimizing content for AI search engines (SGE, Perplexity, ChatGPT). Rewrite this content from ${url} for AI search visibility. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<what changed>","rewritten_content":"<rewritten text>","key_changes":["<c1>","<c2>","<c3>"],"ai_readability_score":<0-100>,"improvements":["<i1>","<i2>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  schema: {
    name: "Schema Markup",
    prompt: (content, url) => `You are a structured data expert. Generate JSON-LD schema markup for this content from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<which schemas generated>","schemas":[{"type":"<schema type>","json_ld":{"@context":"https://schema.org","@type":"<type>"},"placement":"<head or body>"}],"implementation_notes":["<n1>","<n2>"],"missing_data":["<d1>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  querymap: {
    name: "Conversational Query Map",
    prompt: (content, url) => `You are a conversational search expert. Create a query map for this content from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<overview>","primary_queries":[{"query":"<q>","intent":"<informational|navigational|transactional>","priority":"<high|medium|low>"}],"voice_search_queries":["<q1>","<q2>","<q3>"],"featured_snippet_opportunities":[{"query":"<q>","recommended_format":"<paragraph|list|table>","current_coverage":"<covered|partial|missing>"}],"missing_queries":["<q1>","<q2>"],"total_opportunity_score":<0-100>}
CONTENT: ${content.slice(0, 3000)}`
  },
  entities: {
    name: "Entity Coverage",
    prompt: (content, url) => `You are a semantic SEO expert. Analyze entity coverage for this content from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<assessment>","covered_entities":[{"entity":"<name>","type":"<Person|Organization|Concept|Product|Location>","mentions":<count>,"prominence":"<primary|secondary|mention>"}],"missing_entities":[{"entity":"<name>","type":"<type>","reason":"<why include>"}],"entity_relationships":["<entity A> relates to <entity B>"],"topic_coverage_score":<0-100>,"recommendations":["<r1>","<r2>","<r3>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  brief: {
    name: "Content Brief",
    prompt: (content, url) => `You are a senior content strategist. Create a content brief for improving this page from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<brief overview>","target_audience":"<who>","primary_keyword":"<keyword>","secondary_keywords":["<kw1>","<kw2>","<kw3>"],"recommended_word_count":<number>,"content_structure":[{"section":"<H1|H2|H3>","heading":"<heading>","notes":"<what to cover>"}],"must_include":["<point1>","<point2>"],"avoid":["<topic1>"],"tone":"<professional|conversational|technical>","cta_recommendations":["<cta1>","<cta2>"],"competitive_gaps":["<gap1>","<gap2>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  meta: {
    name: "Title & Description",
    prompt: (content, url) => `You are a conversion-focused SEO copywriter. Generate optimized meta tags for this content from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<assessment>","current_issues":["<issue1>","<issue2>"],"title_tags":[{"title":"<title>","length":<chars>,"type":"<CTR-focused|Keyword-focused|Question-based>","score":<0-100>}],"meta_descriptions":[{"description":"<desc>","length":<chars>,"type":"<Action-focused|Question-based|Benefit-focused>","score":<0-100>}],"recommended_combination":{"title":"<best title>","description":"<best desc>","reasoning":"<why>"},"open_graph":{"og_title":"<og title>","og_description":"<og desc>"}}
CONTENT: ${content.slice(0, 3000)}`
  },
  linking: {
    name: "Internal Linking Map",
    prompt: (content, url) => `You are an internal linking strategist. Create an internal linking strategy for this content from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<assessment>","page_type":"<pillar|cluster|landing|blog|product>","link_opportunities":[{"anchor_text":"<anchor>","target_topic":"<topic>","placement":"<where>","priority":"<high|medium|low>"}],"pages_that_should_link_here":[{"topic":"<topic>","reason":"<why>"}],"orphan_risk":"<low|medium|high>","silo_recommendations":["<rec1>","<rec2>"],"anchor_text_diversity":"<assessment>"}
CONTENT: ${content.slice(0, 3000)}`
  },
  topical: {
    name: "Topical Authority Cluster",
    prompt: (content, url) => `You are a topical authority strategist. Design a content cluster for this page from ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<assessment>","main_topic":"<core topic>","pillar_page_recommendation":{"topic":"<pillar topic>","is_current_page_the_pillar":true,"notes":"<notes>"},"cluster_pages":[{"topic":"<subtopic>","suggested_title":"<title>","word_count":<number>,"relationship":"<supports|extends|complements>"}],"content_gaps":["<gap1>","<gap2>"],"topical_authority_score":<0-100>,"quick_wins":["<win1>","<win2>"],"long_term_strategy":"<3-6 month roadmap>"}
CONTENT: ${content.slice(0, 3000)}`
  },
  citation: {
    name: "AI Citation Optimizer",
    prompt: (content, url) => `You are an AI citation optimization specialist. Optimize this content from ${url} to be cited by ChatGPT, Perplexity AI, and Google SGE. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<assessment>","citation_score":<0-100>,"citation_triggers":["<trigger1>","<trigger2>"],"optimized_passages":[{"original":"<original>","optimized":"<rewritten>","reason":"<why>"}],"missing_citation_signals":["<signal1>","<signal2>"],"best_citation_format":"<paragraph|list|definition|statistic>","ai_engine_specific":{"perplexity":"<tip>","chatgpt":"<tip>","google_sge":"<tip>"},"action_items":["<action1>","<action2>","<action3>"]}
CONTENT: ${content.slice(0, 3000)}`
  },
  urlstructure: {
    name: "URL & Structure Audit",
    prompt: (content, url) => `You are a technical SEO specialist. Analyze the URL structure and page architecture for ${url}. Return ONLY valid JSON (no markdown) in this exact format:
{"summary":"<overall assessment>","url_score":<0-100>,"current_url":"${url}","url_issues":["<issue1>","<issue2>"],"slug_analysis":{"current_slug":"<slug from url>","length":<char count of slug>,"has_keywords":true,"has_stop_words":true,"is_lowercase":true,"uses_hyphens":true,"verdict":"<good|needs-work|poor>"},"recommended_slug":"<better-slug-suggestion>","url_depth":{"current_depth":<number of path segments>,"recommendation":"<keep or simplify>","verdict":"<good|too-deep|shallow>"},"breadcrumb_structure":{"recommended":["Home","<Category>","<Page Title>"],"currently_present":true,"schema_needed":true},"technical_issues":["<issue1>","<issue2>"],"canonical_recommendation":"<self-referencing or alternate canonical url>","quick_fixes":["<fix1>","<fix2>","<fix3>"],"priority_actions":["<action1>","<action2>"]}
CONTENT: ${content.slice(0, 3000)}`
  }
};

// ─── Call Claude API directly via fetch ──────────────────────────────────────

async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    }),
    signal: AbortSignal.timeout(25000)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

// ─── Fetch page content ───────────────────────────────────────────────────────

async function fetchPageContent(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AI-SEO-Tool/1.0)" },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);
  const html = await response.text();
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

// ─── Run one skill ────────────────────────────────────────────────────────────

async function runSkill(skillKey, content, url) {
  const skill = SKILL_PROMPTS[skillKey];
  if (!skill) throw new Error(`Unknown skill: ${skillKey}`);
  const text = await callClaude(skill.prompt(content, url));
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim());
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Could not parse response as JSON");
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const { url, skills } = JSON.parse(event.body || "{}");
    if (!url) return { statusCode: 400, headers, body: JSON.stringify({ error: "URL is required" }) };
    if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }) };

    let pageContent;
    try {
      pageContent = await fetchPageContent(url);
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: `Could not fetch URL: ${e.message}` }) };
    }

    if (!pageContent || pageContent.length < 50) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Page content too short or empty" }) };
    }

    const skillsToRun = skills && skills.length > 0 ? skills : Object.keys(SKILL_PROMPTS);
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
      body: JSON.stringify({ url, analyzed_at: new Date().toISOString(), results })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
