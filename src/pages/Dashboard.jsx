import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, getHistory, deleteAudit } from '../utils/auth';
import { COLORS } from '../utils/skills';

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setHistory(getHistory());
  }, []);

  function handleDelete(id) {
    setDeletingId(id);
    setTimeout(() => {
      deleteAudit(id);
      setHistory(getHistory());
      setDeletingId(null);
    }, 300);
  }

  function openReport(entry) {
    // Re-open a saved report by passing results via location state
    navigate('/audit', { state: { savedReport: entry } });
  }

  function scoreColor(score) {
    if (score == null) return '#94a3b8';
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (!user) return null;

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-sub">Welcome back, <strong>{user.name || user.email}</strong></p>
        </div>
        <Link to="/audit" className="dashboard-new-btn">+ New Audit</Link>
      </div>

      {/* Stats row */}
      <div className="dashboard-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-number">{history.length}</div>
          <div className="dash-stat-label">Total Audits</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-number">
            {history.length > 0
              ? Math.round(history.filter(h => h.overallScore != null).reduce((a, h) => a + (h.overallScore || 0), 0) / Math.max(history.filter(h => h.overallScore != null).length, 1))
              : '–'}
          </div>
          <div className="dash-stat-label">Avg Score</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-number">
            {new Set(history.map(h => h.domain)).size}
          </div>
          <div className="dash-stat-label">Unique Domains</div>
        </div>
        <div className="dash-stat-card dash-stat-plan">
          <div className="dash-stat-plan-badge">
            {user.plan === 'pro' ? '⚡ Pro' : user.plan === 'agency' ? '🏢 Agency' : '🆓 Free'}
          </div>
          <div className="dash-stat-label">Current Plan</div>
          {user.plan === 'free' && (
            <Link to="/pricing" className="dash-upgrade-link">Upgrade →</Link>
          )}
        </div>
      </div>

      {/* History table */}
      <div className="dashboard-history">
        <h2 className="dashboard-section-title">Audit History</h2>

        {history.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">📊</div>
            <h3>No audits yet</h3>
            <p>Run your first AI SEO audit to see results here.</p>
            <Link to="/audit" className="dashboard-empty-cta">Run Your First Audit →</Link>
          </div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>URL / Domain</th>
                  <th>Date</th>
                  <th>Skills</th>
                  <th>Avg Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.id} className={deletingId === entry.id ? 'history-row-deleting' : ''}>
                    <td className="history-url-cell">
                      <div className="history-domain">{entry.domain}</div>
                      <div className="history-full-url">{entry.url}</div>
                    </td>
                    <td className="history-date">{formatDate(entry.analyzedAt)}</td>
                    <td className="history-skills">{entry.skillCount}/11</td>
                    <td className="history-score">
                      {entry.overallScore != null ? (
                        <span className="history-score-badge" style={{ background: scoreColor(entry.overallScore) + '22', color: scoreColor(entry.overallScore), border: `1px solid ${scoreColor(entry.overallScore)}44` }}>
                          {entry.overallScore}
                        </span>
                      ) : '–'}
                    </td>
                    <td className="history-actions">
                      <button className="history-view-btn" onClick={() => openReport(entry)}>View →</button>
                      <button className="history-delete-btn" onClick={() => handleDelete(entry.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="dashboard-quick">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/audit" className="quick-action-card">
            <div className="quick-action-icon">🔍</div>
            <div className="quick-action-title">New Audit</div>
            <div className="quick-action-desc">Analyze a new URL with all 11 skills</div>
          </Link>
          <Link to="/pricing" className="quick-action-card">
            <div className="quick-action-icon">⚡</div>
            <div className="quick-action-title">Upgrade Plan</div>
            <div className="quick-action-desc">Unlock more audits and advanced features</div>
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="quick-action-card">
            <div className="quick-action-icon">📖</div>
            <div className="quick-action-title">Documentation</div>
            <div className="quick-action-desc">Learn how to get the most from PageIQ</div>
          </a>
        </div>
      </div>
    </div>
  );
}
