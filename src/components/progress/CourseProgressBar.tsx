import React, { useEffect, useState } from 'react';
import { getCourseCompletion, subscribeProgress } from '@/lib/progress';

interface Props {
  courseSlug: string;
  totalLessons: number;
}

export default function CourseProgressBar({ courseSlug, totalLessons }: Props) {
  const [stats, setStats] = useState({ completedCount: 0, percent: 0 });

  useEffect(() => {
    const sync = () => setStats(getCourseCompletion(courseSlug, totalLessons));
    sync();
    return subscribeProgress(sync);
  }, [courseSlug, totalLessons]);

  if (stats.completedCount === 0) {
    return (
      <div className="text-xs font-medium text-[var(--text-subtle)]">
        {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'} · Not started
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[var(--text-muted)]">
          {stats.completedCount}/{totalLessons} completed
        </span>
        <span className="text-[var(--accent)]">{stats.percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${stats.percent}%` }}
        />
      </div>
    </div>
  );
}
