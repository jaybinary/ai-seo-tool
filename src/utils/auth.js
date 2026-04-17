// localStorage-based auth helpers (no backend needed for MVP)

const AUTH_KEY = 'pageiq_user';
const HISTORY_KEY = 'pageiq_history';

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getUser();
}

export function login(email, password) {
  // In a real app this would hit an API. For MVP we simulate auth.
  if (!email || !password) return { error: 'Email and password required' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };

  // Check if existing user in localStorage
  const existing = localStorage.getItem('pageiq_account_' + email);
  if (existing) {
    const account = JSON.parse(existing);
    if (account.password !== password) return { error: 'Invalid password' };
    const user = { email, name: account.name, plan: account.plan || 'free', createdAt: account.createdAt };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { user };
  }
  return { error: 'No account found. Please sign up.' };
}

export function signup(name, email, password) {
  if (!name || !email || !password) return { error: 'All fields required' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };
  if (!email.includes('@')) return { error: 'Invalid email address' };

  const existing = localStorage.getItem('pageiq_account_' + email);
  if (existing) return { error: 'Account already exists. Please log in.' };

  const account = { name, email, password, plan: 'free', createdAt: new Date().toISOString() };
  localStorage.setItem('pageiq_account_' + email, JSON.stringify(account));

  const user = { email, name, plan: 'free', createdAt: account.createdAt };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { user };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// ── Audit history ─────────────────────────────────────────────────────────────

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAudit(url, results) {
  const history = getHistory();
  const entry = {
    id: Date.now().toString(),
    url,
    domain: (() => { try { return new URL(url).hostname; } catch { return url; } })(),
    analyzedAt: new Date().toISOString(),
    skillCount: Object.keys(results).length,
    overallScore: (() => {
      const scores = Object.values(results)
        .filter(r => r.status === 'success' && r.data?.score != null)
        .map(r => r.data.score);
      return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    })(),
    results,
  };
  history.unshift(entry);
  // Keep last 20 audits
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  return entry;
}

export function deleteAudit(id) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
