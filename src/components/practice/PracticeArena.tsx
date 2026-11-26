import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { cpp as cppLang } from '@codemirror/lang-cpp';
import { java as javaLang } from '@codemirror/lang-java';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { python as pyLang } from '@codemirror/lang-python';
import { sql as sqlLang } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  CheckCircle2,
  Flame,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  Trophy,
  XCircle,
} from 'lucide-react';
import { PRACTICE_CHALLENGES, type ChallengeLang, type PracticeChallenge } from '@/data/challenges';
import { getApiBase } from '@/lib/cloudSync';
import {
  getDailyStreak,
  getProgress,
  markChallengeSolved,
  subscribeProgress,
  type ProgressState,
} from '@/lib/progress';

const LANG_META: Record<ChallengeLang, { label: string; badge: string }> = {
  js: { label: 'JavaScript', badge: 'bg-amber-500' },
  python: { label: 'Python 3', badge: 'bg-emerald-600' },
  sql: { label: 'SQL', badge: 'bg-violet-600' },
  ts: { label: 'TypeScript', badge: 'bg-sky-600' },
  node: { label: 'Node.js', badge: 'bg-green-600' },
  c: { label: 'C11', badge: 'bg-slate-700' },
  cpp: { label: 'C++20', badge: 'bg-blue-600' },
  java: { label: 'Java 21', badge: 'bg-amber-600' },
  csharp: { label: 'C#', badge: 'bg-purple-600' },
  bash: { label: 'Bash', badge: 'bg-zinc-700' },
};

const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/';
const SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/';

async function runPythonInBrowser(code: string): Promise<{ stdout: string; stderr: string }> {
  try {
    const win = window as any;
    if (!win.__skillforgePyodide) {
      win.__skillforgePyodide = new Promise((resolve, reject) => {
        const boot = async () => {
          try {
            resolve(await win.loadPyodide({ indexURL: PYODIDE_BASE }));
          } catch (e) {
            win.__skillforgePyodide = undefined;
            reject(e);
          }
        };
        if (win.loadPyodide) {
          void boot();
          return;
        }
        const s = document.createElement('script');
        s.src = `${PYODIDE_BASE}pyodide.js`;
        s.async = true;
        s.onload = () => void boot();
        s.onerror = () => {
          win.__skillforgePyodide = undefined;
          reject(new Error('Could not load Python WebAssembly runtime.'));
        };
        document.head.appendChild(s);
      });
    }
    const py = await win.__skillforgePyodide;
    const out: string[] = [];
    const err: string[] = [];
    py.setStdout({ batched: (msg: string) => out.push(msg) });
    py.setStderr({ batched: (msg: string) => err.push(msg) });
    await py.runPythonAsync(code);
    return { stdout: out.join('\n'), stderr: err.join('\n') };
  } catch (e: any) {
    return { stdout: '', stderr: String(e?.message ?? e) };
  }
}

async function runSqlInBrowser(
  schemaSql: string,
  query: string
): Promise<{ stdout: string; stderr: string }> {
  try {
    const win = window as any;
    if (!win.__skillforgeSqlJs) {
      win.__skillforgeSqlJs = new Promise((resolve, reject) => {
        const boot = async () => {
          try {
            resolve(await win.initSqlJs({ locateFile: (f: string) => `${SQLJS_CDN}${f}` }));
          } catch (e) {
            win.__skillforgeSqlJs = undefined;
            reject(e);
          }
        };
        if (win.initSqlJs) {
          void boot();
          return;
        }
        const s = document.createElement('script');
        s.src = `${SQLJS_CDN}sql-wasm.js`;
        s.async = true;
        s.onload = () => void boot();
        s.onerror = () => {
          win.__skillforgeSqlJs = undefined;
          reject(new Error('Could not load SQLite WebAssembly runtime.'));
        };
        document.head.appendChild(s);
      });
    }
    const SQL = await win.__skillforgeSqlJs;
    const db = new SQL.Database();
    try {
      if (schemaSql) db.run(schemaSql);
      const res = db.exec(query);
      if (!res || res.length === 0) return { stdout: '', stderr: '' };
      const last = res[res.length - 1];
      const rows = (last.values as unknown[][]).map((row) => row.map((v) => String(v ?? 'NULL')).join(' | '));
      return { stdout: rows.join('\n'), stderr: '' };
    } finally {
      db.close();
    }
  } catch (e: any) {
    return { stdout: '', stderr: String(e?.message ?? e) };
  }
}

function runJsInBrowser(code: string): { stdout: string; stderr: string } {
  const logs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
  };
  try {
    new Function('console', code)(fakeConsole);
    return { stdout: logs.join('\n'), stderr: '' };
  } catch (err) {
    return { stdout: logs.join('\n'), stderr: String(err instanceof Error ? err.message : err) };
  }
}

export default function PracticeArena() {
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [langFilter, setLangFilter] = useState<'all' | ChallengeLang>('all');
  const [selectedId, setSelectedId] = useState(PRACTICE_CHALLENGES[0].id);
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, exams: {}, solvedChallenges: {}, activityDays: [] });
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    stdout: string;
    stderr: string;
  } | null>(null);

  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    return subscribeProgress(setProgress);
  }, []);

  const filtered = PRACTICE_CHALLENGES.filter(
    (c) =>
      (difficultyFilter === 'All' || c.difficulty === difficultyFilter) &&
      (langFilter === 'all' || c.language === langFilter)
  );
  const active: PracticeChallenge =
    PRACTICE_CHALLENGES.find((c) => c.id === selectedId) ?? PRACTICE_CHALLENGES[0];

  const activeCode = codeById[active.id] ?? active.starterCode;

  useEffect(() => {
    if (!editorHostRef.current) return;
    const langExt =
      active.language === 'c' || active.language === 'cpp'
        ? cppLang()
        : active.language === 'python'
          ? pyLang()
          : active.language === 'sql'
            ? sqlLang()
            : active.language === 'java' || active.language === 'csharp'
              ? javaLang()
              : jsLang({ typescript: active.language === 'ts' });

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const nextVal = update.state.doc.toString();
        setCodeById((prev) => ({ ...prev, [active.id]: nextVal }));
      }
    });

    const state = EditorState.create({
      doc: activeCode,
      extensions: [
        basicSetup,
        langExt,
        oneDark,
        EditorView.lineWrapping,
        updateListener,
        EditorView.theme({
          '&': { height: '300px', fontSize: '13.5px' },
          '.cm-scroller': { overflow: 'auto', fontFamily: 'var(--font-mono)' },
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorHostRef.current });
    editorViewRef.current = view;
    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [active.id]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowHint(false);
    setResult(null);
  };

  const handleReset = () => {
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: active.starterCode },
      });
    }
    setCodeById((prev) => ({ ...prev, [active.id]: active.starterCode }));
    setResult(null);
  };

  const handleGrade = async () => {
    setRunning(true);
    setResult(null);
    let stdout = '';
    let stderr = '';

    if (active.language === 'js') {
      const out = runJsInBrowser(activeCode);
      stdout = out.stdout;
      stderr = out.stderr;
    } else if (active.language === 'python') {
      const out = await runPythonInBrowser(activeCode);
      stdout = out.stdout;
      stderr = out.stderr;
    } else if (active.language === 'sql') {
      const out = await runSqlInBrowser(active.schemaSql ?? '', activeCode);
      stdout = out.stdout;
      stderr = out.stderr;
    } else {
      try {
        const res = await fetch(`${getApiBase()}/api/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: active.language, code: activeCode }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          stderr = data.error || 'Compiler service error.';
        } else {
          stdout = data.stdout ?? '';
          stderr = data.stderr ?? '';
        }
      } catch {
        stderr = 'Could not reach DevPath live compiler API.';
      }
    }

    const norm = (s: string) => s.replace(/\r\n/g, '\n').trim();
    const passed = !stderr && norm(stdout) === norm(active.expectedStdout);
    if (passed) {
      markChallengeSolved(active.id);
    }
    setResult({ passed, stdout, stderr });
    setRunning(false);
  };

  const solvedMap = progress.solvedChallenges ?? {};
  const solvedCount = PRACTICE_CHALLENGES.filter((c) => Boolean(solvedMap[c.id])).length;
  const streak = getDailyStreak();
  const langInfo = LANG_META[active.language];

  return (
    <div className="space-y-8">
      {/* Top Streak & Score Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl bg-[var(--bg-elevated)] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Daily Streak
            </p>
            <p className="text-2xl font-extrabold text-[var(--text)]">
              {streak.current} day{streak.current === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-[var(--bg-elevated)] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Challenges Solved
            </p>
            <p className="text-2xl font-extrabold text-[var(--text)]">
              {solvedCount}{' '}
              <span className="text-sm font-medium text-[var(--text-subtle)]">
                / {PRACTICE_CHALLENGES.length}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-3xl bg-[var(--bg-elevated)] p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Difficulty Filter
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    difficultyFilter === lvl
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-[var(--bg-elevated)] p-3">
        <button
          type="button"
          onClick={() => setLangFilter('all')}
          className={`min-h-9 rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition ${
            langFilter === 'all'
              ? 'bg-[var(--accent)] text-white shadow-sm'
              : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          All Languages ({PRACTICE_CHALLENGES.length})
        </button>
        {(Object.keys(LANG_META) as ChallengeLang[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLangFilter(lang)}
            className={`min-h-9 rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition ${
              langFilter === lang
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {LANG_META[lang].label}
          </button>
        ))}
      </div>

      {/* Main Split Arena */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Challenge List */}
        <aside className="max-h-[620px] space-y-2.5 overflow-y-auto pr-1 lg:col-span-4">
          {filtered.map((ch) => {
            const isSolved = Boolean(solvedMap[ch.id]);
            const isSelected = ch.id === active.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelect(ch.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--bg-elevated)] text-[var(--text)] hover:-translate-y-0.5'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                      }`}
                    >
                      {LANG_META[ch.language].label}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isSelected
                          ? 'text-white/85'
                          : ch.difficulty === 'Easy'
                            ? 'text-emerald-600'
                            : ch.difficulty === 'Medium'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-bold">{ch.title}</p>
                </div>
                {isSolved && (
                  <CheckCircle2
                    className={`h-5 w-5 shrink-0 ${isSelected ? 'text-white' : 'text-[var(--success)]'}`}
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* Active Challenge Workspace */}
        <section className="space-y-5 lg:col-span-8">
          <div className="rounded-3xl bg-[var(--bg-elevated)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-bold text-white ${langInfo.badge}`}>
                  {langInfo.label}
                </span>
                <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {active.topic}
                </span>
                <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {active.difficulty}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-[var(--text)]">{active.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{active.prompt}</p>

            {active.schemaSql && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-[#0f172a] p-4">
                <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-violet-300">
                  Table Schema & Seed Data
                </p>
                <pre className="overflow-x-auto font-mono text-xs text-slate-200">{active.schemaSql}</pre>
              </div>
            )}

            {showHint && (
              <div className="mt-4 rounded-2xl bg-[var(--accent-soft)] p-4 text-xs leading-relaxed text-[var(--text)]">
                <strong className="text-[var(--accent)]">Hint:</strong> {active.hint}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl bg-[var(--bg-elevated)] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-muted)] px-4 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Solution Editor
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleGrade}
                  disabled={running}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{running ? 'Grading...' : 'Run & Grade'}</span>
                </button>
              </div>
            </div>

            <div ref={editorHostRef} />

            <div className="grid grid-cols-1 gap-4 border-t border-slate-800 bg-[#0b0f14] p-4 font-mono text-xs sm:grid-cols-2">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  Expected Output
                </p>
                <pre className="whitespace-pre-wrap text-emerald-300">{active.expectedStdout}</pre>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Your Output
                </p>
                {!result ? (
                  <p className="text-slate-500">Click &ldquo;Run &amp; Grade&rdquo; to test your solution.</p>
                ) : (
                  <div>
                    <div
                      className={`mb-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        result.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {result.passed ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>All Tests Passed! Challenge Solved</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Output Did Not Match Yet</span>
                        </>
                      )}
                    </div>
                    {result.stdout && <pre className="whitespace-pre-wrap text-slate-100">{result.stdout}</pre>}
                    {result.stderr && <pre className="mt-1 whitespace-pre-wrap text-rose-300">{result.stderr}</pre>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
