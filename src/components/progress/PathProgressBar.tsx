import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getProgress, subscribeProgress, type ProgressState } from '@/lib/progress';

interface LessonRef {
  key: string;
  href: string;
}

interface Props {
  lessons: LessonRef[];
  accentColor: string;
}

export default function PathProgressBar({ lessons, accentColor }: Props) {
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, exams: {} });

  useEffect(() => {
    setProgress(getProgress());
    return subscribeProgress(setProgress);
  }, []);

  const total = lessons.length;
  const completedCount = lessons.filter((l) => Boolean(progress.completed[l.key])).length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const nextLesson = lessons.find((l) => !progress.completed[l.key]) ?? lessons[0];
  const isDone = total > 0 && completedCount === total;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--bg)] p-4">
      <div className="min-w-[200px] flex-1">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--text)]">
          <span>
            Path Progress: {completedCount} / {total} lessons
          </span>
          <span style={{ color: accentColor }}>{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {nextLesson && (
        <a
          href={nextLesson.href}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
        >
          {isDone ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Review Path</span>
            </>
          ) : (
            <>
              <span>{completedCount > 0 ? 'Continue Path' : 'Start Path'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </a>
      )}
    </div>
  );
}
