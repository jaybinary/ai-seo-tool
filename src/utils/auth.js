import { supabase, normalizeUrl, extractDomain } from './supabase.js'

// ─── AUTH ───────────────────────────────────────────────

export async function signup(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  })
  if (error) throw error
  return data
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile || { id: user.id, email: user.email, full_name: '', plan: 'free' }
}

export async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// ─── AUDIT HISTORY ──────────────────────────────────────

const SCORE_KEYS = {
  eeat: 'score',
  rewrite: 'ai_readability_score',
  querymap: 'total_opportunity_score',
  entities: 'topic_coverage_score',
  topical: 'topical_authority_score',
  citation: 'citation_score',
  urlstructure: 'url_score'
}

function extractScore(key, data) {
  const scoreKey = SCORE_KEYS[key]
  if (!scoreKey || !data) return null
  const score = data[scoreKey]
  return typeof score === 'number' ? Math.round(score) : null
}

function computeOverallScore(skillStates) {
  const scores = []
  Object.entries(skillStates).forEach(([key, state]) => {
    if (state?.result) {
      const s = extractScore(key, state.result)
      if (s !== null) scores.push(s)
    }
  })
  if (!scores.length) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

function computeInsights(skillStates) {
  const topIssues = []
  const quickWins = []
  const strengths = []
  let criticalCount = 0
  let warningCount = 0

  Object.entries(skillStates).forEach(([key, state]) => {
    if (!state?.result) return
    const score = extractScore(key, state.result)
    if (score === null) return

    const skillNames = {
      eeat: 'E-E-A-T', rewrite: 'AI Readability', schema: 'Schema Markup',
      querymap: 'Query Mapping', entities: 'Entity Coverage', brief: 'Content Brief',
      meta: 'Meta Tags', linking: 'Internal Linking', topical: 'Topical Authority',
      citation: 'Citation Quality', urlstructure: 'URL Structure'
    }
    const name = skillNames[key] || key

    if (score < 50) {
      criticalCount++
      topIssues.push(`${name} needs urgent improvement (${score}/100)`)
    } else if (score < 70) {
      warningCount++
      quickWins.push(`Improve ${name} for quick gains (${score}/100)`)
    } else {
      strengths.push(`Strong ${name} (${score}/100)`)
    }
  })

  return {
    critical_count: criticalCount,
    warning_count: warningCount,
    top_issues: topIssues.slice(0, 3),
    quick_wins: quickWins.slice(0, 3),
    strengths: strengths.slice(0, 3)
  }
}

export async function saveAudit(url, skillStates) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const overallScore = computeOverallScore(skillStates)
  const insights = computeInsights(skillStates)
  const skillsRun = Object.entries(skillStates)
    .filter(([, s]) => s?.result)
    .map(([k]) => k)

  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({
      user_id: user.id,
      url,
      url_normalized: normalizeUrl(url),
      domain: extractDomain(url),
      status: 'complete',
      skills_run: skillsRun,
      overall_score: overallScore,
      computed_insights: insights,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (auditError) { console.error('Error saving audit:', auditError); return null }

  const resultRows = Object.entries(skillStates)
    .filter(([, s]) => s?.result || s?.error)
    .map(([key, state]) => ({
      audit_id: audit.id,
      skill_key: key,
      status: state.error ? 'error' : 'success',
      data: state.result || null,
      score: extractScore(key, state.result),
      error_message: state.error || null
    }))

  if (resultRows.length) {
    const { error: resultsError } = await supabase
      .from('audit_results')
      .insert(resultRows)
    if (resultsError) console.error('Error saving audit results:', resultsError)
  }

  return audit
}

export async function getHistory() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) { console.error('Error fetching history:', error); return [] }
  return data || []
}

export async function deleteAudit(id) {
  const { error } = await supabase
    .from('audits')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) console.error('Error deleting audit:', error)
}
