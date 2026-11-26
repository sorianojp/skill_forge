import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { php as phpLang } from '@codemirror/lang-php';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, CheckCircle2, Circle, Copy, Loader2, Play, RotateCcw, Terminal, XCircle } from 'lucide-react';

export interface PhpTest {
  label: string;
  /**
   * PHP snippet appended after user code that calls exit(1) or throws on failure.
   */
  assertPhp: string;
}

interface PhpPlaygroundProps {
  title?: string;
  code: string;
  height?: number;
  tests?: PhpTest[];
}

declare global {
  interface Window {
    __skillforgePhpWasm?: Promise<any>;
  }
}

async function getPhpClass(): Promise<any> {
  if (typeof window === 'undefined') throw new Error('Browser only');
  if (window.__skillforgePhpWasm) return window.__skillforgePhpWasm;

  const phpCdnUrl: string = 'https://cdn.jsdelivr.net/npm/php-wasm@0.0.9-alpha-25/PhpWeb.mjs';
  window.__skillforgePhpWasm = import(/* @vite-ignore */ phpCdnUrl)
    .then((mod) => mod.PhpWeb)
    .catch((err) => {
      window.__skillforgePhpWasm = undefined;
      throw err;
    });

  return window.__skillforgePhpWasm;
}

async function runPhpSnippet(PhpWeb: any, code: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const php = new PhpWeb();
    let stdout = '';
    let stderr = '';

    php.addEventListener('output', (event: any) => {
      const detail = event.detail;
      stdout += Array.isArray(detail) ? detail.join('') : String(detail ?? '');
    });

    php.addEventListener('error', (event: any) => {
      const detail = event.detail;
      stderr += Array.isArray(detail) ? detail.join('') : String(detail ?? '');
    });

    php.addEventListener('ready', async () => {
      try {
        // php-wasm wraps scripts internally, so declare(strict_types=1) fails with line-2 fatal error
        const normalized = code
          .trimStart()
          .replace(/declare\s*\(\s*strict_types\s*=\s*1\s*\)\s*;/gi, '');
        const exitCode = await php.run(normalized);
        resolve({ stdout, stderr, exitCode: Number(exitCode ?? 0) });
      } catch (err) {
        reject(err);
      }
    });
  });
}

export default function PhpPlayground({
  title = 'Try It Yourself (PHP 8)',
  code: initialRaw,
  height = 240,
  tests,
}: PhpPlaygroundProps) {
  const initialCode = initialRaw.trim();
  const [source, setSource] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
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
        phpLang(),
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
    setOutput('');
    setTestResults(null);
    setStatus(window.__skillforgePhpWasm ? 'running' : 'loading');

    try {
      const PhpWeb = await getPhpClass();
      setStatus('running');

      const res = await runPhpSnippet(PhpWeb, source);
      if (res.stderr.trim()) {
        setError(res.stderr.trim());
      }
      setOutput(res.stdout || '(Script finished with no printed output)');

      if (tests && tests.length > 0) {
        const cleaned = source.replace(/\?>\s*$/, '');
        const results: boolean[] = [];
        for (const t of tests) {
          const checkScript = `${cleaned}\n<?php\n${t.assertPhp}\n`;
          try {
            const checkRes = await runPhpSnippet(PhpWeb, checkScript);
            results.push(checkRes.exitCode === 0 && !checkRes.stderr.trim());
          } catch {
            results.push(false);
          }
        }
        setTestResults(results);
      }
    } catch (err: any) {
      setError(err?.message ? String(err.message) : 'Could not load PHP WebAssembly runtime.');
    } finally {
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setSource(initialCode);
    setOutput('');
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
          <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
            PHP
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
                ? 'Loading PHP...'
                : status === 'running'
                  ? 'Running...'
                  : tests
                    ? 'Run & Test'
                    : 'Run PHP'}
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
          <span>PHP 8 Output (WebAssembly)</span>
        </div>

        {error ? (
          <pre className="whitespace-pre-wrap text-rose-400">{error}</pre>
        ) : !output ? (
          <p className="text-slate-500">Click Run PHP to execute real PHP 8 right in your browser.</p>
        ) : (
          <pre className="whitespace-pre-wrap text-indigo-300">{output}</pre>
        )}
      </div>

      {/* Optional Automated PHP Tests */}
      {tests && tests.length > 0 && (
        <div className="bg-[var(--bg-subtle)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Automated PHP Checks
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
