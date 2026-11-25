import type { ProgressState } from './progress';

const SESSION_KEY = 'skillforge_session_v1';

export interface CloudSession {
  token: string;
  user: {
    email: string;
    name: string;
  };
}

export interface VerifiedCertificate {
  certId: string;
  learnerName: string;
  courseSlug: string;
  courseTitle: string;
  score: number;
  total: number;
  issuedAt: string;
}

export function getApiBase(): string {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://159.65.135.59';
  }
  return '';
}

export function getCloudSession(): CloudSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CloudSession) : null;
  } catch {
    return null;
  }
}

export function setCloudSession(session: CloudSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export async function registerCloudAccount(
  email: string,
  password: string,
  name: string,
  progress: ProgressState
): Promise<{ ok: true; session: CloudSession } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, progress }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Could not create account.' };
    const session: CloudSession = { token: data.token, user: data.user };
    setCloudSession(session);
    return { ok: true, session };
  } catch {
    return { ok: false, error: 'Could not reach SkillForge Sync API.' };
  }
}

export async function loginCloudAccount(
  email: string,
  password: string
): Promise<{ ok: true; session: CloudSession; progress: ProgressState } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Invalid email or password.' };
    const session: CloudSession = { token: data.token, user: data.user };
    setCloudSession(session);
    return { ok: true, session, progress: data.progress || { completed: {}, exams: {} } };
  } catch {
    return { ok: false, error: 'Could not reach SkillForge Sync API.' };
  }
}

export async function pushProgressToCloud(progress: ProgressState): Promise<boolean> {
  const session = getCloudSession();
  if (!session) return false;
  try {
    const res = await fetch(`${getApiBase()}/api/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ progress }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function registerPublicCertificate(cert: VerifiedCertificate): Promise<boolean> {
  try {
    const res = await fetch(`${getApiBase()}/api/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cert),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchVerifiedCertificate(
  certId: string
): Promise<VerifiedCertificate | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/certificates/${encodeURIComponent(certId.trim())}`);
    if (!res.ok) return null;
    return (await res.json()) as VerifiedCertificate;
  } catch {
    return null;
  }
}
