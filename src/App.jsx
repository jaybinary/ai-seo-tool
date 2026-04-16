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

  const exportAll = () => {
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
          {hasResults && (
            <button className="btn-export" onClick={exportAll}>⬇ Export JSON</button>
          )}
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
