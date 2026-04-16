import { useState, useCallback, useEffect } from 'react'
import './App.css'

const SKILLS = [
  { key: 'eeat',     name: 'E-E-A-T Audit',            icon: '🔍', desc: 'Experience, Expertise, Authority & Trust',   scoreKey: 'score',                   action: 'Add author bios, credentials & trust signals to your page' },
  { key: 'rewrite',  name: 'AI Content Rewrite',        icon: '✍️', desc: 'Optimized for SGE, Perplexity & ChatGPT',  scoreKey: 'ai_readability_score',    action: 'Copy the rewritten content and replace your existing page text' },
  { key: 'schema',   name: 'Schema Markup',              icon: '🏷️', desc: 'JSON-LD structured data generation',        scoreKey: null,                      action: 'Paste the JSON-LD code into your page\'s <head> section' },
  { key: 'querymap', name: 'Conversational Query Map',   icon: '💬', desc: 'Voice & AI question-based targeting',       scoreKey: 'total_opportunity_score', action: 'Add FAQ sections to your page targeting the identified queries' },
  { key: 'entities', name: 'Entity Coverage',            icon: '🧠', desc: 'Semantic entity & knowledge graph gaps',    scoreKey: 'topic_coverage_score',    action: 'Naturally mention the missing entities within your page copy' },
  { key: 'brief',    name: 'Content Brief',              icon: '📋', desc: 'Full brief with headings & structure',      scoreKey: null,                      action: 'Share this brief with your writer or use it to rewrite the page' },
  { key: 'meta',     name: 'Title & Description',        icon: '🎯', desc: 'CTR-optimized meta tag variations',         scoreKey: null,                      action: 'Update your CMS meta title & description with the top suggestion' },
  { key: 'linking',  name: 'Internal Linking Map',       icon: '🔗', desc: 'Internal link opportunities & silo',        scoreKey: null,                      action: 'Add the recommended internal links to your page and linking pages' },
  { key: 'topical',  name: 'Topical Authority Cluster',  icon: '🗺️', desc: 'Pillar + cluster content architecture',     scoreKey: 'topical_authority_score', action: 'Plan and publish the suggested cluster pages over 60-90 days' },
  { key: 'citation', name: 'AI Citation Optimizer',      icon: '📣', desc: 'Get cited inside AI search engines',        scoreKey: 'citation_score',          action: 'Rewrite key passages using the optimized formats provided' },
]

const COLORS = {
  eeat: '#4f46e5', rewrite: '#7c3aed', schema: '#0891b2', querymap: '#059669',
  entities: '#db2777', brief: '#d97706', meta: '#7c3aed', linking: '#0284c7',
  topical: '#9333ea', citation: '#0369a1'
}

const WHY_CARDS = [
  { icon: '⚡', title: 'Instant 10-Skill Audit', body: 'Get E-E-A-T, Schema, Entities, AI Citations, and 6 more audits running simultaneously in under 2 minutes.' },
  { icon: '🤖', title: 'Built for AI Search', body: 'Optimized for Google SGE, Perplexity, and ChatGPT — not just traditional search. Future-proof your content.' },
  { icon: '📤', title: 'Client-Ready Reports', body: 'Export beautiful PDF or HTML reports branded for your clients. Or share a live link — no login required.' },
  { icon: '🎯', title: 'Actionable, Not Just Audits', body: 'Every skill gives you specific copy changes, schema code, and content to implement — not vague advice.' },
]

// ── Score Pill ────────────────────────────────────────────────────────────────
function ScorePill({ score }) {
  if (score == null) return null
  const cls = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'
  const label = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor'
  return <span className={`score-pill ${cls}`}>{score}/100 · {label}</span>
}

// ── Skill Results Renderer ────────────────────────────────────────────────────
function SkillResults({ skillKey, data }) {
  if (!data) return null

  const List = ({ items, title }) => {
    if (!items?.length) return null
    return (
      <div className="result-block">
        <div className="result-block-title">{title}</div>
        <ul className="result-list">
          {items.slice(0, 6).map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      </div>
    )
  }

  const Summary = ({ text }) => text
    ? <div className="result-summary">{text}</div>
    : null

  switch (skillKey) {
    case 'eeat': return <>
      <ScorePill score={data.score} />
      <Summary text={data.summary} />
      <List items={data.priority_fixes} title="🔧 Priority Fixes" />
      {['experience','expertise','authoritativeness','trustworthiness'].map(d => data[d] && (
        <div key={d} className="result-block">
          <div className="result-block-title">{d.toUpperCase()} — {data[d].score}/100</div>
          <ul className="result-list">{(data[d].recommendations||[]).slice(0,2).map((r,i)=><li key={i}>{r}</li>)}</ul>
        </div>
      ))}
    </>

    case 'rewrite': return <>
      <ScorePill score={data.ai_readability_score} />
      <Summary text={data.summary} />
      <List items={data.key_changes} title="✅ Key Changes Made" />
      {data.rewritten_content && (
        <div className="result-block">
          <div className="result-block-title">📄 Rewritten Content</div>
          <div className="code-box">{data.rewritten_content.slice(0,800)}{data.rewritten_content.length>800?'…':''}</div>
        </div>
      )}
    </>

    case 'schema': return <>
      <Summary text={data.summary} />
      {(data.schemas||[]).map((s,i) => (
        <div key={i} className="result-block">
          <div className="result-block-title">📦 {s.type} — Place in: {s.placement}</div>
          <div className="code-box">{JSON.stringify(s.json_ld,null,2)}</div>
        </div>
      ))}
      <List items={data.implementation_notes} title="📝 Implementation Notes" />
    </>

    case 'querymap': return <>
      <ScorePill score={data.total_opportunity_score} />
      <Summary text={data.summary} />
      {data.primary_queries?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">🎯 Primary Queries ({data.primary_queries.length})</div>
          <ul className="result-list">
            {data.primary_queries.slice(0,5).map((q,i) => (
              <li key={i}><strong>{q.query}</strong> — {q.intent} [{q.priority}]</li>
            ))}
          </ul>
        </div>
      )}
      <List items={data.voice_search_queries} title="🎤 Voice Search Queries" />
      <List items={data.missing_queries} title="⚠️ Missing Queries" />
      {data.featured_snippet_opportunities?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">⭐ Featured Snippet Opportunities</div>
          <ul className="result-list">
            {data.featured_snippet_opportunities.slice(0,4).map((f,i) => (
              <li key={i}><strong>{f.query}</strong> — {f.recommended_format} [{f.current_coverage}]</li>
            ))}
          </ul>
        </div>
      )}
    </>

    case 'entities': return <>
      <ScorePill score={data.topic_coverage_score} />
      <Summary text={data.summary} />
      {data.covered_entities?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">✅ Covered Entities ({data.covered_entities.length})</div>
          <div className="tag-wrap">
            {data.covered_entities.slice(0,12).map((e,i) => (
              <span key={i} className="tag">{e.entity} <span style={{opacity:.6}}>({e.type})</span></span>
            ))}
          </div>
        </div>
      )}
      {data.missing_entities?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">❌ Missing Entities — Add These</div>
          <ul className="result-list">
            {data.missing_entities.slice(0,5).map((e,i) => (
              <li key={i}><strong>{e.entity}</strong> ({e.type}) — {e.reason}</li>
            ))}
          </ul>
        </div>
      )}
      <List items={data.recommendations} title="💡 Recommendations" />
    </>

    case 'brief': return <>
      <Summary text={data.summary} />
      <div className="result-block">
        <div className="result-block-title">📌 Brief Parameters</div>
        <div className="tag-wrap">
          {data.target_audience && <span className="tag">Audience: {data.target_audience}</span>}
          {data.recommended_word_count && <span className="tag">~{data.recommended_word_count} words</span>}
          {data.tone && <span className="tag">Tone: {data.tone}</span>}
          {data.primary_keyword && <span className="tag">🔑 {data.primary_keyword}</span>}
        </div>
      </div>
      <List items={data.secondary_keywords} title="🔑 Secondary Keywords" />
      {data.content_structure?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">📐 Recommended Structure</div>
          <ul className="result-list">
            {data.content_structure.slice(0,8).map((s,i) => (
              <li key={i}><strong>{s.section}:</strong> {s.heading}{s.notes ? ` — ${s.notes}` : ''}</li>
            ))}
          </ul>
        </div>
      )}
      <List items={data.must_include} title="✅ Must Include" />
      <List items={data.cta_recommendations} title="🎯 CTA Recommendations" />
      <List items={data.competitive_gaps} title="🔍 Competitive Gaps" />
    </>

    case 'meta': return <>
      <Summary text={data.summary} />
      {data.recommended_combination && (
        <div className="info-card" style={{marginBottom:16}}>
          <div style={{marginBottom:8}}><strong>⭐ Recommended Title</strong><br/>{data.recommended_combination.title}</div>
          <div style={{marginBottom:8}}><strong>⭐ Recommended Description</strong><br/>{data.recommended_combination.description}</div>
          {data.recommended_combination.reasoning && <div style={{fontSize:12,opacity:.8,marginTop:6}}>{data.recommended_combination.reasoning}</div>}
        </div>
      )}
      <List items={data.current_issues} title="⚠️ Current Issues" />
      {data.title_tags?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">📝 Title Variations</div>
          <ul className="result-list">
            {data.title_tags.map((t,i) => (
              <li key={i}><strong>[{t.score}/100] {t.type}:</strong> {t.title} <span style={{opacity:.6,fontSize:11}}>({t.length} chars)</span></li>
            ))}
          </ul>
        </div>
      )}
      {data.meta_descriptions?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">📋 Description Variations</div>
          <ul className="result-list">
            {data.meta_descriptions.slice(0,3).map((d,i) => (
              <li key={i}><strong>[{d.score}/100]</strong> {d.description} <span style={{opacity:.6,fontSize:11}}>({d.length} chars)</span></li>
            ))}
          </ul>
        </div>
      )}
      {data.open_graph && (
        <div className="result-block">
          <div className="result-block-title">📱 Open Graph Tags</div>
          <ul className="result-list">
            <li><strong>og:title</strong> — {data.open_graph.og_title}</li>
            <li><strong>og:description</strong> — {data.open_graph.og_description}</li>
          </ul>
        </div>
      )}
    </>

    case 'linking': return <>
      <Summary text={data.summary} />
      <div className="tag-wrap" style={{marginBottom:14}}>
        {data.page_type && <span className="tag">Page Type: {data.page_type}</span>}
        {data.orphan_risk && <span className={`tag ${data.orphan_risk==='high'?'tag-red':data.orphan_risk==='medium'?'tag-yellow':''}`}>Orphan Risk: {data.orphan_risk}</span>}
        {data.anchor_text_diversity && <span className="tag">Anchors: {data.anchor_text_diversity}</span>}
      </div>
      {data.link_opportunities?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">🔗 Outbound Link Opportunities</div>
          <ul className="result-list">
            {data.link_opportunities.slice(0,6).map((l,i) => (
              <li key={i}><strong>"{l.anchor_text}"</strong> → {l.target_topic} [{l.priority}]</li>
            ))}
          </ul>
        </div>
      )}
      {data.pages_that_should_link_here?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">↩️ Pages That Should Link Here</div>
          <ul className="result-list">
            {data.pages_that_should_link_here.slice(0,4).map((p,i) => (
              <li key={i}><strong>{p.topic}</strong> — {p.reason}</li>
            ))}
          </ul>
        </div>
      )}
      <List items={data.silo_recommendations} title="🏛️ Silo Recommendations" />
    </>

    case 'topical': return <>
      <ScorePill score={data.topical_authority_score} />
      <Summary text={data.summary} />
      {data.main_topic && (
        <div className="tag-wrap" style={{marginBottom:14}}>
          <span className="tag">🗺️ Core Topic: {data.main_topic}</span>
          {data.pillar_page_recommendation && (
            <span className="tag">{data.pillar_page_recommendation.is_current_page_the_pillar ? '✅ This is the Pillar Page' : `Pillar: ${data.pillar_page_recommendation.topic}`}</span>
          )}
        </div>
      )}
      {data.cluster_pages?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">📑 Cluster Pages to Create ({data.cluster_pages.length})</div>
          <ul className="result-list">
            {data.cluster_pages.slice(0,6).map((c,i) => (
              <li key={i}><strong>{c.suggested_title}</strong> (~{c.word_count} words) — {c.relationship}</li>
            ))}
          </ul>
        </div>
      )}
      <List items={data.content_gaps} title="🕳️ Content Gaps" />
      <List items={data.quick_wins} title="⚡ Quick Wins" />
      {data.long_term_strategy && (
        <div className="warn-card"><strong>📅 3–6 Month Strategy:</strong> {data.long_term_strategy}</div>
      )}
    </>

    case 'citation': return <>
      <ScorePill score={data.citation_score} />
      <Summary text={data.summary} />
      <List items={data.citation_triggers} title="🎯 Citation Triggers" />
      {data.optimized_passages?.length > 0 && (
        <div className="result-block">
          <div className="result-block-title">✍️ Optimized Passages</div>
          <ul className="result-list">
            {data.optimized_passages.slice(0,3).map((p,i) => (
              <li key={i}><strong>Before:</strong> {p.original?.slice(0,80)}…<br/><strong>After:</strong> {p.optimized?.slice(0,100)}…</li>
            ))}
          </ul>
        </div>
      )}
      {data.ai_engine_specific && (
        <div className="result-block">
          <div className="result-block-title">🤖 Per-Engine Tips</div>
          <ul className="result-list">
            {data.ai_engine_specific.perplexity && <li><strong>Perplexity:</strong> {data.ai_engine_specific.perplexity}</li>}
            {data.ai_engine_specific.chatgpt && <li><strong>ChatGPT:</strong> {data.ai_engine_specific.chatgpt}</li>}
            {data.ai_engine_specific.google_sge && <li><strong>Google SGE:</strong> {data.ai_engine_specific.google_sge}</li>}
          </ul>
        </div>
      )}
      <List items={data.action_items} title="✅ Action Items" />
    </>

    default: return <div className="code-box">{JSON.stringify(data,null,2).slice(0,500)}</div>
  }
}

// ── Report HTML Generator ─────────────────────────────────────────────────────
function buildReportHTML(analysisUrl, skillStates) {
  const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
  const done = SKILLS.filter(s => skillStates[s.key].status === 'success')
  const scores = SKILLS.filter(s => s.scoreKey && skillStates[s.key].status === 'success').map(s => skillStates[s.key].data?.[s.scoreKey]).filter(Boolean)
  const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null
  const avgColor = avg >= 70 ? '#059669' : avg >= 40 ? '#d97706' : '#dc2626'

  const list = (items, title) => {
    if (!items?.length) return ''
    return `<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:8px">${title}</div><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:5px">${items.slice(0,6).map(i=>`<li style="font-size:13px;color:#475569;padding:7px 10px;background:#f8fafc;border:1px solid #e8ecf4;border-radius:7px">→ ${typeof i==='object'?JSON.stringify(i):i}</li>`).join('')}</ul></div>`
  }

  const skillHTML = (skill) => {
    if (skillStates[skill.key].status !== 'success') return ''
    const d = skillStates[skill.key].data
    const c = COLORS[skill.key]
    let body = ''
    if (d.summary) body += `<p style="font-size:13px;color:#475569;line-height:1.65;padding:10px 14px;background:#f8fafc;border-left:3px solid ${c};border-radius:0 8px 8px 0;margin-bottom:14px">${d.summary}</p>`
    const sv = skill.scoreKey ? d[skill.scoreKey] : null
    if (sv != null) { const sc = sv>=70?'#059669':sv>=40?'#d97706':'#dc2626'; body += `<span style="background:${sc}15;color:${sc};border:1px solid ${sc}30;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-bottom:12px">${sv}/100 · ${sv>=70?'Good':sv>=40?'Needs Work':'Poor'}</span><br/>` }
    switch(skill.key) {
      case 'eeat': body += list(d.priority_fixes,'🔧 Priority Fixes'); ['experience','expertise','authoritativeness','trustworthiness'].forEach(dim=>{if(d[dim])body+=list(d[dim].recommendations,`${dim.toUpperCase()} (${d[dim].score}/100)`)}); break
      case 'rewrite': body += list(d.key_changes,'✅ Key Changes'); if(d.rewritten_content)body+=`<div style="background:#0f172a;color:#86efac;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;white-space:pre-wrap;margin-top:10px">${d.rewritten_content.slice(0,600)}…</div>`; break
      case 'schema': (d.schemas||[]).forEach(s=>{body+=`<div style="margin-bottom:12px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#94a3b8;margin-bottom:6px">📦 ${s.type} — ${s.placement}</div><div style="background:#0f172a;color:#86efac;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;white-space:pre-wrap">${JSON.stringify(s.json_ld,null,2).slice(0,500)}</div></div>`}); body+=list(d.implementation_notes,'📝 Notes'); break
      case 'querymap': if(d.primary_queries)body+=list(d.primary_queries.map(q=>`${q.query} — ${q.intent} [${q.priority}]`),'🎯 Primary Queries'); body+=list(d.voice_search_queries,'🎤 Voice Search'); body+=list(d.missing_queries,'⚠️ Missing'); break
      case 'entities': if(d.covered_entities){const tags=d.covered_entities.slice(0,12).map(e=>`<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:5px;padding:3px 8px;font-size:12px;margin:2px;display:inline-block">${e.entity} (${e.type})</span>`).join('');body+=`<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">✅ COVERED</div><div>${tags}</div></div>`} body+=list((d.missing_entities||[]).map(e=>`${e.entity} (${e.type}) — ${e.reason}`),'❌ Missing Entities'); break
      case 'brief': body+=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${[d.target_audience&&`Audience: ${d.target_audience}`,d.recommended_word_count&&`~${d.recommended_word_count} words`,d.tone&&d.tone].filter(Boolean).map(t=>`<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:3px 9px;font-size:12px">${t}</span>`).join('')}</div>`; body+=list(d.secondary_keywords,'🔑 Keywords'); body+=list((d.content_structure||[]).map(s=>`${s.section}: ${s.heading}`),'📐 Structure'); break
      case 'meta': if(d.recommended_combination)body+=`<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:12px;font-size:13px;color:#166534"><strong>⭐ Title:</strong> ${d.recommended_combination.title}<br/><br/><strong>⭐ Description:</strong> ${d.recommended_combination.description}</div>`; body+=list((d.title_tags||[]).map(t=>`[${t.score}/100] ${t.title}`),'📝 Variations'); break
      case 'linking': body+=list((d.link_opportunities||[]).map(l=>`"${l.anchor_text}" → ${l.target_topic} [${l.priority}]`),'🔗 Opportunities'); body+=list(d.silo_recommendations,'🏛️ Silo'); break
      case 'topical': body+=list((d.cluster_pages||[]).map(c=>`${c.suggested_title} (~${c.word_count} words)`),'📑 Cluster Pages'); body+=list(d.quick_wins,'⚡ Quick Wins'); if(d.long_term_strategy)body+=`<div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:10px 12px;font-size:13px;color:#713f12"><strong>Strategy:</strong> ${d.long_term_strategy}</div>`; break
      case 'citation': if(d.ai_engine_specific)body+=list([d.ai_engine_specific.perplexity&&`Perplexity: ${d.ai_engine_specific.perplexity}`,d.ai_engine_specific.chatgpt&&`ChatGPT: ${d.ai_engine_specific.chatgpt}`,d.ai_engine_specific.google_sge&&`Google SGE: ${d.ai_engine_specific.google_sge}`].filter(Boolean),'🤖 Per Engine'); body+=list(d.action_items,'✅ Actions'); break
    }
    return `<div style="background:#fff;border:1.5px solid #e8ecf4;border-radius:14px;padding:22px;margin-bottom:20px;page-break-inside:avoid"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f1f5f9"><div style="width:38px;height:38px;border-radius:10px;background:${c}12;border:1.5px solid ${c}30;display:flex;align-items:center;justify-content:center;font-size:18px">${skill.icon}</div><div><h3 style="margin:0;font-size:15px;font-weight:700;color:#0f172a">${skill.name}</h3><p style="margin:2px 0 0;font-size:12px;color:#94a3b8">${skill.desc}</p></div><span style="margin-left:auto;background:#dcfce7;color:#15803d;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">✓ Complete</span></div>${body}</div>`
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>PageIQ Report — ${analysisUrl}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f6f8fc;color:#0f172a;-webkit-font-smoothing:antialiased}@media print{body{background:#fff}.no-print{display:none!important}}</style></head><body>
<div class="no-print" style="position:fixed;top:16px;right:16px;z-index:999;display:flex;gap:8px">
  <button onclick="window.print()" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">🖨️ Save as PDF</button>
  <button onclick="window.close()" style="background:#f1f5f9;color:#64748b;border:none;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;font-family:inherit">✕ Close</button>
</div>
<div style="background:linear-gradient(135deg,#0f0c29,#302b63,#1a237e);padding:44px 60px;color:#fff">
  <div style="max-width:860px;margin:0 auto">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:22px">
      <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px">📊</div>
      <div><h1 style="font-size:24px;font-weight:800;margin:0;letter-spacing:-.02em">PageIQ — SEO Report</h1><p style="color:#a5b4fc;font-size:13px;margin:3px 0 0">10-Skill AI SEO Analysis</p></div>
      ${avg!=null?`<div style="margin-left:auto;text-align:center"><div style="font-size:44px;font-weight:800;color:${avgColor};line-height:1">${avg}</div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;margin-top:2px">Avg Score</div></div>`:''}
    </div>
    <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:14px 18px;display:flex;gap:28px;flex-wrap:wrap">
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Page Analyzed</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px;word-break:break-all">${analysisUrl}</div></div>
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Report Date</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px">${date}</div></div>
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Skills Complete</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px">${done.length}/10</div></div>
    </div>
  </div>
</div>
${scores.length?`<div style="background:#fff;border-bottom:1px solid #e8ecf4;padding:20px 60px"><div style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">${SKILLS.filter(s=>s.scoreKey&&skillStates[s.key].status==='success').map(s=>{const v=skillStates[s.key].data?.[s.scoreKey];if(!v)return'';const c=v>=70?'#059669':v>=40?'#d97706':'#dc2626';return`<div style="background:#f8fafc;border:1.5px solid #e8ecf4;border-radius:10px;padding:12px;text-align:center"><div style="font-size:26px;font-weight:800;color:${c}">${v}</div><div style="font-size:10px;color:#94a3b8;margin-top:2px;font-weight:500">${s.name}</div></div>`}).join('')}</div></div>`:''}
<div style="max-width:860px;margin:0 auto;padding:28px 60px 60px">${done.map(s=>skillHTML(s)).join('')}</div>
<div style="background:#0f172a;color:#475569;text-align:center;padding:20px;font-size:12px">PageIQ SEO Report · ${date}</div>
</body></html>`
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl]               = useState('')
  const [analysisUrl, setAnalysisUrl] = useState('')
  const [skillStates, setSkillStates] = useState(() =>
    Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }]))
  )
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [progress, setProgress]     = useState({ done: 0, total: 0 })
  const [shareCopied, setShareCopied] = useState(false)
  const [activeTab, setActiveTab]   = useState('eeat')
  const [view, setView]             = useState('landing') // 'landing' | 'analyzer'

  // Load from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#report=')) {
      try {
        const decoded = JSON.parse(atob(hash.replace('#report=', '')))
        setAnalysisUrl(decoded.url)
        setUrl(decoded.url)
        setSkillStates(decoded.states)
        setView('analyzer')
        // auto-select first completed skill
        const first = SKILLS.find(s => decoded.states?.[s.key]?.status === 'success')
        if (first) setActiveTab(first.key)
      } catch {}
    }
  }, [])

  const setSkill = (key, update) =>
    setSkillStates(prev => ({ ...prev, [key]: { ...prev[key], ...update } }))

  const runSkill = useCallback(async (skillKey, targetUrl) => {
    const u = targetUrl || analysisUrl
    if (!u) return
    setSkill(skillKey, { status: 'running', data: null, error: null })
    try {
      const res = await fetch('/api/seo-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u, skills: [skillKey] })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Request failed')
      const result = json.results?.[skillKey]
      if (result?.status === 'error') throw new Error(result.error)
      setSkill(skillKey, { status: 'success', data: result?.data })
    } catch (e) {
      setSkill(skillKey, { status: 'error', error: e.message })
    }
  }, [analysisUrl])

  const runAll = async (inputUrl) => {
    const u = (inputUrl || url).trim()
    if (!u) return
    setAnalysisUrl(u)
    setView('analyzer')
    setIsRunningAll(true)
    setProgress({ done: 0, total: SKILLS.length })
    setActiveTab('eeat')
    const fresh = Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }]))
    setSkillStates(fresh)
    const states = { ...fresh }
    for (const skill of SKILLS) {
      setSkill(skill.key, { status: 'running', data: null, error: null })
      setActiveTab(skill.key)
      try {
        const res = await fetch('/api/seo-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: u, skills: [skill.key] })
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Request failed')
        const result = json.results?.[skill.key]
        if (result?.status === 'error') throw new Error(result.error)
        states[skill.key] = { status: 'success', data: result?.data }
        setSkill(skill.key, { status: 'success', data: result?.data })
      } catch (e) {
        states[skill.key] = { status: 'error', error: e.message }
        setSkill(skill.key, { status: 'error', error: e.message })
      }
      setProgress(p => ({ ...p, done: p.done + 1 }))
    }
    const encoded = btoa(JSON.stringify({ url: u, states }))
    window.history.replaceState(null, '', `#report=${encoded}`)
    setIsRunningAll(false)
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2500)
  }

  const exportPDF = () => {
    const html = buildReportHTML(analysisUrl, skillStates)
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 800)
  }

  const exportHTML = () => {
    const html = buildReportHTML(analysisUrl, skillStates)
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    try { a.download = `pageiq-report-${new URL(analysisUrl).hostname}.html` } catch { a.download = 'pageiq-report.html' }
    a.click()
  }

  const completedCount = SKILLS.filter(s => skillStates[s.key].status === 'success').length
  const hasResults = completedCount > 0
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0
  const scoreSkills = SKILLS.filter(s => s.scoreKey && skillStates[s.key].status === 'success' && skillStates[s.key].data?.[s.scoreKey])
  const activeSkill = SKILLS.find(s => s.key === activeTab)
  const activeState = skillStates[activeTab]

  // ── Topbar (shared) ──────────────────────────────────────────────────────────
  const Topbar = () => (
    <nav className="topbar">
      <div className="topbar-logo">📊</div>
      <span className="topbar-brand">PageIQ</span>
      <span className="topbar-tagline">AI SEO Intelligence</span>
      <div className="topbar-spacer" />
      {view === 'analyzer' && (
        <button className="topbar-btn" onClick={() => {
          setView('landing')
          window.history.replaceState(null, '', window.location.pathname)
          setSkillStates(Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }])))
          setAnalysisUrl('')
          setUrl('')
        }}>← New Audit</button>
      )}
      <span className="topbar-pill">AI-Powered</span>
    </nav>
  )

  // ── Landing Page ─────────────────────────────────────────────────────────────
  if (view === 'landing') return (
    <div>
      <Topbar />
      <div className="landing">

        {/* Hero */}
        <div className="hero-landing">
          <div className="hero-landing-inner">
            <div className="hero-badge">🚀 10 AI-Powered SEO Skills · Instant Results</div>
            <h1>Your Page.<br/><span>Smarter Rankings.</span></h1>
            <p>Paste any URL and get 10 professional SEO audits in under 2 minutes — E-E-A-T, Schema, AI Citation, Topical Authority & more.</p>
            <div className="hero-url-box">
              <input
                type="url"
                placeholder="https://yourwebsite.com/page-to-audit"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && url.trim() && runAll()}
              />
              <button className="btn-hero" onClick={() => runAll()} disabled={!url.trim()}>
                ▶ Run Free Audit
              </button>
            </div>
            <div className="hero-trust">
              <span>✓ No login required</span>
              <span>✓ Results in ~90 seconds</span>
              <span>✓ Shareable report link</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-strip">
          <div className="stat"><div className="stat-val">10</div><div className="stat-lbl">SEO Skills Per Audit</div></div>
          <div className="stat"><div className="stat-val">90s</div><div className="stat-lbl">Average Run Time</div></div>
          <div className="stat"><div className="stat-val">AI</div><div className="stat-lbl">SGE, Perplexity & ChatGPT Ready</div></div>
          <div className="stat"><div className="stat-val">PDF</div><div className="stat-lbl">Client-Ready Export</div></div>
        </div>

        {/* How it works */}
        <div className="section">
          <div className="section-label">How it works</div>
          <div className="section-title">Three Steps to a Complete SEO Audit</div>
          <div className="section-sub">No integrations, no setup, no waiting. Just paste a URL and get a full AI-powered report.</div>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-circle">🔗</div>
              <h3>Paste Your URL</h3>
              <p>Enter any public page URL — a blog post, product page, landing page, or homepage.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">⚡</div>
              <h3>Run 10 Skills</h3>
              <p>PageIQ fetches and analyzes the page, running all 10 SEO audits simultaneously in the background.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">📤</div>
              <h3>Export or Share</h3>
              <p>Download a branded PDF report for your client, or copy a share link — no login needed to view.</p>
            </div>
          </div>
        </div>

        {/* 10 Skills */}
        <div className="skills-features">
          <div className="section-label">What you get</div>
          <div className="section-title" style={{marginBottom:12}}>10 Professional SEO Skills</div>
          <div className="section-sub">Each skill delivers specific, actionable output — not just a score.</div>
          <div className="skills-feat-grid">
            {SKILLS.map(skill => (
              <div key={skill.key} className="skill-feat-card">
                <div className="skill-feat-icon" style={{ background: `${COLORS[skill.key]}12`, border: `1.5px solid ${COLORS[skill.key]}30` }}>
                  {skill.icon}
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.desc}</p>
                <div className="skill-feat-action">→ {skill.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why PageIQ */}
        <div className="why-section">
          <div className="why-inner">
            <div className="section-label" style={{color:'#a5b4fc'}}>Why PageIQ</div>
            <div className="section-title" style={{color:'#fff'}}>Built for SEOs, Agencies & Content Teams</div>
            <div className="why-grid">
              {WHY_CARDS.map((c, i) => (
                <div key={i} className="why-card">
                  <div className="why-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <h2>Ready to audit your first page?</h2>
          <p>It's free to use. Paste any URL and get your full 10-skill SEO report in under 2 minutes.</p>
          <div className="hero-url-box" style={{maxWidth:'560px',margin:'0 auto 16px'}}>
            <input
              type="url"
              placeholder="https://yourwebsite.com/page-to-audit"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && url.trim() && runAll()}
              style={{color:'var(--text)'}}
            />
            <button className="btn-hero" onClick={() => runAll()} disabled={!url.trim()}>
              ▶ Analyze Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{background:'#0f172a',color:'#475569',textAlign:'center',padding:'20px',fontSize:'12px'}}>
          PageIQ · AI SEO Intelligence Tool
        </div>
      </div>
    </div>
  )

  // ── Analyzer View ─────────────────────────────────────────────────────────────
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
      <Topbar />

      {/* Analyzer hero — URL bar */}
      <div className="analyzer-hero">
        <div className="analyzer-hero-inner">
          <h2>SEO Audit — {analysisUrl || 'Ready'}</h2>
          <p>{isRunningAll ? `Running skill ${progress.done + 1} of ${progress.total}…` : `${completedCount} of 10 skills complete`}</p>
          <div className="url-row">
            <input
              className="url-input"
              type="url"
              placeholder="https://yourwebsite.com/page-to-audit"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isRunningAll && runAll()}
              disabled={isRunningAll}
            />
            <button className="btn-analyze" onClick={() => runAll()} disabled={isRunningAll || !url.trim()}>
              {isRunningAll ? `${pct}%…` : '▶ Re-Analyze'}
            </button>
          </div>
          {isRunningAll && (
            <div className="progress-row">
              <div className="progress-meta"><span>Analyzing…</span><span>{pct}%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Export bar */}
      {hasResults && (
        <div className="export-bar">
          <span className="export-label">✅ {completedCount}/10 skills complete</span>
          {shareCopied
            ? <span className="copied-badge">✓ Link copied!</span>
            : <button className="btn-export" onClick={copyShareLink}>🔗 Copy Share Link</button>
          }
          <button className="btn-export primary" onClick={exportPDF}>🖨️ Export PDF</button>
          <button className="btn-export" onClick={exportHTML}>🌐 Download HTML</button>
        </div>
      )}

      {/* Score strip */}
      {scoreSkills.length > 0 && (
        <div className="score-strip">
          {scoreSkills.map(s => {
            const v = skillStates[s.key].data[s.scoreKey]
            const cls = v >= 70 ? 'h' : v >= 40 ? 'm' : 'l'
            return (
              <div key={s.key} className="score-chip" onClick={() => setActiveTab(s.key)} style={{cursor:'pointer'}}>
                <div className={`v ${cls}`}>{v}</div>
                <div className="n">{s.name}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tabs layout */}
      <div className="tabs-layout">

        {/* Sidebar */}
        <div className="tabs-sidebar">
          {SKILLS.map(skill => {
            const state = skillStates[skill.key]
            const statusLabel = { idle: 'Pending', running: 'Analyzing…', success: 'Complete', error: 'Error' }
            return (
              <div
                key={skill.key}
                className={`tab-item ${activeTab === skill.key ? 'active' : ''}`}
                onClick={() => setActiveTab(skill.key)}
              >
                <div className="tab-icon-wrap" style={{ background: `${COLORS[skill.key]}12` }}>
                  {skill.icon}
                </div>
                <div className="tab-info">
                  <div className="tab-name">{skill.name}</div>
                  <div className={`tab-status ${state.status}`}>{statusLabel[state.status]}</div>
                </div>
                <div className={`tab-dot ${state.status}`} />
              </div>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeSkill && (
            <>
              <div className="tab-content-header">
                <div className="tab-content-icon" style={{ background: `${COLORS[activeSkill.key]}12`, border: `1.5px solid ${COLORS[activeSkill.key]}30` }}>
                  {activeSkill.icon}
                </div>
                <div>
                  <div className="tab-content-title">{activeSkill.name}</div>
                  <div className="tab-content-desc">{activeSkill.desc}</div>
                </div>
                <button
                  className="tab-content-run"
                  disabled={activeState.status === 'running' || isRunningAll}
                  onClick={() => runSkill(activeSkill.key)}
                >
                  {activeState.status === 'running' ? 'Running…' : activeState.status === 'success' ? '↺ Re-run' : '▶ Run'}
                </button>
              </div>

              {activeState.status === 'idle' && (
                <div className="tab-empty">
                  <div className="tab-empty-icon">{activeSkill.icon}</div>
                  <h3>Ready to Analyze</h3>
                  <p>Click <strong>▶ Run</strong> to run this skill, or use <strong>▶ Re-Analyze</strong> above to run all 10 at once.</p>
                </div>
              )}

              {activeState.status === 'running' && (
                <div className="tab-loading">
                  <div className="dot-pulse"><span/><span/><span/></div>
                  Analyzing page content with AI…
                </div>
              )}

              {activeState.status === 'error' && (
                <div className="tab-error">
                  ⚠️ {activeState.error}
                  <div style={{marginTop:8,fontSize:12,opacity:.7}}>Try re-running this skill or check that the URL is accessible.</div>
                </div>
              )}

              {activeState.status === 'success' && activeState.data && (
                <>
                  <SkillResults skillKey={activeSkill.key} data={activeState.data} />
                  <div style={{marginTop:20,display:'flex',gap:10}}>
                    <button className="btn-copy" onClick={() => navigator.clipboard.writeText(JSON.stringify(activeState.data, null, 2))}>
                      Copy JSON
                    </button>
                    <div style={{marginLeft:'auto',background:'#f0f4ff',border:'1px solid #c7d2fe',borderRadius:8,padding:'8px 14px',fontSize:12,color:'var(--accent)',fontWeight:600}}>
                      ✅ Action: {activeSkill.action}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
