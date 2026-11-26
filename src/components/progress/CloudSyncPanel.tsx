import { useEffect, useState } from 'react';
import { Check, CheckCircle2, Cloud, Copy, ExternalLink, Globe, KeyRound, LogIn, LogOut, RefreshCw, Save, UserPlus } from 'lucide-react';
import {
  changeAccountPassword,
  fetchMyProfile,
  getCloudSession,
  loginCloudAccount,
  pushProgressToCloud,
  registerCloudAccount,
  setCloudSession,
  updateMyProfile,
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

  // Public profile & account settings
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [copiedProfile, setCopiedProfile] = useState(false);

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const s = getCloudSession();
    setSession(s);
    if (s) {
      setDisplayName(s.user.name);
      void fetchMyProfile().then((p) => {
        if (p) {
          setDisplayName(p.name || s.user.name);
          setHandle(p.handle);
          setBio(p.bio);
          setIsPublic(p.isPublic);
        }
      });
    }
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
        setDisplayName(res.session.user.name);
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
        setDisplayName(res.session.user.name);
        void fetchMyProfile().then((p) => {
          if (p) {
            setDisplayName(p.name || res.session.user.name);
            setHandle(p.handle);
            setBio(p.bio);
            setIsPublic(p.isPublic);
          }
        });
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

  const suggestDefaultHandle = (): string => {
    const raw = (session?.user.name || session?.user.email.split('@')[0] || 'learner')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 18);
    if (raw.length >= 3) return raw;
    return `dev-${Math.random().toString(36).slice(2, 7)}`;
  };

  const persistProfile = async (
    nextHandle: string,
    nextBio: string,
    nextPublic: boolean,
    revertToggleOnError = false,
    nextName?: string
  ) => {
    setSavingProfile(true);
    setError(null);
    setMessage(null);
    const cleanHandle = nextHandle.trim().toLowerCase();
    const cleanName = (nextName ?? displayName).trim();
    const res = await updateMyProfile({
      name: cleanName || undefined,
      handle: cleanHandle,
      bio: nextBio.trim(),
      isPublic: nextPublic,
    });
    if (res.ok) {
      if (cleanName && session) {
        setSession({ ...session, user: { ...session.user, name: cleanName } });
      }
      setMessage(
        nextPublic
          ? `Profile saved! Public portfolio is live at /profile?u=${cleanHandle}`
          : 'Profile settings saved (currently private).'
      );
    } else {
      setError(res.error);
      if (revertToggleOnError) {
        setIsPublic(!nextPublic);
      }
    }
    setSavingProfile(false);
  };

  const handleTogglePublic = async (checked: boolean) => {
    let targetHandle = handle.trim().toLowerCase();
    if (checked && !targetHandle) {
      targetHandle = suggestDefaultHandle();
      setHandle(targetHandle);
    }
    setIsPublic(checked);
    await persistProfile(targetHandle, bio, checked, true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistProfile(handle, bio, isPublic, false, displayName);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setError(null);
    setMessage(null);
    const res = await changeAccountPassword(currentPassword, newPassword);
    if (res.ok) {
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } else {
      setError(res.error);
    }
    setSavingPassword(false);
  };

  const handleCopyProfileUrl = async () => {
    if (!handle.trim()) return;
    const url = `${window.location.origin}/profile?u=${encodeURIComponent(handle.trim().toLowerCase())}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedProfile(true);
      setTimeout(() => setCopiedProfile(false), 1600);
    } catch {}
  };

  if (session) {
    return (
      <div className="space-y-4">
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
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Public Portfolio Profile Settings */}
          <form onSubmit={handleSaveProfile} className="mt-6 border-t border-[var(--border)] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="text-sm font-extrabold text-[var(--text)]">Public Portfolio Profile</h3>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={isPublic}
                  disabled={savingProfile}
                  onChange={(e) => void handleTogglePublic(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span>Make profile public</span>
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Full name"
                maxLength={80}
                required
                className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Handle (e.g. jp-dev)"
                className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 font-mono text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio (e.g. Full-stack learner)"
                maxLength={200}
                className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm((v) => !v);
                  setError(null);
                }}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{showPasswordForm ? 'Cancel Password Change' : 'Change Password'}</span>
              </button>

              {isPublic && handle.trim().length >= 3 && (
                <>
                  <a
                    href={`/profile?u=${encodeURIComponent(handle.trim().toLowerCase())}`}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:text-[var(--accent)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Public Profile</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyProfileUrl}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
                  >
                    {copiedProfile ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedProfile ? 'Link Copied' : 'Copy Share Link'}</span>
                  </button>
                </>
              )}
            </div>
          </form>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                required
                className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (6+ chars)"
                minLength={6}
                required
                className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          )}

          {message && <p className="mt-3 text-xs font-medium text-[var(--success)]">{message}</p>}
          {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
        </div>
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
        <div className="flex items-center gap-1 rounded-2xl bg-[var(--bg-muted)] p-1.5">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`min-h-9 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              mode === 'register'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`min-h-9 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              mode === 'login'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
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
            className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ chars)"
          minLength={6}
          required
          className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60 sm:col-span-3 md:col-span-1"
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
