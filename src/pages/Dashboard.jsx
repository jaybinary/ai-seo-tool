import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getHistory, deleteAudit } from '../utils/auth.js';

export default function Dashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/login');
      return;
    }
    if (profile) {
      loadHistory();
    }
  }, [profile, loading]);

  async function loadHistory() {
    setHistoryLoading(true);
    const data = await getHistory();
    setHistory(data);
    setHistoryLoading(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);
    await deleteAudit(id);
    setHistory(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  }

  function handleView(entry) {
    navigate('/audit', { state: { savedReport: entry } });
  }

  function getScoreColor(score) {
    if (!score) return '#94a3b8';
    if (score >= 70) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  const totalAudits = history.length;
  const avgScore = history.length
    ? Math.round(history.filter(a => a.overall_score).reduce((sum, a) => sum + (a.overall_score || 0), 0) / history.filter(a => a.overall_score).length) || 0
    : 0;
  const uniqueDomains = new Set(history.map(a => a.domain)).size;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}</h1>
          <p className="dashboard-sub">Your SEO audit history and insights</p>
        </div>
        <Link to="/audit" className="btn-primary">+ New Audit</Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{totalAudits}</div>
          <div className="stat-label">Total Audits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgScore || '—'}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueDomains}</div>
          <div className="stat-label">Unique Domains</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profile?.plan || 'free'}</div>
          <div className="stat-label">Current Plan</div>
        </div>
      </div>

      <div className="dashboard-history">
        <h2>Audit History</h2>

        {historyLoading ? (
          <div className="dashboard-loading">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="dashboard-empty">
            <p>No audits yet. Run your first audit to see results here.</p>
            <Link to="/audit" className="btn-primary">Run First Audit</Link>
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Date</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.id} style={{ opacity: deletingId === entry.id ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                    <td className="history-url">
                      <div className="history-domain">{entry.domain}</div>
                      <div className="history-full-url">{entry.url}</div>
                    </td>
                    <td>{formatDate(entry.created_at)}</td>
                    <td>{entry.skills_run?.length || 0} skills</td>
                    <td>
                      <span
                        className="score-badge"
                        style={{ background: getScoreColor(entry.overall_score) }}
                      >
                        {entry.overall_score || '—'}
                      </span>
                    </td>
                    <td className="history-actions">
                      <button
                        className="btn-ghost btn-sm"
                        onClick={() => handleView(entry)}
                      >
                        View
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
