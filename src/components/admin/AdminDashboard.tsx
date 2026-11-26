import { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Users,
} from 'lucide-react';
import { getApiBase } from '@/lib/cloudSync';

interface AdminStats {
  totals: {
    totalViews: number;
    todayViews: number;
    totalUsers: number;
    totalCertificates: number;
    totalRuns: number;
    avgExamScore: number;
  };
  viewsByDay: Array<{ day: string; views: number }>;
  topCourses: Array<{ courseSlug: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  runnerBreakdown: Array<{ language: string; runs: number }>;
  recentCertificates: Array<{
    certId: string;
    learnerName: string;
    courseSlug: string;
    courseTitle: string;
    score: number;
    issuedAt: string;
  }>;
}

const ADMIN_SESSION_KEY = 'devpath_admin_key_v1';

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/admin/stats`, {
        headers: { 'X-Admin-Key': trimmed },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unauthorized');
        setStats(null);
        if (res.status === 401) {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
          setAdminKey('');
        }
      } else {
        setStats(data as AdminStats);
        setAdminKey(trimmed);
        sessionStorage.setItem(ADMIN_SESSION_KEY, trimmed);
      }
    } catch {
      setError('Could not reach DevPath Analytics API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      void loadStats(saved);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    void loadStats(inputKey);
  };

  const handleLock = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminKey('');
    setInputKey('');
    setStats(null);
  };

  if (!stats) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-[var(--bg-elevated)] p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-[var(--text)]">Admin Analytics Access</h2>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Enter your server admin key to view privacy-friendly DevPath traffic, compiler usage, and certificate metrics.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-3">
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter DEVPATH_ADMIN_KEY..."
            required
            className="min-h-12 w-full rounded-2xl bg-[var(--bg-muted)] px-4 py-3 font-mono text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            <BarChart3 className="h-4 w-4" />
            <span>{loading ? 'Unlocking...' : 'Unlock Dashboard'}</span>
          </button>
        </form>

        {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }

  const maxDayViews = Math.max(1, ...stats.viewsByDay.map((d) => d.views));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          Cookieless, zero-PII metrics backed directly by SQLite on your droplet.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadStats(adminKey)}
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-elevated)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLock}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <Lock className="h-4 w-4" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Eye className="h-4 w-4 text-[var(--accent)]" />
            Page Views
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">
            {stats.totals.totalViews.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--success)]">
            +{stats.totals.todayViews} today (UTC)
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Users className="h-4 w-4 text-[var(--accent)]" />
            Cloud Sync Accounts
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">
            {stats.totals.totalUsers.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Registered learners</p>
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Award className="h-4 w-4 text-[var(--success)]" />
            Certificates Issued
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--success)]">
            {stats.totals.totalCertificates.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Avg score: {stats.totals.avgExamScore}%
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Terminal className="h-4 w-4 text-[var(--accent)]" />
            Live Code Runs
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">
            {stats.totals.totalRuns.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Via /api/run compiler</p>
        </div>
      </div>

      {/* 14-Day Traffic Bar Chart */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
        <h2 className="text-base font-extrabold text-[var(--text)]">Page Views (Last 14 Days)</h2>
        <div className="mt-6 flex h-44 items-end gap-2">
          {stats.viewsByDay.map((d) => {
            const pct = Math.max(4, Math.round((d.views / maxDayViews) * 100));
            return (
              <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-36 w-full items-end">
                  <div
                    style={{ height: `${pct}%` }}
                    title={`${d.day}: ${d.views} views`}
                    className="w-full rounded-t-xl bg-[var(--accent)]/85 transition group-hover:bg-[var(--accent)]"
                  />
                </div>
                <span className="text-[10px] font-medium text-[var(--text-subtle)]">
                  {d.day.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Tracks + Compiler Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <h2 className="text-base font-extrabold text-[var(--text)]">Most Popular Tracks</h2>
          {stats.topCourses.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-muted)]">No course views logged yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {stats.topCourses.map((c) => (
                <li
                  key={c.courseSlug}
                  className="flex items-center justify-between rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm"
                >
                  <span className="font-semibold text-[var(--text)]">{c.courseSlug}</span>
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {c.views} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <h2 className="text-base font-extrabold text-[var(--text)]">Live Compiler Usage</h2>
          {stats.runnerBreakdown.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-muted)]">No live code runs logged yet.</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {stats.runnerBreakdown.map((r) => (
                <li
                  key={r.language}
                  className="flex items-center justify-between rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm"
                >
                  <span className="font-mono font-bold uppercase text-[var(--text)]">{r.language}</span>
                  <span className="font-mono text-xs font-bold text-[var(--success)]">
                    {r.runs} runs
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
        <h2 className="text-base font-extrabold text-[var(--text)]">Recent Verified Certificates</h2>
        {stats.recentCertificates.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">No certificates issued yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">
                  <th className="pb-3 pr-4">Learner</th>
                  <th className="pb-3 pr-4">Track</th>
                  <th className="pb-3 pr-4">Score</th>
                  <th className="pb-3 pr-4">Issued</th>
                  <th className="pb-3 text-right">Verify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {stats.recentCertificates.map((c) => (
                  <tr key={c.certId}>
                    <td className="py-3 pr-4 font-semibold text-[var(--text)]">{c.learnerName}</td>
                    <td className="py-3 pr-4 text-[var(--text-muted)]">{c.courseTitle}</td>
                    <td className="py-3 pr-4 font-bold text-[var(--success)]">{c.score}%</td>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--text-muted)]">{c.issuedAt}</td>
                    <td className="py-3 text-right">
                      <a
                        href={`/verify?id=${encodeURIComponent(c.certId)}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {c.certId}
                      </a>
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
