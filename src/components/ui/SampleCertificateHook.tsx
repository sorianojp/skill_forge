import { useState } from 'react';
import { ArrowRight, Award, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

const SAMPLE_TRACKS = [
  { title: 'Next.js & Full-Stack Web', accent: '#2563eb', code: 'DP-NEXT-9K4M2P' },
  { title: 'AI Engineering & LLM Apps', accent: '#db2777', code: 'DP-AIEN-7R8T3Q' },
  { title: 'Python 3 Fundamentals', accent: '#059669', code: 'DP-PYTH-4W2X9L' },
  { title: 'Go (Golang) Essentials', accent: '#0891b2', code: 'DP-GOFU-6B5N8V' },
];

export default function SampleCertificateHook() {
  const [previewName, setPreviewName] = useState('');
  const [trackIdx, setTrackIdx] = useState(0);

  const track = SAMPLE_TRACKS[trackIdx];
  const displayName = previewName.trim() || 'Alex Rivera';

  return (
    <section className="mx-auto max-w-[82rem] px-5 py-6 sm:px-6 lg:px-8" aria-labelledby="cert-hook-heading">
      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-[var(--bg-elevated)] p-7 sm:p-10 lg:grid-cols-12">
        {/* Left: Hook Copy & Credibility */}
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-bold text-[var(--success)]">
            <Award className="h-3.5 w-3.5" />
            <span>Earned, Not Bought · 100% Free</span>
          </span>

          <h2
            id="cert-hook-heading"
            className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl"
          >
            Earn a Verifiable Certificate You Can Put on LinkedIn
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Every DevPath certificate is earned by completing 100% of a track&apos;s lessons and passing a timed, randomized 15-question final exam with 80% or higher.
          </p>

          <ul className="mt-5 space-y-2.5 text-sm text-[var(--text)]">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
              <span>Unique public verification ID at <code>/verify</code></span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
              <span>One-click <strong>Add to LinkedIn</strong> &amp; PNG / SVG / PDF export</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
              <span>Printable Official Transcript for OJT &amp; job applications</span>
            </li>
          </ul>

          {/* Interactive Name Preview Input */}
          <div className="mt-6">
            <label htmlFor="cert-preview-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Preview your name on a certificate
            </label>
            <input
              id="cert-preview-name"
              type="text"
              maxLength={36}
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              placeholder="Type your name (e.g. Juan Dela Cruz)"
              className="mt-1.5 min-h-11 w-full rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="/courses"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
            >
              <span>Start Earning Yours</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/verify"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:text-[var(--accent)]"
            >
              <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
              <span>Verify an ID</span>
            </a>
          </div>
        </div>

        {/* Right: Crisp Sample Certificate Visual */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-white shadow-lg">
            {/* Subtle Sample Ribbon */}
            <div className="absolute top-3 right-3 z-10 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-xs">
              Sample Preview
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 800"
              className="block h-auto w-full"
              role="img"
              aria-label={`Sample DevPath Certificate for ${displayName} in ${track.title}`}
            >
              <defs>
                <linearGradient id="sampleCertBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#eff6ff" />
                </linearGradient>
              </defs>
              <rect width="1200" height="800" fill="url(#sampleCertBg)" />
              <rect x="32" y="32" width="1136" height="736" rx="24" fill="#ffffff" stroke={track.accent} strokeWidth="6" />
              <rect x="48" y="48" width="1104" height="704" rx="16" fill="none" stroke="#e2e8f0" strokeWidth="2" />

              <rect x="556" y="88" width="88" height="88" rx="20" fill={track.accent} />
              <text x="600" y="147" textAnchor="middle" fill="#ffffff" fontFamily="Inter, system-ui, sans-serif" fontSize="38" fontWeight="900">
                DP
              </text>

              <text x="600" y="220" textAnchor="middle" fill={track.accent} fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="800" letterSpacing="5">
                DEVPATH · CERTIFICATE OF COMPLETION
              </text>

              <text x="600" y="290" textAnchor="middle" fill="#475569" fontFamily="Inter, system-ui, sans-serif" fontSize="22">
                This certifies that
              </text>

              <text x="600" y="372" textAnchor="middle" fill="#0f172a" fontFamily="Inter, system-ui, sans-serif" fontSize="54" fontWeight="800">
                {displayName}
              </text>
              <line x1="280" y1="398" x2="920" y2="398" stroke="#cbd5e1" strokeWidth="2" />

              <text x="600" y="454" textAnchor="middle" fill="#475569" fontFamily="Inter, system-ui, sans-serif" fontSize="22">
                has successfully passed the final exam with a score of 93% for
              </text>

              <text x="600" y="520" textAnchor="middle" fill={track.accent} fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="800">
                {track.title}
              </text>

              <text x="200" y="660" textAnchor="middle" fill="#0f172a" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="700">
                November 27, 2026
              </text>
              <line x1="110" y1="674" x2="290" y2="674" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="200" y="700" textAnchor="middle" fill="#64748b" fontFamily="Inter, system-ui, sans-serif" fontSize="14">
                Date Issued
              </text>

              <text x="600" y="660" textAnchor="middle" fill="#0f172a" fontFamily="JetBrains Mono, monospace" fontSize="16" fontWeight="700">
                {track.code}
              </text>
              <line x1="480" y1="674" x2="720" y2="674" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="600" y="700" textAnchor="middle" fill="#64748b" fontFamily="Inter, system-ui, sans-serif" fontSize="14">
                Verifiable ID
              </text>

              <text x="1000" y="660" textAnchor="middle" fill="#0f172a" fontFamily="Inter, system-ui, sans-serif" fontSize="18" fontWeight="700">
                DevPath
              </text>
              <line x1="910" y1="674" x2="1090" y2="674" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="1000" y="700" textAnchor="middle" fill="#64748b" fontFamily="Inter, system-ui, sans-serif" fontSize="14">
                Free Open Curriculum
              </text>
            </svg>
          </div>

          {/* Track Switcher Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TRACKS.map((t, idx) => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => setTrackIdx(idx)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    idx === trackIdx
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {t.title.split(' ')[0]}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-subtle)]">
              <ExternalLink className="h-3 w-3" />
              <span>25 tracks with free certificates</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
