import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { getCloudSession, subscribeCloudSession, type CloudSession } from '@/lib/cloudSync';

export default function AccountStatusPill() {
  const [session, setSession] = useState<CloudSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getCloudSession());
    setReady(true);
    return subscribeCloudSession(setSession);
  }, []);

  if (!ready) {
    return (
      <a
        href="/progress"
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <User className="h-3.5 w-3.5 opacity-70" />
        <span>Guest</span>
      </a>
    );
  }

  if (session) {
    const firstName = session.user.name.trim().split(/\s+/)[0] || 'Account';
    return (
      <a
        href="/progress"
        title={`Signed in as ${session.user.name} (Cloud Sync active)`}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--success-soft)] px-3 text-xs font-bold text-[var(--success)] transition hover:opacity-90"
      >
        <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden="true" />
        <span className="max-w-[96px] truncate">{firstName}</span>
      </a>
    );
  }

  return (
    <a
      href="/progress"
      title="Browsing as Guest (progress saved in this browser). Click to sign in or enable Cloud Sync."
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
    >
      <User className="h-3.5 w-3.5 opacity-75" />
      <span>Guest</span>
    </a>
  );
}
