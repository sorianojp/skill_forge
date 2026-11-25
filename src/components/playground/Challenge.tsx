import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { CheckCircle2, Circle, Play, RotateCcw, Trophy, XCircle } from 'lucide-react';

type Tab = 'html' | 'css' | 'js';

export interface ChallengeTest {
  label: string;
  /**
   * JS function body evaluated inside the sandboxed iframe after user code runs.
   * Must return truthy to pass, falsy (or throw) to fail.
   */
  test: string;
}

interface TestResult {
  passed: boolean;
  error?: string;
}

interface ChallengeProps {
  id: string;
  title?: string;
  instructions: string;
  html?: string;
  css?: string;
  js?: string;
  defaultTab?: Tab;
  height?: number;
  tests: ChallengeTest[];
}

function buildTestSrcDoc(
  htmlCode: string,
  cssCode: string,
  jsCode: string,
  tests: ChallengeTest[],
  instanceId: string
): string {
  const serializedTests = JSON.stringify(tests.map((t) => t.test));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
    }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    (function() {
      try {
        ${jsCode}
      } catch (err) {
        window.__openlearnUserError = err && err.message ? err.message : String(err);
      }

      const testBodies = ${serializedTests};
      const results = testBodies.map((body) => {
        try {
          const fn = new Function(body);
          const ok = Boolean(fn());
          return { passed: ok };
        } catch (err) {
          return { passed: false, error: err && err.message ? err.message : String(err) };
        }
      });

      parent.postMessage({
        type: 'openlearn-challenge-results',
        id: ${JSON.stringify(instanceId)},
        results,
        userError: window.__openlearnUserError || null,
      }, '*');
    })();
  </script>
</body>
</html>`;
}

export default function Challenge({
  id,
  title = 'Auto-Graded Coding Challenge',
  instructions,
  html = '',
  css = '',
  js = '',
  defaultTab,
  height = 300,
  tests,
}: ChallengeProps) {
  const initialHtml = html.trim();
  const initialCss = css.trim();
  const initialJs = js.trim();

  const availableTabs = useMemo<Tab[]>(() => {
    const tabs: Tab[] = [];
    if (initialHtml || defaultTab === 'html' || (!initialCss && !initialJs)) tabs.push('html');
    if (initialCss || defaultTab === 'css') tabs.push('css');
    if (initialJs || defaultTab === 'js') tabs.push('js');
    return tabs.length > 0 ? tabs : ['html', 'css', 'js'];
  }, [initialHtml, initialCss, initialJs, defaultTab]);

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab ?? availableTabs[0] ?? 'html');
  const [code, setCode] = useState({ html: initialHtml, css: initialCss, js: initialJs });
  const [submittedCode, setSubmittedCode] = useState(code);
  const [runNonce, setRunNonce] = useState(0);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [everPassed, setEverPassed] = useState(false);

  const instanceIdRef = useRef(`chg-${id}-${Math.random().toString(36).slice(2, 8)}`);
  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(`openlearn_challenge_${id}`) === 'passed') {
        setEverPassed(true);
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === 'openlearn-challenge-results' && data.id === instanceIdRef.current) {
        const res = (data.results ?? []) as TestResult[];
        setResults(res);
        setUserError(data.userError ?? null);
        if (res.length > 0 && res.every((r) => r.passed)) {
          setEverPassed(true);
          try {
            localStorage.setItem(`openlearn_challenge_${id}`, 'passed');
          } catch {}
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [id]);

  useEffect(() => {
    if (!editorHostRef.current) return;
    const langExt =
      activeTab === 'html' ? htmlLang() : activeTab === 'css' ? cssLang() : jsLang();

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const value = update.state.doc.toString();
        setCode((prev) => ({ ...prev, [activeTab]: value }));
      }
    });

    const state = EditorState.create({
      doc: code[activeTab],
      extensions: [
        basicSetup,
        langExt,
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
  }, [activeTab, height]);

  const handleRunTests = () => {
    setSubmittedCode(code);
    setRunNonce((n) => n + 1);
  };

  const handleReset = () => {
    const fresh = { html: initialHtml, css: initialCss, js: initialJs };
    setCode(fresh);
    setSubmittedCode(fresh);
    setRunNonce((n) => n + 1);
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: editorViewRef.current.state.doc.length,
          insert: fresh[activeTab],
        },
      });
    }
  };

  const srcDoc = useMemo(
    () => buildTestSrcDoc(submittedCode.html, submittedCode.css, submittedCode.js, tests, instanceIdRef.current),
    [submittedCode, tests, runNonce]
  );

  const passedCount = results ? results.filter((r) => r.passed).length : 0;
  const allPassed = Boolean(results && results.length === tests.length && passedCount === tests.length);

  return (
    <section className="not-prose my-10 overflow-hidden rounded-3xl bg-[var(--bg-elevated)]">
      {/* Header */}
      <div className="bg-[var(--accent-soft)] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[var(--accent)]" />
            <h3 className="text-base font-extrabold text-[var(--text)]">{title}</h3>
          </div>
          {allPassed || everPassed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-3 py-0.5 text-xs font-bold text-[var(--success)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Challenge Passed!
            </span>
          ) : (
            <span className="text-xs font-semibold text-[var(--accent)]">
              {passedCount} / {tests.length} tests passing
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{instructions}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-elevated)] px-4 py-2.5">
        <div className="flex items-center rounded-full bg-[var(--bg-muted)] p-0.5">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition ${
                activeTab === tab
                  ? 'bg-[var(--bg-elevated)] text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleRunTests}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Run Tests
          </button>
        </div>
      </div>

      {/* Split Editor + Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="min-w-0 bg-[#282c34]">
          <div ref={editorHostRef} />
        </div>

        <div className="flex flex-col bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Live Output
          </div>
          <iframe
            key={runNonce}
            title={`${title} sandbox`}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            style={{ height: `${height - 29}px` }}
            className="w-full border-0 bg-white"
          />
        </div>
      </div>

      {/* Automated Test Results Checklist */}
      <div className="border-t border-[var(--border)] bg-[var(--bg-subtle)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Automated Requirements Check
          </span>
          {userError && (
            <span className="text-xs font-semibold text-[var(--danger)]">
              Runtime Error: {userError}
            </span>
          )}
        </div>

        <ul className="space-y-1.5">
          {tests.map((t, idx) => {
            const r = results?.[idx];
            return (
              <li
                key={idx}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
                  r?.passed
                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                    : r
                      ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
                      : 'bg-[var(--bg)] text-[var(--text-muted)]'
                }`}
              >
                {r?.passed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : r ? (
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
    </section>
  );
}
