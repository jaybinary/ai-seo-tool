import { useState, useCallback, useEffect } from 'react'

const SKILLS = [
  { key: 'eeat',     name: 'E-E-A-T Audit',            icon: '🔍', desc: 'Experience, Expertise, Authority & Trust',    scoreKey: 'score' },
  { key: 'rewrite',  name: 'AI Content Rewrite',        icon: '✍️', desc: 'Optimized for SGE, Perplexity & ChatGPT',   scoreKey: 'ai_readability_score' },
  { key: 'schema',   name: 'Schema Markup',              icon: '🏷️', desc: 'JSON-LD structured data generation',         scoreKey: null },
  { key: 'querymap', name: 'Conversational Query Map',   icon: '💬', desc: 'Voice & AI question-based targeting',        scoreKey: 'total_opportunity_score' },
  { key: 'entities', name: 'Entity Coverage',            icon: '🧠', desc: 'Semantic entity & knowledge graph gaps',     scoreKey: 'topic_coverage_score' },
  { key: 'brief',    name: 'Content Brief',              icon: '📋', desc: 'Full brief with headings & structure',       scoreKey: null },
  { key: 'meta',     name: 'Title & Description',        icon: '🎯', desc: 'CTR-optimized meta tag variations',          scoreKey: null },
  { key: 'linking',  name: 'Internal Linking Map',       icon: '🔗', desc: 'Internal link opportunities & silo',         scoreKey: null },
  { key: 'topical',  name: 'Topical Authority Cluster',  icon: '🗺️', desc: 'Pillar + cluster content architecture',      scoreKey: 'topical_authority_score' },
  { key: 'citation', name: 'AI Citation Optimizer',      icon: '📣', desc: 'Get cited inside AI search engines',         scoreKey: 'citation_score' },
]

const COLORS = {
  eeat: '#4f46e5', rewrite: '#7c3aed', schema: '#0891b2', querymap: '#059669',
  entities: '#db2777', brief: '#d97706', meta: '#7c3aed', linking: '#0284c7',
  topical: '#9333ea', citation: '#0369a1'
}

// ── Score Pill ────────────────────────────────────────────────────────────────
function ScorePill({ score }) {
  if (score == null) return null
  const cls = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'
  const label = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor'
  return <span className={`score-pill ${cls}`}>{score}/100 · {label}</span>
}

// ── Render Results ────────────────────────────────────────────────────────────
function SkillResults({ skillKey, data }) {
  if (!data) return null

  const List = ({ items, title }) => {
    if (!items?.length) return null
    return (
      <div className="result-block">
        <div className="result-block-title">{title}</div>
        <ul className="result-list">
          {items.slice(0, 5).map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      </div>
    )
  }

  const Summary = ({ text }) => text ? <div className="result-summary">{text}</div> : null

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
      {data.rewritten_content && <div className="result-block"><div className="result-block-title">📄 Rewritten Content</div><div className="code-box">{data.rewritten_content.slice(0,600)}...</div></div>}
    </>

    case 'schema': return <>
      <Summary text={data.summary} />
      {(data.schemas||[]).map((s,i) => (
        <div key={i} className="result-block">
          <div className="result-block-title">📦 {s.type} — Place in: {s.placement}</div>
          <div className="code-box">{JSON.stringify(s.json_ld,null,2).slice(0,400)}...</div>
        </div>
      ))}
      <List items={data.implementation_notes} title="📝 Notes" />
    </>

    case 'querymap': return <>
      <ScorePill score={data.total_opportunity_score} />
      <Summary text={data.summary} />
      {data.primary_queries && <div className="result-block">
        <div className="result-block-title">🎯 Primary Queries ({data.primary_queries.length})</div>
        <ul className="result-list">{data.primary_queries.slice(0,5).map((q,i)=><li key={i}><strong>{q.query}</strong> — {q.intent} [{q.priority}]</li>)}</ul>
      </div>}
      <List items={data.voice_search_queries} title="🎤 Voice Search" />
      <List items={data.missing_queries} title="⚠️ Missing Queries" />
    </>

    case 'entities': return <>
      <ScorePill score={data.topic_coverage_score} />
      <Summary text={data.summary} />
      {data.covered_entities && <div className="result-block">
        <div className="result-block-title">✅ Covered Entities</div>
        <div className="tag-wrap">{data.covered_entities.slice(0,10).map((e,i)=><span key={i} className="tag">{e.entity} ({e.type})</span>)}</div>
      </div>}
      {data.missing_entities && <div className="result-block">
        <div className="result-block-title">❌ Missing Entities</div>
        <ul className="result-list">{data.missing_entities.slice(0,4).map((e,i)=><li key={i}><strong>{e.entity}</strong> — {e.reason}</li>)}</ul>
      </div>}
    </>

    case 'brief': return <>
      <Summary text={data.summary} />
      <div className="result-block">
        <div className="result-block-title">📌 Targets</div>
        <div className="tag-wrap">
          {[`Audience: ${data.target_audience}`,`Words: ~${data.recommended_word_count}`,`Tone: ${data.tone}`].map((t,i)=><span key={i} className="tag">{t}</span>)}
        </div>
      </div>
      <List items={data.secondary_keywords} title="🔑 Keywords" />
      {data.content_structure && <div className="result-block">
        <div className="result-block-title">📐 Structure</div>
        <ul className="result-list">{data.content_structure.slice(0,6).map((s,i)=><li key={i}><strong>{s.section}:</strong> {s.heading}</li>)}</ul>
      </div>}
    </>

    case 'meta': return <>
      <Summary text={data.summary} />
      {data.recommended_combination && <div className="info-card" style={{marginBottom:14}}>
        <strong>⭐ Best Title:</strong> {data.recommended_combination.title}<br/>
        <strong>Best Desc:</strong> {data.recommended_combination.description}
      </div>}
      <List items={(data.title_tags||[]).map(t=>`[${t.score}/100] ${t.title}`)} title="📝 Title Variations" />
    </>

    case 'linking': return <>
      <Summary text={data.summary} />
      <div className="tag-wrap" style={{marginBottom:12}}>
        <span className="tag">Type: {data.page_type}</span>
        <span className="tag">Orphan Risk: {data.orphan_risk}</span>
      </div>
      <List items={(data.link_opportunities||[]).map(l=>`"${l.anchor_text}" → ${l.target_topic} [${l.priority}]`)} title="🔗 Link Opportunities" />
      <List items={data.silo_recommendations} title="🏛️ Silo Structure" />
    </>

    case 'topical': return <>
      <ScorePill score={data.topical_authority_score} />
      <Summary text={data.summary} />
      <div className="tag-wrap" style={{marginBottom:12}}><span className="tag">Core Topic: {data.main_topic}</span></div>
      <List items={(data.cluster_pages||[]).map(c=>`${c.suggested_title} (~${c.word_count} words)`)} title="📑 Cluster Pages" />
      <List items={data.quick_wins} title="⚡ Quick Wins" />
      {data.long_term_strategy && <div className="warn-card"><strong>📅 Strategy:</strong> {data.long_term_strategy}</div>}
    </>

    case 'citation': return <>
      <ScorePill score={data.citation_score} />
      <Summary text={data.summary} />
      {data.ai_engine_specific && <div className="result-block">
        <div className="result-block-title">🤖 Per Engine Tips</div>
        <ul className="result-list">
          <li><strong>Perplexity:</strong> {data.ai_engine_specific.perplexity}</li>
          <li><strong>ChatGPT:</strong> {data.ai_engine_specific.chatgpt}</li>
          <li><strong>Google SGE:</strong> {data.ai_engine_specific.google_sge}</li>
        </ul>
      </div>}
      <List items={data.action_items} title="✅ Action Items" />
    </>

    default: return <div className="code-box">{JSON.stringify(data,null,2).slice(0,400)}</div>
  }
}

// ── Skill Card ────────────────────────────────────────────────────────────────
function SkillCard({ skill, state, onRun, isRunningAll }) {
  const color = COLORS[skill.key]
  const statusMap = { idle: 'Ready', running: 'Analyzing...', success: 'Complete', error: 'Error' }

  return (
    <div className={`skill-card ${state.status}`}>
      <div className="skill-header">
        <div className="skill-icon" style={{ background: `${color}12`, border: `1.5px solid ${color}30` }}>
          {skill.icon}
        </div>
        <div className="skill-info">
          <h3>{skill.name}</h3>
          <p>{skill.desc}</p>
        </div>
        <span className={`skill-badge ${state.status}`}>{statusMap[state.status]}</span>
        <button
          className="btn-run"
          disabled={state.status === 'running' || isRunningAll}
          onClick={e => { e.stopPropagation(); onRun(skill.key) }}
        >
          {state.status === 'running' ? '···' : state.status === 'success' ? '↺ Rerun' : '▶ Run'}
        </button>
      </div>

      {state.status === 'running' && (
        <div className="loading-row">
          <div className="dot-pulse"><span/><span/><span/></div>
          Analyzing page content...
        </div>
      )}

      {state.status === 'error' && <div className="error-box">⚠️ {state.error}</div>}

      {state.status === 'success' && (
        <div className="skill-body">
          <SkillResults skillKey={skill.key} data={state.data} />
          <button className="btn-copy" onClick={() => navigator.clipboard.writeText(JSON.stringify(state.data, null, 2))}>
            Copy JSON
          </button>
        </div>
      )}
    </div>
  )
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
    return `<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:8px">${title}</div><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:5px">${items.slice(0,6).map(i=>`<li style="font-size:13px;color:#475569;padding:7px 10px;background:#f8fafc;border:1px solid #e8ecf4;border-radius:7px">${typeof i==='object'?JSON.stringify(i):i}</li>`).join('')}</ul></div>`
  }

  const skillHTML = (skill) => {
    if (skillStates[skill.key].status !== 'success') return ''
    const d = skillStates[skill.key].data
    const c = COLORS[skill.key]
    let body = ''
    if (d.summary) body += `<p style="font-size:13px;color:#475569;line-height:1.65;padding:10px 14px;background:#f8fafc;border-left:3px solid ${c};border-radius:0 8px 8px 0;margin-bottom:14px">${d.summary}</p>`
    const sv = skill.scoreKey ? d[skill.scoreKey] : null
    if (sv != null) { const sc = sv>=70?'#059669':sv>=40?'#d97706':'#dc2626'; body += `<span style="background:${sc}15;color:${sc};border:1px solid ${sc}30;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-bottom:12px">${sv}/100 · ${sv>=70?'Good':sv>=40?'Needs Work':'Poor'}</span>` }
    switch(skill.key) {
      case 'eeat': body += list(d.priority_fixes,'🔧 Priority Fixes'); ['experience','expertise','authoritativeness','trustworthiness'].forEach(dim=>{if(d[dim])body+=list(d[dim].recommendations,`${dim.toUpperCase()} (${d[dim].score}/100)`)}); break
      case 'rewrite': body += list(d.key_changes,'✅ Key Changes'); if(d.rewritten_content)body+=`<div style="background:#0f172a;color:#86efac;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;white-space:pre-wrap;margin-top:10px">${d.rewritten_content.slice(0,600)}...</div>`; break
      case 'schema': (d.schemas||[]).forEach(s=>{body+=`<div style="margin-bottom:12px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#94a3b8;margin-bottom:6px">📦 ${s.type} — ${s.placement}</div><div style="background:#0f172a;color:#86efac;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;white-space:pre-wrap">${JSON.stringify(s.json_ld,null,2).slice(0,400)}</div></div>`}); body+=list(d.implementation_notes,'📝 Notes'); break
      case 'querymap': if(d.primary_queries)body+=list(d.primary_queries.map(q=>`${q.query} — ${q.intent} [${q.priority}]`),'🎯 Primary Queries'); body+=list(d.voice_search_queries,'🎤 Voice Search'); body+=list(d.missing_queries,'⚠️ Missing'); break
      case 'entities': if(d.covered_entities){const tags=d.covered_entities.slice(0,10).map(e=>`<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:5px;padding:3px 8px;font-size:12px;margin:2px;display:inline-block">${e.entity} (${e.type})</span>`).join('');body+=`<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">✅ COVERED</div><div>${tags}</div></div>`} body+=list((d.missing_entities||[]).map(e=>`${e.entity} — ${e.reason}`),'❌ Missing Entities'); break
      case 'brief': body+=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">${[`${d.target_audience}`,`~${d.recommended_word_count} words`,`${d.tone}`].map(t=>`<span style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:3px 9px;font-size:12px">${t}</span>`).join('')}</div>`; body+=list(d.secondary_keywords,'🔑 Keywords'); body+=list((d.content_structure||[]).map(s=>`${s.section}: ${s.heading}`),'📐 Structure'); break
      case 'meta': if(d.recommended_combination)body+=`<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-bottom:12px;font-size:13px;color:#166534"><strong>⭐ Title:</strong> ${d.recommended_combination.title}<br/><strong>Desc:</strong> ${d.recommended_combination.description}</div>`; body+=list((d.title_tags||[]).map(t=>`[${t.score}/100] ${t.title}`),'📝 Variations'); break
      case 'linking': body+=list((d.link_opportunities||[]).map(l=>`"${l.anchor_text}" → ${l.target_topic} [${l.priority}]`),'🔗 Opportunities'); body+=list(d.silo_recommendations,'🏛️ Silo'); break
      case 'topical': body+=list((d.cluster_pages||[]).map(c=>`${c.suggested_title} (~${c.word_count} words)`),'📑 Cluster Pages'); body+=list(d.quick_wins,'⚡ Quick Wins'); if(d.long_term_strategy)body+=`<div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:10px 12px;font-size:13px;color:#713f12"><strong>Strategy:</strong> ${d.long_term_strategy}</div>`; break
      case 'citation': if(d.ai_engine_specific)body+=list([`Perplexity: ${d.ai_engine_specific.perplexity}`,`ChatGPT: ${d.ai_engine_specific.chatgpt}`,`Google SGE: ${d.ai_engine_specific.google_sge}`],'🤖 Per Engine'); body+=list(d.action_items,'✅ Actions'); break
    }
    return `<div style="background:#fff;border:1.5px solid #e8ecf4;border-radius:14px;padding:22px;margin-bottom:20px;page-break-inside:avoid"><div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #f1f5f9"><div style="width:38px;height:38px;border-radius:10px;background:${c}12;border:1.5px solid ${c}30;display:flex;align-items:center;justify-content:center;font-size:18px">${skill.icon}</div><div><h3 style="margin:0;font-size:15px;font-weight:700;color:#0f172a">${skill.name}</h3><p style="margin:2px 0 0;font-size:12px;color:#94a3b8">${skill.desc}</p></div><span style="margin-left:auto;background:#dcfce7;color:#15803d;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700">✓ Complete</span></div>${body}</div>`
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>SEO Report — ${analysisUrl}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f6f8fc;color:#0f172a;-webkit-font-smoothing:antialiased}@media print{body{background:#fff}.no-print{display:none!important}}</style></head><body>
<div class="no-print" style="position:fixed;top:16px;right:16px;z-index:999;display:flex;gap:8px">
  <button onclick="window.print()" style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">🖨️ Save as PDF</button>
  <button onclick="window.close()" style="background:#f1f5f9;color:#64748b;border:none;border-radius:8px;padding:9px 16px;font-size:13px;cursor:pointer;font-family:inherit">✕ Close</button>
</div>
<div style="background:linear-gradient(135deg,#1e1b4b,#1e40af);padding:44px 60px;color:#fff">
  <div style="max-width:860px;margin:0 auto">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:22px">
      <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px">🚀</div>
      <div><h1 style="font-size:24px;font-weight:800;margin:0;letter-spacing:-.02em">SEO Intelligence Report</h1><p style="color:#a5b4fc;font-size:13px;margin:3px 0 0">10-Skill AI Analysis</p></div>
      ${avg!=null?`<div style="margin-left:auto;text-align:center"><div style="font-size:44px;font-weight:800;color:${avgColor};line-height:1">${avg}</div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;margin-top:2px">Avg Score</div></div>`:''}
    </div>
    <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:14px 18px;display:flex;gap:28px;flex-wrap:wrap">
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Page Analyzed</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px;word-break:break-all">${analysisUrl}</div></div>
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Report Date</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px">${date}</div></div>
      <div><div style="font-size:10px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.06em;font-weight:600">Skills Run</div><div style="font-size:13px;color:#e0e7ff;margin-top:3px">${done.length}/10 Complete</div></div>
    </div>
  </div>
</div>
${scores.length?`<div style="background:#fff;border-bottom:1px solid #e8ecf4;padding:20px 60px"><div style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">${SKILLS.filter(s=>s.scoreKey&&skillStates[s.key].status==='success').map(s=>{const v=skillStates[s.key].data?.[s.scoreKey];const c=v>=70?'#059669':v>=40?'#d97706':'#dc2626';return`<div style="background:#f8fafc;border:1.5px solid #e8ecf4;border-radius:10px;padding:12px;text-align:center"><div style="font-size:26px;font-weight:800;color:${c}">${v}</div><div style="font-size:10px;color:#94a3b8;margin-top:2px;font-weight:500">${s.name}</div></div>`}).join('')}</div></div>`:''}
<div style="max-width:860px;margin:0 auto;padding:28px 60px 60px">${done.map(s=>skillHTML(s)).join('')}</div>
<div style="background:#0f172a;color:#475569;text-align:center;padding:20px;font-size:12px">SEO Intelligence Report · ${date}</div>
</body></html>`
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState('')
  const [analysisUrl, setAnalysisUrl] = useState('')
  const [skillStates, setSkillStates] = useState(() =>
    Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }]))
  )
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [shareCopied, setShareCopied] = useState(false)

  // Load from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#report=')) {
      try {
        const decoded = JSON.parse(atob(hash.replace('#report=', '')))
        setAnalysisUrl(decoded.url)
        setUrl(decoded.url)
        setSkillStates(decoded.states)
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

  const runAll = async () => {
    if (!url.trim()) return
    const u = url.trim()
    setAnalysisUrl(u)
    setIsRunningAll(true)
    setProgress({ done: 0, total: SKILLS.length })
    const fresh = Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }]))
    setSkillStates(fresh)
    const states = { ...fresh }
    for (const skill of SKILLS) {
      setSkill(skill.key, { status: 'running', data: null, error: null })
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
    // Save to URL hash for sharing
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
    try { a.download = `seo-report-${new URL(analysisUrl).hostname}.html` } catch { a.download = 'seo-report.html' }
    a.click()
  }

  const completedCount = SKILLS.filter(s => skillStates[s.key].status === 'success').length
  const hasResults = completedCount > 0
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0
  const scores = SKILLS.filter(s => s.scoreKey && skillStates[s.key].status === 'success' && skillStates[s.key].data?.[s.scoreKey])

  return (
    <div>
      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar-logo">📊</div>
        <span className="topbar-brand">SEO Intelligence</span>
        <div className="topbar-divider" />
        <span className="topbar-sub">10-Skill AI Audit</span>
        <div className="topbar-spacer" />
        <span className="topbar-pill">AI-Powered</span>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <h1>Analyze Any Page in Seconds</h1>
          <p>Run 10 professional SEO audits simultaneously — E-E-A-T, Schema, Entities, AI Citation & more.</p>
          <div className="url-box">
            <input
              type="url"
              placeholder="https://yourwebsite.com/page-to-audit"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isRunningAll && runAll()}
              disabled={isRunningAll}
            />
            <button className="btn-primary" onClick={runAll} disabled={isRunningAll || !url.trim()}>
              {isRunningAll ? `Running ${progress.done}/${progress.total}…` : '▶ Run All 10 Skills'}
            </button>
          </div>
          {isRunningAll && (
            <div className="progress-wrap">
              <div className="progress-meta"><span>Analyzing page content…</span><span>{pct}%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Export Bar */}
      {hasResults && (
        <div className="export-bar">
          <span className="export-label">
            ✅ {completedCount}/10 skills complete for <strong>{analysisUrl}</strong>
          </span>
          {shareCopied
            ? <span className="share-copied">✓ Link copied!</span>
            : <button className="btn-export" onClick={copyShareLink}>🔗 Copy Share Link</button>
          }
          <button className="btn-export primary-export" onClick={exportPDF}>🖨️ Export PDF</button>
          <button className="btn-export" onClick={exportHTML}>🌐 Download HTML</button>
        </div>
      )}

      {/* Score Summary */}
      {scores.length > 0 && (
        <div className="scores-section">
          <div className="section-header">
            <span className="section-title">Score Overview</span>
          </div>
          <div className="scores-grid">
            {scores.map(s => {
              const v = skillStates[s.key].data[s.scoreKey]
              const cls = v >= 70 ? 'high' : v >= 40 ? 'mid' : 'low'
              return (
                <div key={s.key} className="score-card">
                  <div className={`val ${cls}`}>{v}</div>
                  <div className="lbl">{s.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="skills-section">
        {!hasResults && !isRunningAll ? (
          <div className="empty">
            <div className="empty-icon">📊</div>
            <h3>Ready to Audit</h3>
            <p>Enter any page URL above and run all 10 SEO skills to get a full AI-powered audit with shareable report.</p>
            <div className="steps">
              {['Enter URL','Run 10 Skills','Share Report'].map((s, i) => (
                <div key={i} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-lbl">{s}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="section-header">
              <span className="section-title">10 SEO Skills</span>
              {hasResults && <span className="section-count">{completedCount} Complete</span>}
            </div>
            <div className="skills-grid">
              {SKILLS.map(skill => (
                <SkillCard
                  key={skill.key}
                  skill={skill}
                  state={skillStates[skill.key]}
                  onRun={key => { setAnalysisUrl(url); runSkill(key) }}
                  isRunningAll={isRunningAll}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
