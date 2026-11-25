import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { sql as sqlLang } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, CheckCircle2, Circle, Copy, Database, Loader2, Play, RotateCcw, XCircle } from 'lucide-react';

export interface SqlTest {
  label: string;
  /**
   * JS expression receiving `columns` (string[]), `values` (any[][]), and `db` (sql.js Database).
   * Return truthy to pass.
   */
  check: string;
}

interface SqlResultTable {
  columns: string[];
  values: unknown[][];
}

interface SqlPlaygroundProps {
  title?: string;
  schemaSql: string;
  query: string;
  height?: number;
  tests?: SqlTest[];
}

declare global {
  interface Window {
    initSqlJs?: (opts?: { locateFile?: (file: string) => string }) => Promise<any>;
    __skillforgeSqlJs?: Promise<any>;
  }
}

const SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/';

async function getSqlJs(): Promise<any> {
  if (typeof window === 'undefined') throw new Error('Browser only');
  if (window.__skillforgeSqlJs) return window.__skillforgeSqlJs;

  window.__skillforgeSqlJs = new Promise((resolve, reject) => {
    const boot = async () => {
      try {
        if (!window.initSqlJs) throw new Error('sql.js loader failed');
        const SQL = await window.initSqlJs({
          locateFile: (file: string) => `${SQLJS_CDN}${file}`,
        });
        resolve(SQL);
      } catch (err) {
        window.__skillforgeSqlJs = undefined;
        reject(err);
      }
    };

    if (window.initSqlJs) {
      boot();
      return;
    }

    const script = document.createElement('script');
    script.src = `${SQLJS_CDN}sql-wasm.js`;
    script.async = true;
    script.onload = boot;
    script.onerror = () => {
      window.__skillforgeSqlJs = undefined;
      reject(new Error('Could not load SQLite WebAssembly runtime.'));
    };
    document.head.appendChild(script);
  });

  return window.__skillforgeSqlJs;
}

export default function SqlPlayground({
  title = 'Try It Yourself (SQLite)',
  schemaSql,
  query: initialRaw,
  height = 220,
  tests,
}: SqlPlaygroundProps) {
  const initialQuery = initialRaw.trim();
  const [source, setSource] = useState(initialQuery);
  const [tables, setTables] = useState<SqlResultTable[] | null>(null);
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
      doc: initialQuery,
      extensions: [
        basicSetup,
        sqlLang(),
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
  }, [height, initialQuery]);

  const handleRun = async () => {
    setError(null);
    setTables(null);
    setTestResults(null);
    setStatus(window.__skillforgeSqlJs ? 'running' : 'loading');

    try {
      const SQL = await getSqlJs();
      setStatus('running');

      const db = new SQL.Database();
      try {
        db.run(schemaSql);
        const execResults = db.exec(source) as SqlResultTable[];
        setTables(execResults);

        if (tests && tests.length > 0) {
          const last = execResults[execResults.length - 1] ?? { columns: [], values: [] };
          const checks = tests.map((t) => {
            try {
              const fn = new Function('columns', 'values', 'db', t.check);
              return Boolean(fn(last.columns, last.values, db));
            } catch {
              return false;
            }
          });
          setTestResults(checks);
        }
      } finally {
        db.close();
      }
    } catch (err: any) {
      setError(err?.message ? String(err.message) : String(err));
    } finally {
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setSource(initialQuery);
    setTables(null);
    setError(null);
    setTestResults(null);
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: initialQuery,
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
          <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
            SQL
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
                ? 'Loading SQLite...'
                : status === 'running'
                  ? 'Running...'
                  : tests
                    ? 'Run & Test'
                    : 'Run SQL'}
            </span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-[#282c34]">
        <div ref={editorHostRef} />
      </div>

      {/* Result Table Area */}
      <div className="bg-[var(--bg-subtle)] p-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          <Database className="h-3.5 w-3.5" />
          <span>Query Result (In-Browser SQLite)</span>
        </div>

        {error ? (
          <pre className="rounded-xl bg-[var(--danger-soft)] p-3 font-mono text-xs text-[var(--danger)] whitespace-pre-wrap">
            {error}
          </pre>
        ) : tables === null ? (
          <p className="text-xs text-[var(--text-subtle)]">
            Click Run SQL to execute this query against a live in-browser SQLite database.
          </p>
        ) : tables.length === 0 ? (
          <p className="text-xs font-medium text-[var(--success)]">
            Query executed successfully (0 rows returned).
          </p>
        ) : (
          <div className="space-y-4">
            {tables.map((tbl, tIdx) => (
              <div key={tIdx} className="overflow-x-auto rounded-xl bg-[var(--bg)]">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-muted)]">
                      {tbl.columns.map((col) => (
                        <th key={col} className="px-3 py-2 font-mono font-bold text-[var(--text)]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {tbl.values.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 font-mono text-[var(--text-muted)]">
                            {cell === null ? <span className="italic opacity-60">NULL</span> : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 py-1.5 text-[11px] text-[var(--text-subtle)]">
                  {tbl.values.length} {tbl.values.length === 1 ? 'row' : 'rows'} returned
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional Automated SQL Tests */}
      {tests && tests.length > 0 && (
        <div className="bg-[var(--bg-elevated)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Automated SQL Checks
            </span>
            {allTestsPassed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--success)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All Checks Passed!
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
