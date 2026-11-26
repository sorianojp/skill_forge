import { useEffect, useState } from 'react';
import { Award, BookOpen, Code2, ExternalLink, Flame, Trophy, Users } from 'lucide-react';
import { fetchLeaderboard, type LeaderboardEntry } from '@/lib/cloudSync';

export default function LeaderboardTable() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchLeaderboard().then((rows) => {
      setLeaders(rows);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Scoring Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--bg-elevated)] p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="font-bold uppercase tracking-wider text-[var(--text)]">Points Formula:</span>
          <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-semibold">Certificate = 100 pts</span>
          <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-semibold">Challenge = 25 pts</span>
          <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-semibold">Active Day = 10 pts</span>
          <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-semibold">Lesson = 5 pts</span>
        </div>
        <a
          href="/progress"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          <Users className="h-3.5 w-3.5" />
          <span>Join Leaderboard</span>
        </a>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-10 text-center text-sm text-[var(--text-muted)]">
          Loading community rankings...
        </div>
      ) : leaders.length === 0 ? (
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-[var(--text)]">Be the First on the Leaderboard</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[var(--text-muted)]">
            Enable Cloud Sync and toggle <strong>Make profile public</strong> in My Progress to claim the #1 spot on DevPath.
          </p>
          <a
            href="/progress"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <span>Set Up Public Profile</span>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((entry, idx) => {
            const rank = idx + 1;
            const rankBadge =
              rank === 1
                ? 'bg-amber-400 text-slate-950'
                : rank === 2
                  ? 'bg-slate-300 text-slate-900'
                  : rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)]';

            return (
              <div
                key={entry.handle}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--bg-elevated)] p-5 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${rankBadge}`}>
                    #{rank}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/profile?u=${encodeURIComponent(entry.handle)}`}
                        className="text-base font-extrabold text-[var(--text)] hover:text-[var(--accent)]"
                      >
                        {entry.name}
                      </a>
                      <span className="font-mono text-xs text-[var(--text-subtle)]">@{entry.handle}</span>
                    </div>
                    {entry.bio && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">{entry.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1" title="Verified Certificates">
                    <Award className="h-3.5 w-3.5 text-[var(--success)]" />
                    {entry.totalCertificates}
                  </span>
                  <span className="inline-flex items-center gap-1" title="Challenges Solved">
                    <Code2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {entry.solvedChallenges}
                  </span>
                  <span className="inline-flex items-center gap-1" title="Lessons Completed">
                    <BookOpen className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                    {entry.completedLessons}
                  </span>
                  <span className="inline-flex items-center gap-1" title="Active Days">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    {entry.activeDays}d
                  </span>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-extrabold text-[var(--accent)]">
                    {entry.points} pts
                  </span>
                  <a
                    href={`/profile?u=${encodeURIComponent(entry.handle)}`}
                    className="inline-flex items-center gap-1 text-[var(--text)] hover:text-[var(--accent)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
