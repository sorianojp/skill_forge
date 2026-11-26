import { useEffect, useState } from 'react';
import { ArrowRight, Award, Bookmark, BookOpen, CheckCircle2, Download, Flame, ShieldCheck, StickyNote, Trash2 } from 'lucide-react';
import CloudSyncPanel from '@/components/progress/CloudSyncPanel';
import {
  clearAllProgress,
  getDailyStreak,
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
  const solvedCount = Object.keys(state.solvedChallenges ?? {}).length;
  const streak = getDailyStreak();

  const handleReset = () => {
    if (window.confirm('Reset all local lesson progress and exam records in this browser?')) {
      clearAllProgress();
    }
  };

  return (
    <div className="space-y-10">
      {/* Cloud Sync Account Panel */}
      <CloudSyncPanel />

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <a
          href="/practice"
          className="rounded-3xl bg-[var(--bg-elevated)] p-6 transition hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            <Flame className="h-4 w-4 text-amber-500" />
            Daily Streak
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text)]">
            {streak.current}{' '}
            <span className="text-base font-medium text-[var(--text-subtle)]">
              day{streak.current === 1 ? '' : 's'} · {solvedCount} solved
            </span>
          </p>
        </a>
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
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {exam?.certificateId && (
                    <a
                      href={`/verify?id=${encodeURIComponent(exam.certificateId)}`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text)] hover:opacity-90"
                    >
                      <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
                      <span>Verify</span>
                    </a>
                  )}
                  <a
                    href={`/courses/${course.slug}/exam`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--success)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved Bookmarks & Study Notes */}
      {(Object.keys(state.bookmarks ?? {}).length > 0 || Object.keys(state.notes ?? {}).length > 0) && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-extrabold text-[var(--text)]">
                Bookmarked Lessons ({Object.keys(state.bookmarks ?? {}).length})
              </h2>
            </div>
            {Object.keys(state.bookmarks ?? {}).length === 0 ? (
              <p className="mt-3 text-xs text-[var(--text-muted)]">No bookmarked lessons yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {Object.entries(state.bookmarks ?? {}).map(([key, bm]) => (
                  <li key={key}>
                    <a
                      href={bm.href}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--bg-muted)] px-4 py-3 text-sm transition hover:bg-[var(--accent-soft)]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[var(--text)]">{bm.title}</p>
                        <p className="truncate text-xs text-[var(--text-subtle)]">{bm.courseTitle}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  Personal Study Notes ({Object.keys(state.notes ?? {}).length})
                </h2>
              </div>
              {Object.keys(state.notes ?? {}).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const md = Object.values(state.notes ?? {})
                      .map(
                        (n) =>
                          `## ${n.title} (${n.courseTitle})\nLink: https://devpath.mycampus.ph${n.href}\n\n${n.text}\n`
                      )
                      .join('\n---\n\n');
                    const blob = new Blob([`# DevPath Personal Study Notes\n\n${md}`], {
                      type: 'text/markdown;charset=utf-8',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'devpath-study-notes.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export .md</span>
                </button>
              )}
            </div>
            {Object.keys(state.notes ?? {}).length === 0 ? (
              <p className="mt-3 text-xs text-[var(--text-muted)]">No personal study notes saved yet.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {Object.entries(state.notes ?? {}).map(([key, note]) => (
                  <li key={key} className="rounded-2xl bg-[var(--bg-muted)] p-4">
                    <a
                      href={note.href}
                      className="text-sm font-bold text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      {note.title}{' '}
                      <span className="font-normal text-xs text-[var(--text-subtle)]">({note.courseTitle})</span>
                    </a>
                    <p className="mt-1.5 whitespace-pre-wrap text-xs text-[var(--text-muted)]">
                      {note.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

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
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                      >
                        <span>
                          {doneCount === 0 ? 'Start Course' : doneCount === course.lessons.length ? 'Review Lessons' : 'Continue Learning'}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                    <a
                      href={`/courses/${course.slug}/exam`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-85"
                    >
                      <Award className="h-4 w-4 text-[var(--accent)]" />
                      <span>{exam?.passed ? 'View Certificate' : 'Final Exam'}</span>
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
