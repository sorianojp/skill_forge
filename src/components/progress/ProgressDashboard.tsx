import { useEffect, useState } from 'react';
import { Award, BookOpen, CheckCircle2, Trash2 } from 'lucide-react';
import {
  clearAllProgress,
  getProgress,
  subscribeProgress,
  type ProgressState,
} from '@/lib/progress';

interface CourseSummary {
  slug: string;
  title: string;
  track: string;
  accentColor: string;
  lessons: Array<{ key: string; title: string; href: string }>;
}

interface Props {
  courses: CourseSummary[];
}

export default function ProgressDashboard({ courses }: Props) {
  const [state, setState] = useState<ProgressState>({ completed: {}, exams: {} });

  useEffect(() => {
    setState(getProgress());
    return subscribeProgress(setState);
  }, []);

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessonsCount = courses.reduce(
    (sum, c) => sum + c.lessons.filter((l) => Boolean(state.completed[l.key])).length,
    0
  );
  const overallPercent =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const earnedCertificates = courses
    .map((c) => ({ course: c, exam: state.exams?.[c.slug] }))
    .filter((x) => x.exam?.passed);

  const handleReset = () => {
    if (window.confirm('Reset all local lesson progress and exam records in this browser?')) {
      clearAllProgress();
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <BookOpen className="h-4 w-4 text-[var(--accent)]" />
            Lessons Completed
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">
            {completedLessonsCount}{' '}
            <span className="text-base font-medium text-[var(--text-subtle)]">/ {totalLessons}</span>
          </p>
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
            Overall Mastery
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--accent)]">{overallPercent}%</p>
        </div>

        <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Award className="h-4 w-4 text-[var(--success)]" />
            Certificates Earned
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--success)]">
            {earnedCertificates.length}{' '}
            <span className="text-base font-medium text-[var(--text-subtle)]">/ {courses.length}</span>
          </p>
        </div>
      </div>

      {/* Earned Certificates */}
      <section>
        <h2 className="text-xl font-extrabold text-[var(--text)]">Earned Certificates</h2>
        {earnedCertificates.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-[var(--bg-elevated)] p-6 text-sm text-[var(--text-muted)]">
            No certificates earned yet. Pass any course&apos;s Final Exam with <strong>80% or higher</strong> to unlock your free downloadable PNG/SVG/PDF certificate!
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {earnedCertificates.map(({ course, exam }) => (
              <div
                key={course.slug}
                className="flex items-center justify-between gap-4 rounded-3xl bg-[var(--success-soft)] p-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                    Verified · {exam?.bestScore}%
                  </span>
                  <h3 className="mt-0.5 text-base font-bold text-[var(--text)]">{course.title}</h3>
                  <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                    ID: {exam?.certificateId}
                  </p>
                </div>
                <a
                  href={`/courses/${course.slug}/exam`}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-2xl bg-[var(--success)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Course Breakdown */}
      <section>
        <h2 className="text-xl font-extrabold text-[var(--text)]">Course Progress</h2>
        <div className="mt-4 space-y-4">
          {courses.map((course) => {
            const doneCount = course.lessons.filter((l) => Boolean(state.completed[l.key])).length;
            const pct =
              course.lessons.length > 0 ? Math.round((doneCount / course.lessons.length) * 100) : 0;
            const nextLesson =
              course.lessons.find((l) => !state.completed[l.key]) ?? course.lessons[0];
            const exam = state.exams?.[course.slug];

            return (
              <div
                key={course.slug}
                className="rounded-3xl bg-[var(--bg-elevated)] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span
                      className="inline-block rounded-full px-3 py-0.5 text-[11px] font-bold text-white"
                      style={{ backgroundColor: course.accentColor }}
                    >
                      {course.track}
                    </span>
                    <h3 className="mt-1.5 text-lg font-bold text-[var(--text)]">{course.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {nextLesson && (
                      <a
                        href={nextLesson.href}
                        className="inline-flex min-h-11 items-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                      >
                        {doneCount === 0 ? 'Start Course' : doneCount === course.lessons.length ? 'Review Lessons' : 'Continue Learning'}
                      </a>
                    )}
                    <a
                      href={`/courses/${course.slug}/exam`}
                      className="inline-flex min-h-11 items-center rounded-2xl bg-[var(--bg-muted)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-85"
                    >
                      {exam?.passed ? 'View Certificate' : 'Final Exam'}
                    </a>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--text-muted)]">
                      {doneCount} of {course.lessons.length} lessons completed
                    </span>
                    <span className="text-[var(--accent)]">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Local Data Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-subtle)]">
        <p>All progress and certificates are stored privately in your browser&apos;s localStorage.</p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--danger)]/40 px-3 py-1.5 font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Reset Local Progress
        </button>
      </div>
    </div>
  );
}
