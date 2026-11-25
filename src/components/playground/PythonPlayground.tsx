import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { python as pythonLang } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, CheckCircle2, Circle, Copy, Loader2, Play, RotateCcw, Terminal, XCircle } from 'lucide-react';

export interface PythonTest {
  label: string;
  assertCode: string;
}

interface PythonPlaygroundProps {
  title?: string;
  code: string;
  height?: number;
  tests?: PythonTest[];
}

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<any>;
    __skillforgePyodide?: Promise<any>;
  }
}

const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/';

async function getPyodide(): Promise<any> {
  if (typeof window === 'undefined') throw new Error('Browser only');
  if (window.__skillforgePyodide) return window.__skillforgePyodide;

  window.__skillforgePyodide = new Promise((resolve, reject) => {
    const boot = async () => {
      try {
        if (!window.loadPyodide) {
          throw new Error('Pyodide loader failed to initialize');
        }
        const py = await window.loadPyodide({ indexURL: PYODIDE_BASE });
        resolve(py);
      } catch (err) {
        window.__skillforgePyodide = undefined;
        reject(err);
      }
    };

    if (window.loadPyodide) {
      boot();
      return;
    }

    const script = document.createElement('script');
    script.src = `${PYODIDE_BASE}pyodide.js`;
    script.async = true;
    script.onload = boot;
    script.onerror = () => {
      window.__skillforgePyodide = undefined;
      reject(new Error('Could not load Python runtime (check internet connection).'));
    };
    document.head.appendChild(script);
  });

  return window.__skillforgePyodide;
}

export default function PythonPlayground({
  title = 'Try It Yourself (Python 3)',
  code: initialRaw,
  height = 240,
  tests,
}: PythonPlaygroundProps) {
  const initialCode = initialRaw.trim();
  const [source, setSource] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle');
  const [copied, setCopied] = useState(false);
  const [testResults, setTestResults] = useState<boolean[] | null>(null);

  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorHostRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setSource(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        pythonLang(),
        oneDark,
        EditorView.lineWrapping,
        updateListener,
        EditorView.theme({
          '&': { height: `${height}px`, fontSize: '13px' },
          '.cm-scroller': {
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            overflow: 'auto',
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorHostRef.current });
    editorViewRef.current = view;
    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [height, initialCode]);

  const handleRun = async () => {
    setError(null);
    setOutput([]);
    setTestResults(null);
    setStatus(window.__skillforgePyodide ? 'running' : 'loading');

    try {
      const py = await getPyodide();
      setStatus('running');

      const lines: string[] = [];
      py.setStdout({ batched: (msg: string) => lines.push(msg) });
      py.setStderr({ batched: (msg: string) => lines.push(`[stderr] ${msg}`) });

      const globals = py.globals.get('dict')();
      await py.runPythonAsync(source, { globals });

      if (tests && tests.length > 0) {
        const results: boolean[] = [];
        for (const t of tests) {
          try {
            await py.runPythonAsync(t.assertCode, { globals });
            results.push(true);
          } catch {
            results.push(false);
          }
        }
        setTestResults(results);
      }

      globals.destroy();
      setOutput(lines.length > 0 ? lines : ['(Program finished with no printed output)']);
    } catch (err: any) {
      setError(err?.message ? String(err.message) : String(err));
    } finally {
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setSource(initialCode);
    setOutput([]);
    setError(null);
    setTestResults(null);
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: initialCode,
        },
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const allTestsPassed = Boolean(
    tests && testResults && testResults.length === tests.length && testResults.every(Boolean)
  );

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl bg-[var(--bg-elevated)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-elevated)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
            Python
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={status !== 'idle'}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {status !== 'idle' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>
              {status === 'loading'
                ? 'Loading Python...'
                : status === 'running'
                  ? 'Running...'
                  : tests
                    ? 'Run & Test'
                    : 'Run Python'}
            </span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-[#282c34]">
        <div ref={editorHostRef} />
      </div>

      {/* Console Output */}
      <div className="bg-[#0f172a] px-4 py-3 font-mono text-xs text-slate-200">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>Python Output (WebAssembly / Pyodide)</span>
        </div>

        {error ? (
          <pre className="whitespace-pre-wrap text-rose-400">{error}</pre>
        ) : output.length === 0 ? (
          <p className="text-slate-500">Click Run Python to execute real Python 3 right in your browser.</p>
        ) : (
          <pre className="whitespace-pre-wrap text-emerald-300">{output.join('\n')}</pre>
        )}
      </div>

      {/* Optional Auto-Graded Python Assertions */}
      {tests && tests.length > 0 && (
        <div className="bg-[var(--bg-subtle)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Automated Python Tests
            </span>
            {allTestsPassed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--success)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All Tests Passed!
              </span>
            )}
          </div>
          <ul className="space-y-1.5">
            {tests.map((t, idx) => {
              const res = testResults?.[idx];
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                    res === true
                      ? 'bg-[var(--success-soft)] text-[var(--success)]'
                      : res === false
                        ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
                        : 'bg-[var(--bg)] text-[var(--text-muted)]'
                  }`}
                >
                  {res === true ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : res === false ? (
                    <XCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 opacity-40" />
                  )}
                  <span>{t.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
