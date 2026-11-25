import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { getCourseCompletion, getProgress, subscribeProgress } from '@/lib/progress';

interface SidebarModule {
  name: string;
  lessons: Array<{
    title: string;
    href: string;
    key: string;
    durationMinutes: number;
  }>;
}

interface Props {
  courseSlug: string;
  courseTitle: string;
  currentKey: string;
  modules: SidebarModule[];
  totalLessons: number;
}

export default function SidebarProgress({
  courseSlug,
  currentKey,
  modules,
  totalLessons,
}: Props) {
  const [completedMap, setCompletedMap] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ completedCount: 0, percent: 0 });

  useEffect(() => {
    const sync = () => {
      setCompletedMap(getProgress().completed);
      setStats(getCourseCompletion(courseSlug, totalLessons));
    };
    sync();
    return subscribeProgress(sync);
  }, [courseSlug, totalLessons]);

  return (
    <div>
      {/* Course Progress Bar */}
      <div className="mb-5 rounded-2xl bg-[var(--bg-elevated)] p-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--text-muted)]">Progress</span>
          <span className="text-[var(--accent)]">{stats.percent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[var(--text-subtle)]">
          {stats.completedCount} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Modules & Lessons */}
      <nav aria-label="Lessons" className="space-y-5">
        {modules.map((mod) => (
          <div key={mod.name}>
            <h3 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              {mod.name}
            </h3>
            <ul className="space-y-1">
              {mod.lessons.map((lesson) => {
                const isActive = lesson.key === currentKey;
                const isDone = Boolean(completedMap[lesson.key]);
                return (
                  <li key={lesson.key}>
                    <a
                      href={lesson.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-start gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                        isActive
                          ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent)]'
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                      ) : (
                        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-40" />
                      )}
                      <span className="leading-snug">{lesson.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
