import { useState, useCallback } from 'react'

// ─── Skill Definitions ────────────────────────────────────────────────────────

const SKILLS = [
  { key: 'eeat',     name: 'E-E-A-T Audit',             icon: '🔍', desc: 'Experience, Expertise, Authority & Trust signals', scoreKey: 'score' },
  { key: 'rewrite',  name: 'AI Content Rewrite',         icon: '✍️', desc: 'Optimized for SGE, Perplexity & ChatGPT',         scoreKey: 'ai_readability_score' },
  { key: 'schema',   name: 'Schema Markup',               icon: '🏷️', desc: 'JSON-LD structured data generation',              scoreKey: null },
  { key: 'querymap', name: 'Conversational Query Map',    icon: '💬', desc: 'Voice & AI question-based query targeting',       scoreKey: 'total_opportunity_score' },
  { key: 'entities', name: 'Entity Coverage',             icon: '🧠', desc: 'Semantic entity & knowledge graph gaps',          scoreKey: 'topic_coverage_score' },
  { key: 'brief',    name: 'Content Brief',               icon: '📋', desc: 'Full brief with headings, keywords & structure',  scoreKey: null },
  { key: 'meta',     name: 'Title & Description',         icon: '🎯', desc: 'CTR-optimized meta tags with variations',         scoreKey: null },
  { key: 'linking',  name: 'Internal Linking Map',        icon: '🔗', desc: 'Internal link opportunities & silo structure',    scoreKey: null },
  { key: 'topical',  name: 'Topical Authority Cluster',   icon: '🗺️', desc: 'Pillar + cluster content architecture map',       scoreKey: 'topical_authority_score' },
  { key: 'citation', name: 'AI Citation Optimizer',       icon: '📣', desc: 'Get cited inside ChatGPT, Perplexity & SGE',     scoreKey: 'citation_score' },
]

const SKILL_COLORS = {
  eeat: '#667eea', rewrite: '#f093fb', schema: '#4facfe', querymap: '#43e97b',
  entities: '#fa709a', brief: '#ffecd2', meta: '#a18cd1', linking: '#fccb90',
  topical: '#d299c2', citation: '#89f7fe'
}

// ─── Score Badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  if (!score && score !== 0) return null
  const cls = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'
  const emoji = score >= 70 ? '✅' : score >= 40 ? '⚠️' : '❌'
  return <span className={`score-badge score-${cls}`}>{emoji} Score: {score}/100</span>
}

// ─── Result Renderer ──────────────────────────────────────────────────────────

function renderResult(skillKey, data) {
  if (!data) return null

  const renderList = (items, title) => {
    if (!items || items.length === 0) return null
    return (
      <div className="result-section">
        <div className="result-section-title">{title}</div>
        <ul className="result-list">
          {items.slice(0, 5).map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      </div>
    )
  }

  switch (skillKey) {
    case 'eeat':
      return <>
        <ScoreBadge score={data.score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {renderList(data.priority_fixes, '🔧 Priority Fixes')}
        {['experience','expertise','authoritativeness','trustworthiness'].map(dim => (
          data[dim] && <div key={dim} className="result-section">
            <div className="result-section-title">{dim.toUpperCase()} — {data[dim].score}/100</div>
            <ul className="result-list">
              {(data[dim].recommendations || []).slice(0,2).map((r,i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        ))}
      </>

    case 'rewrite':
      return <>
        <ScoreBadge score={data.ai_readability_score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {renderList(data.key_changes, '✅ Key Changes Made')}
        {data.rewritten_content && (
          <div className="result-section">
            <div className="result-section-title">📄 Rewritten Content (Preview)</div>
            <div className="code-block">{data.rewritten_content.slice(0, 600)}...</div>
          </div>
        )}
      </>

    case 'schema':
      return <>
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {(data.schemas || []).map((s, i) => (
          <div key={i} className="result-section">
            <div className="result-section-title">📦 {s.type} Schema — Place in: {s.placement}</div>
            <div className="code-block">{JSON.stringify(s.json_ld, null, 2).slice(0, 400)}...</div>
          </div>
        ))}
        {renderList(data.implementation_notes, '📝 Implementation Notes')}
      </>

    case 'querymap':
      return <>
        <ScoreBadge score={data.total_opportunity_score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {data.primary_queries && (
          <div className="result-section">
            <div className="result-section-title">🎯 Primary Queries ({data.primary_queries.length})</div>
            <ul className="result-list">
              {data.primary_queries.slice(0,5).map((q,i) => (
                <li key={i}><strong>{q.query}</strong> — {q.intent} [{q.priority}]</li>
              ))}
            </ul>
          </div>
        )}
        {renderList(data.voice_search_queries, '🎤 Voice Search Queries')}
        {renderList(data.missing_queries, '⚠️ Missing Queries')}
      </>

    case 'entities':
      return <>
        <ScoreBadge score={data.topic_coverage_score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {data.covered_entities && (
          <div className="result-section">
            <div className="result-section-title">✅ Covered Entities ({data.covered_entities.length})</div>
            <div className="tag-row">
              {data.covered_entities.slice(0,8).map((e,i) => (
                <span key={i} className="tag">{e.entity} ({e.type})</span>
              ))}
            </div>
          </div>
        )}
        {data.missing_entities && (
          <div className="result-section">
            <div className="result-section-title">❌ Missing Entities ({data.missing_entities.length})</div>
            <ul className="result-list">
              {data.missing_entities.slice(0,4).map((e,i) => (
                <li key={i}><strong>{e.entity}</strong> — {e.reason}</li>
              ))}
            </ul>
          </div>
        )}
      </>

    case 'brief':
      return <>
        {data.summary && <div className="result-summary">{data.summary}</div>}
        <div className="result-section">
          <div className="result-section-title">🎯 Target</div>
          <div className="tag-row">
            <span className="tag">Audience: {data.target_audience}</span>
            <span className="tag">Words: ~{data.recommended_word_count}</span>
            <span className="tag">Tone: {data.tone}</span>
          </div>
        </div>
        {renderList(data.secondary_keywords, '🔑 Keywords')}
        {data.content_structure && (
          <div className="result-section">
            <div className="result-section-title">📐 Content Structure</div>
            <ul className="result-list">
              {data.content_structure.slice(0,6).map((s,i) => (
                <li key={i}><strong>{s.section}:</strong> {s.heading}</li>
              ))}
            </ul>
          </div>
        )}
      </>

    case 'meta':
      return <>
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {data.recommended_combination && (
          <div className="result-section">
            <div className="result-section-title">⭐ Best Combination</div>
            <div className="result-summary" style={{borderLeftColor: '#48bb78'}}>
              <strong>Title:</strong> {data.recommended_combination.title}<br/>
              <strong>Desc:</strong> {data.recommended_combination.description}
            </div>
          </div>
        )}
        {data.title_tags && (
          <div className="result-section">
            <div className="result-section-title">📝 All Title Variations</div>
            <ul className="result-list">
              {data.title_tags.map((t,i) => (
                <li key={i}>[{t.score}/100] {t.title} <em style={{color:'#4a5568'}}>({t.type})</em></li>
              ))}
            </ul>
          </div>
        )}
      </>

    case 'linking':
      return <>
        {data.summary && <div className="result-summary">{data.summary}</div>}
        <div className="tag-row" style={{marginBottom: 12}}>
          <span className="tag">Page Type: {data.page_type}</span>
          <span className="tag">Orphan Risk: {data.orphan_risk}</span>
        </div>
        {data.link_opportunities && (
          <div className="result-section">
            <div className="result-section-title">🔗 Link Opportunities ({data.link_opportunities.length})</div>
            <ul className="result-list">
              {data.link_opportunities.slice(0,5).map((l,i) => (
                <li key={i}><strong>"{l.anchor_text}"</strong> → {l.target_topic} [{l.priority}]</li>
              ))}
            </ul>
          </div>
        )}
        {renderList(data.silo_recommendations, '🏛️ Silo Recommendations')}
      </>

    case 'topical':
      return <>
        <ScoreBadge score={data.topical_authority_score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        <div className="tag-row" style={{marginBottom: 12}}>
          <span className="tag">Main Topic: {data.main_topic}</span>
        </div>
        {data.cluster_pages && (
          <div className="result-section">
            <div className="result-section-title">📑 Cluster Pages to Create ({data.cluster_pages.length})</div>
            <ul className="result-list">
              {data.cluster_pages.slice(0,5).map((c,i) => (
                <li key={i}><strong>{c.suggested_title}</strong> — ~{c.word_count} words [{c.relationship}]</li>
              ))}
            </ul>
          </div>
        )}
        {renderList(data.quick_wins, '⚡ Quick Wins')}
      </>

    case 'citation':
      return <>
        <ScoreBadge score={data.citation_score} />
        {data.summary && <div className="result-summary">{data.summary}</div>}
        {data.ai_engine_specific && (
          <div className="result-section">
            <div className="result-section-title">🤖 Per AI Engine Tips</div>
            <ul className="result-list">
              <li><strong>Perplexity:</strong> {data.ai_engine_specific.perplexity}</li>
              <li><strong>ChatGPT:</strong> {data.ai_engine_specific.chatgpt}</li>
              <li><strong>Google SGE:</strong> {data.ai_engine_specific.google_sge}</li>
            </ul>
          </div>
        )}
        {renderList(data.action_items, '✅ Action Items')}
      </>

    default:
      return <div className="code-block">{JSON.stringify(data, null, 2).slice(0, 500)}</div>
  }
}

// ─── Skill Card ───────────────────────────────────────────────────────────────

function SkillCard({ skill, state, onRun, isRunningAll }) {
  const [expanded, setExpanded] = useState(false)
  const color = SKILL_COLORS[skill.key]

  const statusLabel = { idle: 'Ready', running: 'Running...', success: 'Done', error: 'Error' }
  const statusClass  = state.status

  return (
    <div className={`skill-card ${statusClass}`}>
      <div className="skill-card-header" onClick={() => state.status !== 'idle' && setExpanded(e => !e)}>
        <div className="skill-icon" style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}>
          {skill.icon}
        </div>
        <div className="skill-info">
          <h3>{skill.name}</h3>
          <p>{skill.desc}</p>
        </div>
        <span className={`skill-status ${statusClass}`}>
          {statusLabel[state.status]}
        </span>
        <button
          className="btn-run-skill"
          disabled={state.status === 'running' || isRunningAll}
          onClick={e => { e.stopPropagation(); onRun(skill.key) }}
        >
          {state.status === 'running' ? '...' : state.status === 'success' ? '↺ Re-run' : '▶ Run'}
        </button>
      </div>

      {state.status === 'running' && (
        <div className="loading-dots">
          <span/><span/><span/>
          <span style={{fontSize:13, color:'#718096', marginLeft:6}}>Analyzing with Claude AI...</span>
        </div>
      )}

      {state.status === 'error' && (
        <div className="error-msg">⚠️ {state.error}</div>
      )}

      {state.status === 'success' && (
        <div className="skill-result">
          {renderResult(skill.key, state.data)}
          <button className="btn-copy" onClick={() => navigator.clipboard.writeText(JSON.stringify(state.data, null, 2))}>
            📋 Copy Raw JSON
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [url, setUrl] = useState('')
  const [skillStates, setSkillStates] = useState(() =>
    Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }]))
  )
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [analysisUrl, setAnalysisUrl] = useState('')

  const setSkillState = (key, update) =>
    setSkillStates(prev => ({ ...prev, [key]: { ...prev[key], ...update } }))

  const runSkill = useCallback(async (skillKey, targetUrl) => {
    const u = targetUrl || analysisUrl
    if (!u) return

    setSkillState(skillKey, { status: 'running', data: null, error: null })
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

      setSkillState(skillKey, { status: 'success', data: result?.data })
    } catch (e) {
      setSkillState(skillKey, { status: 'error', error: e.message })
    }
  }, [analysisUrl])

  const runAll = async () => {
    if (!url.trim()) return alert('Please enter a URL first')
    const trimmedUrl = url.trim()
    setAnalysisUrl(trimmedUrl)
    setIsRunningAll(true)
    setProgress({ done: 0, total: SKILLS.length })

    // Reset all
    setSkillStates(Object.fromEntries(SKILLS.map(s => [s.key, { status: 'idle', data: null, error: null }])))

    for (const skill of SKILLS) {
      await runSkill(skill.key, trimmedUrl)
      setProgress(p => ({ ...p, done: p.done + 1 }))
    }

    setIsRunningAll(false)
  }

  const exportJSON = () => {
    const results = {}
    SKILLS.forEach(s => {
      if (skillStates[s.key].status === 'success') results[s.key] = { name: s.name, data: skillStates[s.key].data }
    })
    const blob = new Blob([JSON.stringify({ url: analysisUrl, exported_at: new Date().toISOString(), results }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `seo-report-${Date.now()}.json`
    a.click()
  }

  const generateReportHTML = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const completedSkills = SKILLS.filter(s => skillStates[s.key].status === 'success')

    const renderScore = (score) => {
      if (!score && score !== 0) return ''
      const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
      const label = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor'
      return `<span style="background:${color}22;color:${color};border:1px solid ${color}44;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700">${score}/100 · ${label}</span>`
    }

    const renderSkillSection = (skill) => {
      const state = skillStates[skill.key]
      if (state.status !== 'success') return ''
      const d = state.data
      const color = SKILL_COLORS[skill.key]

      let content = ''

      if (d.summary) content += `<p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 16px;padding:12px 16px;background:#f8fafc;border-left:3px solid ${color};border-radius:0 8px 8px 0">${d.summary}</p>`

      const scoreVal = skill.scoreKey ? d[skill.scoreKey] : null
      if (scoreVal !== undefined && scoreVal !== null) content += `<div style="margin-bottom:14px">${renderScore(scoreVal)}</div>`

      const renderList = (items, title) => {
        if (!items || items.length === 0) return ''
        const rows = items.slice(0, 6).map(item => {
          const text = typeof item === 'object' ? JSON.stringify(item) : item
          return `<li style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569">${text}</li>`
        }).join('')
        return `<div style="margin-bottom:16px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:8px">${title}</div><ul style="list-style:none;margin:0;padding:0">${rows}</ul></div>`
      }

      switch (skill.key) {
        case 'eeat':
          content += renderList(d.priority_fixes, '🔧 Priority Fixes')
          ;['experience','expertise','authoritativeness','trustworthiness'].forEach(dim => {
            if (d[dim]) content += renderList(d[dim].recommendations, `${dim.toUpperCase()} (${d[dim].score}/100)`)
          })
          break
        case 'rewrite':
          content += renderList(d.key_changes, '✅ Key Changes')
          if (d.rewritten_content) content += `<div style="margin-top:12px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:8px">📄 Rewritten Content</div><div style="background:#0f172a;color:#86efac;padding:14px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;overflow-x:auto">${d.rewritten_content.slice(0,800)}...</div></div>`
          break
        case 'schema':
          ;(d.schemas || []).forEach(s => {
            content += `<div style="margin-bottom:14px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:8px">📦 ${s.type} Schema — Place in: ${s.placement}</div><div style="background:#0f172a;color:#86efac;padding:14px;border-radius:8px;font-family:monospace;font-size:11px;white-space:pre-wrap;overflow-x:auto">${JSON.stringify(s.json_ld, null, 2).slice(0,600)}</div></div>`
          })
          content += renderList(d.implementation_notes, '📝 Implementation Notes')
          break
        case 'querymap':
          if (d.primary_queries) content += renderList(d.primary_queries.map(q => `${q.query} — ${q.intent} [${q.priority}]`), '🎯 Primary Queries')
          content += renderList(d.voice_search_queries, '🎤 Voice Search Queries')
          content += renderList(d.missing_queries, '⚠️ Missing Queries')
          break
        case 'entities':
          if (d.covered_entities) {
            const tags = d.covered_entities.slice(0,10).map(e => `<span style="background:#e2e8f0;color:#475569;padding:3px 8px;border-radius:5px;font-size:12px;margin:2px;display:inline-block">${e.entity} (${e.type})</span>`).join('')
            content += `<div style="margin-bottom:14px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:8px">✅ Covered Entities</div><div>${tags}</div></div>`
          }
          content += renderList((d.missing_entities || []).map(e => `${e.entity} — ${e.reason}`), '❌ Missing Entities')
          break
        case 'brief':
          content += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${[`Audience: ${d.target_audience}`,`Words: ~${d.recommended_word_count}`,`Tone: ${d.tone}`].map(t=>`<span style="background:#e2e8f0;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px">${t}</span>`).join('')}</div>`
          content += renderList(d.secondary_keywords, '🔑 Target Keywords')
          content += renderList((d.content_structure||[]).map(s=>`${s.section}: ${s.heading}`), '📐 Content Structure')
          break
        case 'meta':
          if (d.recommended_combination) content += `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:14px;margin-bottom:14px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#16a34a;margin-bottom:8px">⭐ Best Combination</div><div style="font-size:13px;color:#166534"><strong>Title:</strong> ${d.recommended_combination.title}<br/><strong>Desc:</strong> ${d.recommended_combination.description}<br/><em style="color:#4ade80">${d.recommended_combination.reasoning}</em></div></div>`
          content += renderList((d.title_tags||[]).map(t=>`[${t.score}/100] ${t.title}`), '📝 Title Variations')
          break
        case 'linking':
          content += renderList((d.link_opportunities||[]).map(l=>`"${l.anchor_text}" → ${l.target_topic} [${l.priority}]`), '🔗 Link Opportunities')
          content += renderList(d.silo_recommendations, '🏛️ Silo Recommendations')
          break
        case 'topical':
          content += renderList((d.cluster_pages||[]).map(c=>`${c.suggested_title} (~${c.word_count} words)`), '📑 Cluster Pages to Create')
          content += renderList(d.quick_wins, '⚡ Quick Wins')
          if (d.long_term_strategy) content += `<div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:12px;font-size:13px;color:#713f12"><strong>📅 Long-term Strategy:</strong> ${d.long_term_strategy}</div>`
          break
        case 'citation':
          if (d.ai_engine_specific) content += renderList([`Perplexity: ${d.ai_engine_specific.perplexity}`,`ChatGPT: ${d.ai_engine_specific.chatgpt}`,`Google SGE: ${d.ai_engine_specific.google_sge}`], '🤖 Per AI Engine Tips')
          content += renderList(d.action_items, '✅ Action Items')
          break
      }

      return `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:24px;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f1f5f9">
            <div style="width:40px;height:40px;border-radius:10px;background:${color}22;border:1.5px solid ${color}44;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${skill.icon}</div>
            <div><h3 style="margin:0;font-size:16px;font-weight:700;color:#0f172a">${skill.name}</h3><p style="margin:0;font-size:12px;color:#94a3b8">${skill.desc}</p></div>
            <span style="margin-left:auto;background:#dcfce7;color:#16a34a;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">✓ Completed</span>
          </div>
          ${content}
        </div>`
    }

    const overallScores = SKILLS
      .filter(s => s.scoreKey && skillStates[s.key].status === 'success' && skillStates[s.key].data?.[s.scoreKey])
      .map(s => skillStates[s.key].data[s.scoreKey])
    const avgScore = overallScores.length ? Math.round(overallScores.reduce((a,b) => a+b, 0) / overallScores.length) : null
    const scoreColor = avgScore >= 70 ? '#22c55e' : avgScore >= 40 ? '#f59e0b' : '#ef4444'

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AI SEO Report — ${analysisUrl}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0 }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#f8fafc; color:#0f172a; }
  @media print {
    body { background:#fff }
    .no-print { display:none !important }
    .page-break { page-break-before:always }
  }
</style>
</head>
<body>
<!-- Print Button -->
<div class="no-print" style="position:fixed;top:20px;right:20px;z-index:999;display:flex;gap:10px">
  <button onclick="window.print()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer">🖨️ Save as PDF</button>
  <button onclick="window.close()" style="background:#e2e8f0;color:#475569;border:none;border-radius:8px;padding:10px 20px;font-size:14px;cursor:pointer">✕ Close</button>
</div>

<!-- Header -->
<div style="background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);padding:48px 60px;color:#fff">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px">🚀</div>
      <div>
        <h1 style="font-size:26px;font-weight:800;margin:0">AI SEO Report</h1>
        <p style="color:#94a3b8;margin:4px 0 0;font-size:14px">10-Skill Pipeline · Powered by Claude AI</p>
      </div>
      ${avgScore !== null ? `<div style="margin-left:auto;text-align:center"><div style="font-size:42px;font-weight:800;color:${scoreColor}">${avgScore}</div><div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em">Avg Score</div></div>` : ''}
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:10px;padding:16px 20px;display:flex;gap:32px;flex-wrap:wrap">
      <div><div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Page Analyzed</div><div style="font-size:14px;color:#e2e8f0;margin-top:3px;word-break:break-all">${analysisUrl}</div></div>
      <div><div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Report Date</div><div style="font-size:14px;color:#e2e8f0;margin-top:3px">${date}</div></div>
      <div><div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em">Skills Completed</div><div style="font-size:14px;color:#e2e8f0;margin-top:3px">${completedSkills.length}/10</div></div>
    </div>
  </div>
</div>

<!-- Scores Summary -->
<div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:24px 60px">
  <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">
    ${SKILLS.filter(s => s.scoreKey && skillStates[s.key].status === 'success').map(s => {
      const score = skillStates[s.key].data?.[s.scoreKey]
      const c = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
      return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:800;color:${c}">${score}</div><div style="font-size:11px;color:#94a3b8;margin-top:2px">${s.name}</div></div>`
    }).join('')}
  </div>
</div>

<!-- Skills -->
<div style="max-width:900px;margin:0 auto;padding:32px 60px 60px">
  ${completedSkills.map(s => renderSkillSection(s)).join('')}
</div>

<!-- Footer -->
<div style="background:#0f172a;color:#64748b;text-align:center;padding:24px;font-size:13px">
  Generated by AI SEO Tool · Powered by Claude AI · ${date}
</div>
</body>
</html>`
  }

  const exportPDF = () => {
    const html = generateReportHTML()
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 800)
  }

  const exportHTML = () => {
    const html = generateReportHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `seo-report-${new URL(analysisUrl).hostname}-${Date.now()}.html`
    a.click()
  }

  const completedCount = SKILLS.filter(s => skillStates[s.key].status === 'success').length
  const hasResults = completedCount > 0
  const progressPct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">🚀</div>
        <div>
          <h1>AI SEO Tool</h1>
          <p>10-Skill Pipeline — Powered by Claude AI</p>
        </div>
        <span className="badge">Path A · Claude API</span>
      </header>

      {/* URL Input */}
      <section className="url-section">
        <h2>Enter Page URL</h2>
        <div className="url-input-row">
          <input
            className="url-input"
            type="url"
            placeholder="https://yourwebsite.com/page-to-analyze"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAll()}
            disabled={isRunningAll}
          />
          <button className="btn-run-all" onClick={runAll} disabled={isRunningAll || !url.trim()}>
            {isRunningAll ? `Running ${progress.done}/${progress.total}...` : '▶ Run All 10 Skills'}
          </button>
          {hasResults && (<>
            <button className="btn-export" onClick={exportPDF}>🖨️ Export PDF</button>
            <button className="btn-export" onClick={exportHTML}>🌐 Export HTML</button>
            <button className="btn-export" onClick={exportJSON}>{ }⬇ JSON</button>
          </>)}
        </div>

        {isRunningAll && (
          <div className="progress-bar-wrap">
            <div className="progress-label">
              <span>Running skills pipeline...</span>
              <span>{progressPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
      </section>

      {/* Skills Grid */}
      <section className="skills-section">
        <h2>10 SEO Skills {hasResults && `— ${completedCount} Completed`}</h2>

        {!hasResults && !isRunningAll ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Ready to Analyze</h3>
            <p>Enter a URL above and click "Run All 10 Skills" to start your AI SEO audit</p>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  )
}
