import { useEffect, useState } from 'react';
import { CheckCircle2, Cloud, LogIn, LogOut, RefreshCw, UserPlus } from 'lucide-react';
import {
  getCloudSession,
  loginCloudAccount,
  pushProgressToCloud,
  registerCloudAccount,
  setCloudSession,
  type CloudSession,
} from '@/lib/cloudSync';
import { getProgress, mergeProgressState } from '@/lib/progress';

export default function CloudSyncPanel() {
  const [session, setSession] = useState<CloudSession | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSession(getCloudSession());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === 'register') {
      const res = await registerCloudAccount(email, password, name, getProgress());
      if (res.ok) {
        setSession(res.session);
        setMessage('Account created and your current progress is now synced to the cloud.');
        setPassword('');
      } else {
        setError(res.error);
      }
    } else {
      const res = await loginCloudAccount(email, password);
      if (res.ok) {
        const merged = mergeProgressState(res.progress);
        await pushProgressToCloud(merged);
        setSession(res.session);
        setMessage('Signed in and merged your cloud + browser progress.');
        setPassword('');
      } else {
        setError(res.error);
      }
    }
    setBusy(false);
  };

  const handleManualSync = async () => {
    setBusy(true);
    setMessage(null);
    setError(null);
    const ok = await pushProgressToCloud(getProgress());
    if (ok) {
      setMessage('Cloud progress synced just now.');
    } else {
      setError('Sync failed. Try signing in again.');
    }
    setBusy(false);
  };

  const handleLogout = () => {
    setCloudSession(null);
    setSession(null);
    setMessage('Signed out. Your local browser progress remains intact.');
  };

  if (session) {
    return (
      <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                Cloud Sync Active
              </p>
              <p className="text-sm font-bold text-[var(--text)]">
                {session.user.name} <span className="font-normal text-[var(--text-muted)]">({session.user.email})</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        {message && <p className="mt-3 text-xs font-medium text-[var(--success)]">{message}</p>}
        {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[var(--text)]">Cloud Progress Sync (Optional)</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Create a free account to sync completed lessons and certificates across devices.
            </p>
          </div>
        </div>
        <div className="flex rounded-2xl bg-[var(--bg-subtle)] p-1">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              mode === 'register'
                ? 'bg-[var(--bg-elevated)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-muted)]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              mode === 'login'
                ? 'bg-[var(--bg-elevated)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-muted)]'
            }`}
          >
            Sign In
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {mode === 'register' && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="min-h-11 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="min-h-11 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ chars)"
          minLength={6}
          required
          className="min-h-11 rounded-2xl bg-[var(--bg-subtle)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60 sm:col-span-3 md:col-span-1"
        >
          {mode === 'register' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          <span>{busy ? 'Please wait...' : mode === 'register' ? 'Enable Cloud Sync' : 'Sign In & Sync'}</span>
        </button>
      </form>

      {message && <p className="mt-3 text-xs font-medium text-[var(--success)]">{message}</p>}
      {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
