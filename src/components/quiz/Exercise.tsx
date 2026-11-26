import { useState } from 'react';
import { Check, CheckCircle2, Code2, Eye, Lightbulb, RotateCcw, XCircle } from 'lucide-react';

export interface ExerciseBlank {
  answer: string;
  accepted?: string[];
  placeholder?: string;
  widthCh?: number;
}

interface ExerciseProps {
  title?: string;
  prompt: string;
  /**
   * Code template using {{0}}, {{1}}, etc. for fill-in-the-blank slots.
   */
  template: string;
  blanks: ExerciseBlank[];
  hint?: string;
}

export default function Exercise({
  title = 'Fill-in-the-Blank Exercise',
  prompt,
  template,
  blanks,
  hint,
}: ExerciseProps) {
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ''));
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isBlankCorrect = (idx: number) => {
    const raw = (values[idx] ?? '').trim().toLowerCase();
    const blank = blanks[idx];
    if (!blank) return false;
    const valid = [blank.answer, ...(blank.accepted ?? [])].map((s) => s.trim().toLowerCase());
    return valid.includes(raw);
  };

  const allCorrect = checked && blanks.every((_, idx) => isBlankCorrect(idx));

  const handleChange = (idx: number, val: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (checked) setChecked(false);
  };

  const handleCheck = () => setChecked(true);

  const handleReveal = () => {
    setValues(blanks.map((b) => b.answer));
    setChecked(true);
  };

  const handleReset = () => {
    setValues(blanks.map(() => ''));
    setChecked(false);
    setShowHint(false);
  };

  // Split template on {{0}}, {{1}}, ...
  const parts = template.split(/(\{\{\d+\}\})/g);

  return (
    <section className="not-prose my-8 rounded-3xl bg-[var(--bg-elevated)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
        </div>
        {checked && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              allCorrect
                ? 'bg-[var(--success-soft)] text-[var(--success)]'
                : 'bg-[var(--danger-soft)] text-[var(--danger)]'
            }`}
          >
            {allCorrect ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Correct!
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Try again
              </>
            )}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-[var(--text-muted)]">{prompt}</p>

      <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[#0f172a] p-4 font-mono text-xs leading-loose text-slate-100">
        <code>
          {parts.map((part, i) => {
            const match = part.match(/^\{\{(\d+)\}\}$/);
            if (!match) return <span key={i}>{part}</span>;
            const idx = Number(match[1]);
            const blank = blanks[idx];
            if (!blank) return null;
            const ok = checked && isBlankCorrect(idx);
            const bad = checked && !isBlankCorrect(idx);
            const width = Math.max(blank.widthCh ?? blank.answer.length + 2, 6);

            return (
              <input
                key={i}
                type="text"
                aria-label={`Blank ${idx + 1}`}
                value={values[idx] ?? ''}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheck();
                }}
                placeholder={blank.placeholder ?? '...'}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                style={{ width: `${width}ch` }}
                className={`mx-0.5 inline-block rounded border px-1.5 py-0.5 font-mono text-xs focus:outline-none ${
                  ok
                    ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                    : bad
                      ? 'border-rose-400 bg-rose-950/70 text-rose-200'
                      : 'border-slate-500 bg-slate-800 text-white focus:border-blue-400'
                }`}
              />
            );
          })}
        </code>
      </pre>

      {showHint && hint && (
        <p className="mt-3 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--text)]">
          <strong className="text-[var(--accent)]">Hint: </strong>
          {hint}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          <Check className="h-4 w-4" />
          <span>Check Answer</span>
        </button>

        {hint && (
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:opacity-85"
          >
            <Lightbulb className="h-4 w-4" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleReveal}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:opacity-85"
        >
          <Eye className="h-4 w-4" />
          Show Answer
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--bg-muted)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:opacity-85"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}
