import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Lock,
  Printer,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { ExamQuestion } from '@/data/exams';
import { registerPublicCertificate } from '@/lib/cloudSync';
import {
  getExamResult,
  getProgress,
  saveExamResult,
  subscribeProgress,
  type ExamResultRecord,
  type ProgressState,
} from '@/lib/progress';

interface LessonRef {
  key: string;
  title: string;
  href: string;
}

interface Props {
  courseSlug: string;
  courseTitle: string;
  accentColor: string;
  questions: ExamQuestion[];
  lessons?: LessonRef[];
}

const PASSING_PERCENT = 80;
const EXAM_DURATION_SECONDS = 15 * 60;

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildShuffledExam(questions: ExamQuestion[]): ExamQuestion[] {
  return shuffleArray(questions).map((q) => {
    const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === q.answer }));
    const mixed = shuffleArray(indexed);
    return {
      ...q,
      options: mixed.map((m) => m.text),
      answer: mixed.findIndex((m) => m.isCorrect),
    };
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildCertificateSvg({
  learnerName,
  courseTitle,
  scorePercent,
  dateStr,
  certificateId,
  accentColor,
}: {
  learnerName: string;
  courseTitle: string;
  scorePercent: number;
  dateStr: string;
  certificateId: string;
  accentColor: string;
}): string {
  const safeName = escapeXml(learnerName.trim() || 'DevPath Scholar');
  const safeCourse = escapeXml(courseTitle);
  const safeDate = escapeXml(dateStr);
  const safeId = escapeXml(certificateId);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#eff6ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)" />
  <rect x="32" y="32" width="1136" height="736" rx="24" fill="#ffffff" stroke="${accentColor}" stroke-width="6" />
  <rect x="48" y="48" width="1104" height="704" rx="16" fill="none" stroke="#e2e8f0" stroke-width="2" />

  <rect x="556" y="88" width="88" height="88" rx="20" fill="${accentColor}" />
  <text x="600" y="147" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="38" font-weight="900">DP</text>

  <text x="600" y="220" text-anchor="middle" fill="${accentColor}" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="800" letter-spacing="5">DEVPATH · CERTIFICATE OF COMPLETION</text>

  <text x="600" y="290" text-anchor="middle" fill="#475569" font-family="Inter, system-ui, sans-serif" font-size="22">This certifies that</text>

  <text x="600" y="372" text-anchor="middle" fill="#0f172a" font-family="Inter, system-ui, sans-serif" font-size="56" font-weight="800">${safeName}</text>
  <line x1="280" y1="398" x2="920" y2="398" stroke="#cbd5e1" stroke-width="2" />

  <text x="600" y="454" text-anchor="middle" fill="#475569" font-family="Inter, system-ui, sans-serif" font-size="22">has successfully passed the final exam with a score of ${scorePercent}% for</text>

  <text x="600" y="520" text-anchor="middle" fill="${accentColor}" font-family="Inter, system-ui, sans-serif" font-size="36" font-weight="800">${safeCourse}</text>

  <text x="200" y="660" text-anchor="middle" fill="#0f172a" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700">${safeDate}</text>
  <line x1="110" y1="674" x2="290" y2="674" stroke="#94a3b8" stroke-width="1.5" />
  <text x="200" y="700" text-anchor="middle" fill="#64748b" font-family="Inter, system-ui, sans-serif" font-size="14">Date Issued</text>

  <text x="600" y="660" text-anchor="middle" fill="#0f172a" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">${safeId}</text>
  <line x1="480" y1="674" x2="720" y2="674" stroke="#94a3b8" stroke-width="1.5" />
  <text x="600" y="700" text-anchor="middle" fill="#64748b" font-family="Inter, system-ui, sans-serif" font-size="14">Certificate ID</text>

  <text x="1000" y="660" text-anchor="middle" fill="#0f172a" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700">DevPath</text>
  <line x1="910" y1="674" x2="1090" y2="674" stroke="#94a3b8" stroke-width="1.5" />
  <text x="1000" y="700" text-anchor="middle" fill="#64748b" font-family="Inter, system-ui, sans-serif" font-size="14">Free Open Curriculum</text>
</svg>`;
}

export default function CourseExam({
  courseSlug,
  courseTitle,
  accentColor,
  questions: rawQuestions,
  lessons = [],
}: Props) {
  const [attemptSeed, setAttemptSeed] = useState(0);
  const [questions, setQuestions] = useState<ExamQuestion[]>(rawQuestions);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [record, setRecord] = useState<ExamResultRecord | undefined>(undefined);
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, exams: {} });
  const [learnerName, setLearnerName] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const certRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuestions(buildShuffledExam(rawQuestions));
  }, [rawQuestions, attemptSeed]);

  useEffect(() => {
    setProgress(getProgress());
    const saved = getExamResult(courseSlug);
    if (saved) {
      setRecord(saved);
      if (saved.learnerName) setLearnerName(saved.learnerName);
    }
    return subscribeProgress(setProgress);
  }, [courseSlug]);

  const remainingLessons = useMemo(
    () => lessons.filter((l) => !progress.completed[l.key]),
    [lessons, progress]
  );
  const completedLessonsCount = lessons.length - remainingLessons.length;
  const isGateUnlocked = lessons.length === 0 || remainingLessons.length === 0 || Boolean(record?.passed);

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce(
    (acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc),
    0
  );
  const currentPercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passedThisRun = submitted && currentPercent >= PASSING_PERCENT;
  const isUnlocked = Boolean(record?.passed || passedThisRun);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const passed = currentPercent >= PASSING_PERCENT;
    const saved = saveExamResult(courseSlug, currentPercent, passed, learnerName || undefined);
    setRecord(saved);
    if (saved.passed && saved.certificateId) {
      void registerPublicCertificate({
        certId: saved.certificateId,
        learnerName: (learnerName || saved.learnerName || 'DevPath Scholar').trim(),
        courseSlug,
        courseTitle,
        score: saved.bestScore,
        total: questions.length,
        issuedAt: (saved.passedAt ?? new Date().toISOString()).slice(0, 10),
      });
    }
  };

  useEffect(() => {
    if (!isGateUnlocked || submitted) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isGateUnlocked, submitted, attemptSeed]);

  useEffect(() => {
    if (secondsLeft === 0 && isGateUnlocked && !submitted) {
      handleSubmit();
    }
  }, [secondsLeft, isGateUnlocked, submitted]);

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setAttemptSeed((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameChange = (val: string) => {
    setLearnerName(val);
    if (record?.passed) {
      const updated = saveExamResult(courseSlug, record.bestScore, true, val);
      setRecord(updated);
      if (updated.certificateId && val.trim().length >= 2) {
        void registerPublicCertificate({
          certId: updated.certificateId,
          learnerName: val.trim(),
          courseSlug,
          courseTitle,
          score: updated.bestScore,
          total: questions.length,
          issuedAt: (updated.passedAt ?? new Date().toISOString()).slice(0, 10),
        });
      }
    }
  };

  const dateStr = record?.passedAt
    ? new Date(record.passedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const certId = record?.certificateId ?? `DP-${courseSlug.slice(0, 4).toUpperCase()}-VERIFIED`;
  const certScore = Math.max(record?.bestScore ?? 0, submitted ? currentPercent : 0);
  const issuedDateObj = record?.passedAt ? new Date(record.passedAt) : new Date();
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    `${courseTitle} Certificate`
  )}&organizationName=${encodeURIComponent('DevPath')}&issueYear=${issuedDateObj.getFullYear()}&issueMonth=${
    issuedDateObj.getMonth() + 1
  }&certUrl=${encodeURIComponent(
    `https://devpath.mycampus.ph/verify?id=${certId}`
  )}&certId=${encodeURIComponent(certId)}`;

  const svgMarkup = buildCertificateSvg({
    learnerName,
    courseTitle,
    scorePercent: certScore || 100,
    dateStr,
    certificateId: certId,
    accentColor,
  });

  const handleDownloadSvg = () => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devpath-${courseSlug}-certificate.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1067;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `devpath-${courseSlug}-certificate.png`;
          a.click();
        }
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.src = url;
    } catch {
      setDownloading(false);
    }
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  if (!isGateUnlocked) {
    const pct = lessons.length > 0 ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;
    const nextLesson = remainingLessons[0];
    return (
      <div className="rounded-3xl bg-[var(--bg-elevated)] p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--warning-soft)] text-[var(--warning)]">
            <Lock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-[var(--text)]">
              Complete All Lessons to Unlock This Certification Exam
            </h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              To keep DevPath certificates credible and earned, finish all {lessons.length} lessons in{' '}
              <strong>{courseTitle}</strong> before taking the timed final exam.
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text)]">
                <span>
                  Course Progress: {completedLessonsCount} / {lessons.length} lessons
                </span>
                <span className="text-[var(--accent)]">{pct}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {nextLesson && (
              <div className="mt-6">
                <a
                  href={nextLesson.href}
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                >
                  <span>Continue: {nextLesson.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                Remaining Lessons ({remainingLessons.length})
              </p>
              <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {remainingLessons.map((l) => (
                  <li key={l.key}>
                    <a
                      href={l.href}
                      className="flex items-center justify-between rounded-2xl bg-[var(--bg-muted)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                    >
                      <span className="truncate">{l.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Certificate Unlocked Panel */}
      {isUnlocked && (
        <section className="rounded-3xl bg-[var(--success-soft)] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--success)] text-white">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  Certificate Unlocked!
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Best Exam Score: <strong>{certScore}%</strong> · ID: <code>{certId}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <label htmlFor="learner-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Your Full Name on Certificate
              </label>
              <input
                id="learner-name"
                type="text"
                value={learnerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your full name..."
                className="mt-1.5 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={downloading}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Rendering...' : 'Download PNG'}
            </button>

            <button
              type="button"
              onClick={handleDownloadSvg}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-85"
            >
              <Download className="h-4 w-4" />
              Download SVG
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:opacity-85"
            >
              <Printer className="h-4 w-4" />
              Print / PDF
            </button>

            <a
              href={`/verify?id=${encodeURIComponent(certId)}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-5 py-3 text-sm font-semibold text-[var(--success)] transition hover:opacity-85"
            >
              <ShieldCheck className="h-4 w-4" />
              Public Verify Link
            </a>

            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182]"
            >
              <ExternalLink className="h-4 w-4" />
              Add to LinkedIn
            </a>
          </div>

          <div
            ref={certRef}
            className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-white shadow-md [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </section>
      )}

      {/* Exam Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--bg-elevated)] p-6">
        <div>
          <p className="text-sm font-bold text-[var(--text)]">
            {submitted
              ? `Final Score: ${correctCount} / ${questions.length} (${currentPercent}%)`
              : `Answered: ${answeredCount} / ${questions.length} questions`}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Score {PASSING_PERCENT}% or higher ({Math.ceil((PASSING_PERCENT / 100) * questions.length)}/{questions.length}) to unlock your free certificate.
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
            onClick={handleRetake}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:opacity-85"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retake (New Order)
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const picked = answers[qIdx];
          const isRight = picked === q.answer;

          return (
            <div key={qIdx} className="rounded-3xl bg-[var(--bg-elevated)] p-6">
              <p className="text-sm font-bold text-[var(--text)]">
                {qIdx + 1}. {q.question}
              </p>

              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = picked === optIdx;
                  const isCorrectOpt = optIdx === q.answer;

                  let cls =
                    'bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--accent-soft)]';
                  if (submitted) {
                    if (isCorrectOpt) {
                      cls = 'bg-[var(--success-soft)] text-[var(--text)] font-semibold';
                    } else if (selected && !isCorrectOpt) {
                      cls = 'bg-[var(--danger-soft)] text-[var(--text)]';
                    } else {
                      cls = 'bg-[var(--bg)] text-[var(--text-subtle)] opacity-70';
                    }
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

      {/* Submit Bar */}
      {!submitted && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5">
          <p className="text-xs text-[var(--text-muted)]">
            {answeredCount < questions.length
              ? `Answer all ${questions.length} questions to submit (${questions.length - answeredCount} left).`
              : 'All questions answered: ready to grade!'}
          </p>
          <button
            type="button"
            disabled={answeredCount < questions.length}
            onClick={handleSubmit}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Submit Exam</span>
          </button>
        </div>
      )}
    </div>
  );
}
