import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Flame, Terminal, Zap } from 'lucide-react';
import { PRACTICE_CHALLENGES } from '@/data/challenges';
import { getDailyStreak, getProgress, subscribeProgress, type ProgressState } from '@/lib/progress';

function getTodayChallenge() {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return PRACTICE_CHALLENGES[dayIndex % PRACTICE_CHALLENGES.length];
}

export default function DailyChallengeCard() {
  const [challenge] = useState(getTodayChallenge);
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, exams: {} });

  useEffect(() => {
    setProgress(getProgress());
    return subscribeProgress(setProgress);
  }, []);

  const isSolved = Boolean(progress.solvedChallenges?.[challenge.id]);
  const streak = getDailyStreak();

  return (
    <section className="mx-auto max-w-[82rem] px-5 pt-2 pb-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[var(--bg-elevated)] p-6 sm:p-7">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
              <Zap className="h-3.5 w-3.5" />
              <span>Challenge of the Day</span>
            </span>
            <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold uppercase text-[var(--text-muted)]">
              {challenge.language} · {challenge.difficulty}
            </span>
            {streak.current > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Flame className="h-3.5 w-3.5" />
                {streak.current}-day streak
              </span>
            )}
            {isSolved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-bold text-[var(--success)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Solved
              </span>
            )}
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-[var(--text)]">{challenge.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">{challenge.prompt}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={`/practice?challenge=${encodeURIComponent(challenge.id)}`}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
          >
            <Terminal className="h-4 w-4" />
            <span>{isSolved ? 'Review Solution' : 'Solve Challenge'}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/flashcards"
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--bg-muted)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:text-[var(--accent)]"
          >
            <span>Exam Flashcards</span>
          </a>
        </div>
      </div>
    </section>
  );
}
