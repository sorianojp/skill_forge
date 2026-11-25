import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getProgress, subscribeProgress, type ProgressState } from '@/lib/progress';

export default function ContinueBanner() {
  const [lastVisited, setLastVisited] = useState<ProgressState['lastVisited']>(undefined);

  useEffect(() => {
    const sync = () => setLastVisited(getProgress().lastVisited);
    sync();
    return subscribeProgress(sync);
  }, []);

  if (!lastVisited) return null;

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--accent-soft)] px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Continue where you left off
          </p>
          <p className="text-sm font-semibold text-[var(--text)]">
            {lastVisited.courseTitle}: {lastVisited.lessonTitle}
          </p>
        </div>
      </div>

      <a
        href={lastVisited.href}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] active:scale-[0.98]"
      >
        <span>Resume lesson</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
