import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory, deleteAudit } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  // Stats from history (uses Supabase field names)
  const scoredAudits = history.filter(h => h.overall_score != null);
  const avgScore = scoredAudits.length
    ? Math.round(scoredAudits.reduce((a, h) => a + h.overall_score, 0) / scoredAudits.length)
    : null;
  const uniqueDomains = new Set(history.map(h => h.domain)).size;
  const plan = profile?.plan || 'free';

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

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{history.length}</div>
          <div className="stat-label">Total Audits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgScore ?? '—'}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueDomains}</div>
          <div className="stat-label">Unique Domains</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
          <div className="stat-label">Current Plan</div>
        </div>
      </div>

      {/* History */}
      <div className="dashboard-history">
        <h2>Audit History</h2>

        {histLoading ? (
          <div className="dashboard-loading">Loading your audits…</div>
        ) : history.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p>No audits yet. Run your first AI SEO audit to see results here.</p>
            <Link to="/audit" className="btn-primary" style={{ marginTop: 8 }}>Run Your First Audit →</Link>
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
                  const date = entry.created_at || entry.analyzedAt;
                  return (
                    <tr
                      key={entry.id}
                      style={{ opacity: deletingId === entry.id ? 0.3 : 1, transition: 'opacity .3s' }}
                    >
                      <td>
                        <div className="history-domain">{entry.domain}</div>
                        <div className="history-full-url">{entry.url}</div>
                      </td>
                      <td>{formatDate(date)}</td>
                      <td>
                        {score != null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              className="score-badge"
                              style={{ background: color, minWidth: 38, textAlign: 'center' }}
                            >
                              {score}
                            </span>
                            <span style={{ fontSize: 12, color, fontWeight: 600 }}>{grade}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-3)', fontSize: 13 }}>No score</span>
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
