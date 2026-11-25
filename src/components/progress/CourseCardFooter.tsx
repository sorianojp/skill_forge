import { useEffect, useState } from 'react';
import { ArrowRight, Award, BookOpen } from 'lucide-react';
import { getCourseCompletion, getExamResult, getProgress, subscribeProgress } from '@/lib/progress';

interface LessonRef {
  key: string;
  href: string;
}

interface Props {
  courseSlug: string;
  lessons: LessonRef[];
  secondaryLabel?: string;
}

export default function CourseCardFooter({
  courseSlug,
  lessons,
  secondaryLabel = 'Syllabus',
}: Props) {
  const totalLessons = lessons.length;
  const [completedMap, setCompletedMap] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ completedCount: 0, percent: 0 });
  const [examPassed, setExamPassed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const state = getProgress();
      setCompletedMap(state.completed);
      setStats(getCourseCompletion(courseSlug, totalLessons));
      setExamPassed(Boolean(getExamResult(courseSlug)?.passed));
    };
    sync();
    return subscribeProgress(sync);
  }, [courseSlug, totalLessons]);

  const nextUnfinished = lessons.find((l) => !completedMap[l.key]);
  const firstHref = lessons[0]?.href ?? `/courses/${courseSlug}`;
  const examHref = `/courses/${courseSlug}/exam`;

  let primaryLabel = 'Start Learning';
  let primaryHref = firstHref;

  if (examPassed) {
    primaryLabel = 'View Certificate';
    primaryHref = examHref;
  } else if (stats.completedCount >= totalLessons && totalLessons > 0) {
    primaryLabel = 'Take Final Exam';
    primaryHref = examHref;
  } else if (stats.completedCount > 0 && nextUnfinished) {
    primaryLabel = 'Continue Learning';
    primaryHref = nextUnfinished.href;
  }

  return (
    <div className="mt-6 flex flex-col gap-4 pt-2">
      {stats.completedCount === 0 ? (
        <div className="flex items-center justify-between text-xs font-medium text-[var(--text-subtle)]">
          <span>
            {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'} · Not started
          </span>
          {examPassed && (
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--success)]">
              <Award className="h-3.5 w-3.5" /> Certified
            </span>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--text-muted)]">
              {stats.completedCount}/{totalLessons} completed
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
              {examPassed && (
                <span className="inline-flex items-center gap-0.5 text-[var(--success)]">
                  <Award className="h-3.5 w-3.5" />
                </span>
              )}
              {stats.percent}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <a
          href={primaryHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] active:scale-[0.98]"
        >
          <span>{primaryLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href={`/courses/${courseSlug}`}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:opacity-85 active:scale-[0.98]"
        >
          <BookOpen className="h-4 w-4 opacity-70" />
          <span>{secondaryLabel}</span>
        </a>
      </div>
    </div>
  );
}
