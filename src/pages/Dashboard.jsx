import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory, deleteAudit } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

// Plan definitions — monthly audit limits
const PLAN_LIMITS = {
  free:   { label: 'Free',   limit: 10,  color: '#6366f1' },
  pro:    { label: 'Pro',    limit: 50,  color: '#8b5cf6' },
  agency: { label: 'Agency', limit: 999, color: '#059669' },
};

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory]     = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [deletingId, setDeletingId]   = useState(null);

  useEffect(() => {
    if (!loading && !user) { navigate('/login'); return; }
    if (user) {
      getHistory().then(data => {
        setHistory(data);
        setHistLoading(false);
      });
    }
  }, [user, loading]);

  async function handleDelete(id) {
    setDeletingId(id);
    setTimeout(async () => {
      await deleteAudit(id);
      setHistory(h => h.filter(e => e.id !== id));
      setDeletingId(null);
    }, 300);
  }

  function openReport(entry) {
    navigate('/audit', { state: { savedReport: { url: entry.url, results: entry.results } } });
  }

  function scoreColor(score) {
    if (score == null) return '#94a3b8';
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  function scoreGrade(score) {
    if (score == null) return null;
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Fair';
    return 'Poor';
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Stats
  const plan      = profile?.plan || 'free';
  const planInfo  = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const isAgency  = plan === 'agency';

  const scoredAudits = history.filter(h => h.overall_score != null);
  const avgScore = scoredAudits.length
    ? Math.round(scoredAudits.reduce((a, h) => a + h.overall_score, 0) / scoredAudits.length)
    : null;

  // Monthly usage — count audits created this calendar month
  const now = new Date();
  const thisMonthAudits = history.filter(h => {
    const d = new Date(h.created_at || h.analyzedAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const usagePct  = isAgency ? 100 : Math.min((thisMonthAudits / planInfo.limit) * 100, 100);
  const remaining = isAgency ? '∞' : Math.max(planInfo.limit - thisMonthAudits, 0);
  const usageColor = usagePct >= 90 ? '#ef4444' : usagePct >= 70 ? '#f59e0b' : '#10b981';

  if (loading) return (
    <div className="dashboard-page" style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-3)' }}>
      Loading…
    </div>
  );
  if (!user) return null;

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {displayName} 👋</h1>
          <p className="dashboard-sub">Your SEO audit history and insights</p>
        </div>
        <Link to="/audit" className="btn-primary">+ New Audit</Link>
      </div>

      {/* Stats cards */}
      <div className="dashboard-stats">

        {/* Total Audits */}
        <div className="stat-card">
          <div className="stat-number">{history.length}</div>
          <div className="stat-label">Total Audits</div>
        </div>

        {/* Avg Score */}
        <div className="stat-card">
          {avgScore != null ? (
            <>
              <div className="stat-number" style={{ color: scoreColor(avgScore) }}>
                {avgScore}
              </div>
              <div className="stat-label">Avg Score</div>
              <div style={{ fontSize: 11, color: scoreColor(avgScore), fontWeight: 600, marginTop: 2 }}>
                {scoreGrade(avgScore)}
              </div>
            </>
          ) : (
            <>
              <div className="stat-number" style={{ fontSize: 22, color: 'var(--text-3)' }}>—</div>
              <div className="stat-label">Avg Score</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Run an audit to see</div>
            </>
          )}
        </div>

        {/* Monthly Usage with progress bar */}
        <div className="stat-card" style={{ textAlign: 'left', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-3)' }}>
              This Month
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: usageColor }}>
              {isAgency ? '∞' : `${thisMonthAudits}/${planInfo.limit}`}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${isAgency ? 40 : usagePct}%`, background: usageColor, borderRadius: 4, transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {isAgency
              ? 'Unlimited audits'
              : usagePct >= 90
              ? <span style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ Only {remaining} left! <Link to="/pricing" style={{ color: '#ef4444' }}>Upgrade</Link></span>
              : <span>{remaining} audits remaining</span>
            }
          </div>
        </div>

        {/* Current Plan — clickable upgrade card */}
        <Link to="/pricing" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer', border: `1.5px solid ${planInfo.color}30`, background: `${planInfo.color}06`, transition: 'box-shadow .2s' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: planInfo.color, color: '#fff', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
            {planInfo.label.toUpperCase()}
          </div>
          <div className="stat-label" style={{ marginTop: 4 }}>Current Plan</div>
          {plan !== 'agency' && (
            <div style={{ fontSize: 11, color: planInfo.color, fontWeight: 600, marginTop: 4 }}>
              {plan === 'free' ? '⚡ Upgrade for more →' : '🏢 View Agency →'}
            </div>
          )}
        </Link>

      </div>

      {/* History table */}
      <div className="dashboard-history">
        <h2>Audit History</h2>

        {histLoading ? (
          <div className="dashboard-loading">Loading your audits…</div>
        ) : history.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p>No audits yet. Run your first AI SEO audit to see results here.</p>
            <Link to="/audit" className="btn-primary" style={{ marginTop: 8, display: 'inline-block' }}>
              Run Your First Audit →
            </Link>
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>URL / Domain</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => {
                  const score = entry.overall_score;
                  const color = scoreColor(score);
                  const grade = scoreGrade(score);
                  const date  = entry.created_at || entry.analyzedAt;
                  return (
                    <tr key={entry.id} style={{ opacity: deletingId === entry.id ? 0.3 : 1, transition: 'opacity .3s' }}>
                      <td>
                        <div className="history-domain">{entry.domain}</div>
                        <div className="history-full-url">{entry.url}</div>
                      </td>
                      <td>{formatDate(date)}</td>
                      <td>
                        {score != null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="score-badge" style={{ background: color, minWidth: 38, textAlign: 'center' }}>
                              {score}
                            </span>
                            <span style={{ fontSize: 12, color, fontWeight: 600 }}>{grade}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-3)', fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="history-actions">
                          <button className="btn-sm btn-ghost" onClick={() => openReport(entry)}>View</button>
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(entry.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
