import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import {
  isLessonCompleted,
  recordLastVisited,
  subscribeProgress,
  toggleLessonCompleted,
} from '@/lib/progress';

interface Props {
  lessonKey: string;
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  href: string;
}

export default function LessonCompleteButton({
  lessonKey,
  courseSlug,
  courseTitle,
  lessonSlug,
  lessonTitle,
  href,
}: Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isLessonCompleted(lessonKey));
    recordLastVisited({ courseSlug, courseTitle, lessonSlug, lessonTitle, href });
    return subscribeProgress((state) => {
      setCompleted(Boolean(state.completed[lessonKey]));
    });
  }, [lessonKey, courseSlug, courseTitle, lessonSlug, lessonTitle, href]);

  const handleToggle = () => {
    const next = toggleLessonCompleted(lessonKey);
    setCompleted(next);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--bg-elevated)] p-6">
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">
          {completed ? 'Lesson completed!' : 'Finished this lesson?'}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Your progress is saved locally in your browser, no account needed.
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition active:scale-[0.98] ${
          completed
            ? 'bg-[var(--success-soft)] text-[var(--success)]'
            : 'bg-[var(--accent)] text-white hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]'
        }`}
      >
        {completed ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed</span>
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" />
            <span>Mark as Complete</span>
          </>
        )}
      </button>
    </div>
  );
}
