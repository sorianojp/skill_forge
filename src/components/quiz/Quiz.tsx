import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
}

export default function Quiz({ title = 'Check Your Understanding', questions }: QuizProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const answeredCount = Object.keys(submitted).length;
  const correctCount = questions.reduce(
    (acc, q, idx) => (submitted[idx] && selected[idx] === q.answer ? acc + 1 : acc),
    0
  );

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted({});
  };

  return (
    <section className="not-prose my-10 rounded-3xl bg-[var(--bg-elevated)] p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[var(--accent)]" />
          <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)]">
          <span>
            Score: {correctCount} / {questions.length}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isSubmitted = Boolean(submitted[qIdx]);
          const chosen = selected[qIdx];
          const isCorrect = chosen === q.answer;

          return (
            <div key={qIdx} className="rounded-2xl bg-[var(--bg)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                {qIdx + 1}. {q.question}
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isPicked = chosen === optIdx;
                  const isRightOption = optIdx === q.answer;

                  let style =
                    'bg-[var(--bg-elevated)] text-[var(--text)] hover:bg-[var(--accent-soft)]';
                  if (isSubmitted) {
                    if (isRightOption) {
                      style =
                        'bg-[var(--success-soft)] text-[var(--text)] font-semibold';
                    } else if (isPicked && !isRightOption) {
                      style =
                        'bg-[var(--danger-soft)] text-[var(--text)]';
                    } else {
                      style = 'bg-[var(--bg-elevated)] text-[var(--text-subtle)] opacity-70';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition ${style}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isRightOption && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" />
                      )}
                      {isSubmitted && isPicked && !isRightOption && (
                        <XCircle className="h-4 w-4 shrink-0 text-[var(--danger)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div
                  className={`mt-3 rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-[var(--success-soft)] text-[var(--text)]'
                      : 'bg-[var(--warning-soft)] text-[var(--text)]'
                  }`}
                >
                  <strong className={isCorrect ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>
                    {isCorrect ? 'Correct! ' : 'Not quite. '}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
