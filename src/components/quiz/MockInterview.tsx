import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import type { ExamQuestion } from '@/data/exams';

export interface TaggedQuestion extends ExamQuestion {
  topicSlug: string;
  topicLabel: string;
}

export interface InterviewRole {
  id: string;
  title: string;
  description: string;
  topics: string[];
  pool: TaggedQuestion[];
}

interface Props {
  roles: InterviewRole[];
}

const QUESTION_COUNT = 20;
const DURATION_SECONDS = 20 * 60;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sampleQuestions(pool: TaggedQuestion[]): TaggedQuestion[] {
  return shuffle(pool)
    .slice(0, Math.min(QUESTION_COUNT, pool.length))
    .map((q) => {
      const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === q.answer }));
      const mixed = shuffle(indexed);
      return {
        ...q,
        options: mixed.map((m) => m.text),
        answer: mixed.findIndex((m) => m.isCorrect),
      };
    });
}

export default function MockInterview({ roles }: Props) {
  const [activeRole, setActiveRole] = useState<InterviewRole | null>(null);
  const [questions, setQuestions] = useState<TaggedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);

  const startRole = (role: InterviewRole) => {
    setActiveRole(role);
    setQuestions(sampleQuestions(role.pool));
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(DURATION_SECONDS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!activeRole || submitted) return;
    const t = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [activeRole, submitted]);

  useEffect(() => {
    if (secondsLeft === 0 && activeRole && !submitted) {
      setSubmitted(true);
    }
  }, [secondsLeft, activeRole, submitted]);

  if (!activeRole) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex flex-col justify-between rounded-3xl bg-[var(--bg-elevated)] p-7 transition hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Briefcase className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {Math.min(QUESTION_COUNT, role.pool.length)} questions · 20 min
                </span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-[var(--text)]">{role.title}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{role.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => startRole(role)}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              <Play className="h-4 w-4" />
              <span>Start Timed Mock Interview</span>
            </button>
          </div>
        ))}
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce(
    (sum, q, idx) => (answers[idx] === q.answer ? sum + 1 : sum),
    0
  );
  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const topicBreakdown = Object.values(
    questions.reduce<
      Record<string, { slug: string; label: string; correct: number; total: number }>
    >((acc, q, idx) => {
      if (!acc[q.topicSlug]) {
        acc[q.topicSlug] = { slug: q.topicSlug, label: q.topicLabel, correct: 0, total: 0 };
      }
      acc[q.topicSlug].total += 1;
      if (answers[idx] === q.answer) acc[q.topicSlug].correct += 1;
      return acc;
    }, {})
  );

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const readinessLabel =
    scorePct >= 85
      ? { text: 'Interview Ready', color: 'text-[var(--success)]', bg: 'bg-[var(--success-soft)]' }
      : scorePct >= 70
        ? { text: 'Strong Progress', color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-soft)]' }
        : { text: 'Needs Targeted Review', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/15' };

  return (
    <div className="space-y-8">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--bg-elevated)] p-6">
        <div>
          <button
            type="button"
            onClick={() => setActiveRole(null)}
            className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
          >
            ← Choose Another Role
          </button>
          <h2 className="mt-1 text-xl font-extrabold text-[var(--text)]">{activeRole.title}</h2>
          <p className="text-xs text-[var(--text-muted)]">
            {submitted
              ? `Final Readiness Score: ${correctCount} / ${questions.length} (${scorePct}%)`
              : `Answered: ${answeredCount} / ${questions.length}`}
          </p>
        </div>

        {!submitted ? (
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-sm font-bold ${
              secondsLeft <= 120
                ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
                : 'bg-[var(--bg-muted)] text-[var(--text)]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>
              {mins}:{secs}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => startRole(activeRole)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:text-[var(--accent)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Randomized Mock</span>
          </button>
        )}
      </div>

      {/* Topic Readiness Breakdown (after submit) */}
      {submitted && (
        <section className="rounded-3xl bg-[var(--bg-elevated)] p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${readinessLabel.bg} ${readinessLabel.color}`}>
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${readinessLabel.color}`}>
                  {readinessLabel.text}
                </p>
                <p className="text-2xl font-extrabold text-[var(--text)]">
                  {scorePct}% Overall ({correctCount}/{questions.length})
                </p>
              </div>
            </div>
            <a
              href="/practice"
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-strong)]"
            >
              <span>Practice Live Coding</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Score Breakdown by Track
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topicBreakdown.map((t) => {
              const tPct = Math.round((t.correct / t.total) * 100);
              return (
                <a
                  key={t.slug}
                  href={`/courses/${t.slug}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--bg-muted)] p-4 transition hover:bg-[var(--accent-soft)]"
                >
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">{t.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t.correct} / {t.total} correct
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      tPct >= 80
                        ? 'bg-[var(--success-soft)] text-[var(--success)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text)]'
                    }`}
                  >
                    {tPct}%
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const picked = answers[qIdx];
          const isRight = picked === q.answer;
          return (
            <div key={qIdx} className="rounded-3xl bg-[var(--bg-elevated)] p-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text-muted)]">
                  {q.topicLabel}
                </span>
                <span className="text-xs font-semibold text-[var(--text-subtle)]">
                  Q{qIdx + 1} / {questions.length}
                </span>
              </div>
              <p className="text-sm font-bold text-[var(--text)]">{q.question}</p>

              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = picked === optIdx;
                  const isCorrectOpt = optIdx === q.answer;
                  let cls = 'bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--accent-soft)]';
                  if (submitted) {
                    if (isCorrectOpt) cls = 'bg-[var(--success-soft)] text-[var(--text)] font-semibold';
                    else if (selected) cls = 'bg-[var(--danger-soft)] text-[var(--text)]';
                    else cls = 'bg-[var(--bg)] text-[var(--text-subtle)] opacity-70';
                  } else if (selected) {
                    cls = 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold';
                  }
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition ${cls}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrectOpt && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
                      )}
                      {submitted && selected && !isCorrectOpt && (
                        <XCircle className="h-4 w-4 shrink-0 text-[var(--danger)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p
                  className={`mt-3 rounded-lg px-3.5 py-2 text-xs ${
                    isRight
                      ? 'bg-[var(--success-soft)] text-[var(--text)]'
                      : 'bg-[var(--warning-soft)] text-[var(--text)]'
                  }`}
                >
                  <strong>{isRight ? 'Correct: ' : 'Explanation: '}</strong>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--bg-elevated)] p-6">
          <p className="text-xs text-[var(--text-muted)]">
            {answeredCount < questions.length
              ? `Answered ${answeredCount} of ${questions.length} questions. You can submit anytime or complete all questions.`
              : 'All questions answered! Ready to grade your mock interview.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finish &amp; Grade Interview</span>
          </button>
        </div>
      )}
    </div>
  );
}
