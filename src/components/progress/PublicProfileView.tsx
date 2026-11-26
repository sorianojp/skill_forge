import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  Flame,
  Search,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { fetchPublicProfile, type PublicProfileData } from '@/lib/cloudSync';

export default function PublicProfileView() {
  const [handleInput, setHandleInput] = useState('');
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadHandle = async (h: string) => {
    const clean = h.trim().toLowerCase().replace(/^@/, '');
    if (!clean) return;
    setLoading(true);
    setNotFound(false);
    setProfile(null);
    const data = await fetchPublicProfile(clean);
    if (data) {
      setProfile(data);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URLSearchParams(window.location.search).get('u');
    if (u) {
      setHandleInput(u);
      void loadHandle(u);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().toLowerCase().replace(/^@/, '');
    if (!clean) return;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('u', clean);
      window.history.replaceState({}, '', url.toString());
    }
    void loadHandle(clean);
  };

  const initials = (profile?.name || 'DP')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={handleInput}
          onChange={(e) => setHandleInput(e.target.value)}
          placeholder="Enter learner handle (e.g. jp-dev)"
          className="min-h-12 flex-1 rounded-2xl bg-[var(--bg-elevated)] px-5 py-3 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          <span>{loading ? 'Loading...' : 'View Portfolio'}</span>
        </button>
      </form>

      {profile && (
        <div className="space-y-6">
          {/* Header Card */}
          <section className="rounded-3xl bg-[var(--bg-elevated)] p-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-xl font-black text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-[var(--text)]">{profile.name}</h2>
                  <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-muted)]">
                    @{profile.handle}
                  </span>
                </div>
                {profile.bio && (
                  <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-[var(--bg-muted)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)]">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Lessons Completed</span>
                </div>
                <p className="mt-1.5 text-2xl font-extrabold text-[var(--text)]">
                  {profile.stats.completedLessons}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-muted)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)]">
                  <Award className="h-3.5 w-3.5 text-[var(--success)]" />
                  <span>Certificates</span>
                </div>
                <p className="mt-1.5 text-2xl font-extrabold text-[var(--text)]">
                  {profile.stats.totalCertificates}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-muted)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)]">
                  <Code2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Challenges Solved</span>
                </div>
                <p className="mt-1.5 text-2xl font-extrabold text-[var(--text)]">
                  {profile.stats.solvedChallenges}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-muted)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)]">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  <span>Active Days</span>
                </div>
                <p className="mt-1.5 text-2xl font-extrabold text-[var(--text)]">
                  {profile.stats.activeDays}
                </p>
              </div>
            </div>
          </section>

          {/* Verified Certificates */}
          <section className="rounded-3xl bg-[var(--bg-elevated)] p-7">
            <h3 className="text-lg font-extrabold text-[var(--text)]">
              Verified Certificates ({profile.certificates.length})
            </h3>
            {profile.certificates.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                No certificates earned yet.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {profile.certificates.map((cert) => (
                  <div key={cert.certId} className="rounded-2xl bg-[var(--bg-muted)] p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--success)]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified · Score {cert.score}%</span>
                    </div>
                    <h4 className="mt-2 text-base font-bold text-[var(--text)]">{cert.courseTitle}</h4>
                    <p className="mt-1 font-mono text-xs text-[var(--text-subtle)]">
                      ID: {cert.certId} {cert.issuedAt ? `· Issued ${cert.issuedAt}` : ''}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`/verify?id=${encodeURIComponent(cert.certId)}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold text-[var(--text)] hover:text-[var(--accent)]"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
                        <span>Verify</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                          `${cert.courseTitle} Certificate`
                        )}&organizationName=DevPath&issueYear=${(cert.issuedAt || '2026').slice(0, 4)}&issueMonth=${
                          parseInt((cert.issuedAt || '2026-01').slice(5, 7), 10) || 1
                        }&certUrl=${encodeURIComponent(
                          `https://devpath.mycampus.ph/verify?id=${cert.certId}`
                        )}&certId=${encodeURIComponent(cert.certId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#0a66c2] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Tracks */}
          {Object.keys(profile.coursesProgress).length > 0 && (
            <section className="rounded-3xl bg-[var(--bg-elevated)] p-7">
              <h3 className="text-lg font-extrabold text-[var(--text)]">Tracks In Progress & Completed</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {Object.entries(profile.coursesProgress)
                  .sort((a, b) => b[1] - a[1])
                  .map(([slug, count]) => (
                    <a
                      key={slug}
                      href={`/courses/${slug}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                    >
                      <span>{slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                      <span className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
                        {count} lessons
                      </span>
                    </a>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}

      {notFound && (
        <div className="flex items-start gap-3 rounded-3xl bg-[var(--bg-elevated)] p-7">
          <UserX className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-subtle)]" />
          <div>
            <p className="text-sm font-bold text-[var(--text)]">Learner Profile Not Found</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              No public DevPath profile matches <code>@{handleInput}</code>. Profiles are private by default until enabled in{' '}
              <a href="/progress" className="font-semibold text-[var(--accent)] hover:underline">
                My Progress
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
