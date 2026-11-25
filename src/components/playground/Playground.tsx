import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react';

type Tab = 'html' | 'css' | 'js';

interface ConsoleEntry {
  level: 'log' | 'warn' | 'error';
  message: string;
}

interface PlaygroundProps {
  title?: string;
  html?: string;
  css?: string;
  js?: string;
  defaultTab?: Tab;
  height?: number;
  showConsole?: boolean;
}

function buildSrcDoc(htmlCode: string, cssCode: string, jsCode: string, instanceId: string): string {
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
      const id = ${JSON.stringify(instanceId)};
      function send(level, args) {
        try {
          const text = Array.from(args).map((a) => {
            if (typeof a === 'object' && a !== null) {
              try { return JSON.stringify(a); } catch { return String(a); }
            }
            return String(a);
          }).join(' ');
          parent.postMessage({ type: 'openlearn-console', id, level, message: text }, '*');
        } catch {}
      }
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      console.log = function() { send('log', arguments); origLog.apply(console, arguments); };
      console.warn = function() { send('warn', arguments); origWarn.apply(console, arguments); };
      console.error = function() { send('error', arguments); origError.apply(console, arguments); };
      window.addEventListener('error', function(e) {
        send('error', [e.message || 'Runtime error']);
      });
    })();
  </script>
  <script>
    try {
      ${jsCode}
    } catch (err) {
      console.error(err && err.message ? err.message : String(err));
    }
  </script>
</body>
</html>`;
}

export default function Playground({
  title = 'Try It Yourself',
  html = '',
  css = '',
  js = '',
  defaultTab,
  height = 300,
  showConsole = false,
}: PlaygroundProps) {
  const initialHtml = html.trim();
  const initialCss = css.trim();
  const initialJs = js.trim();

  const availableTabs = useMemo<Tab[]>(() => {
    const tabs: Tab[] = [];
    if (initialHtml || (!initialCss && !initialJs)) tabs.push('html');
    if (initialCss || defaultTab === 'css') tabs.push('css');
    if (initialJs || defaultTab === 'js') tabs.push('js');
    // Always expose all three if standalone or if none specified
    if (tabs.length === 0) return ['html', 'css', 'js'];
    return tabs;
  }, [initialHtml, initialCss, initialJs, defaultTab]);

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab ?? availableTabs[0] ?? 'html');
  const [code, setCode] = useState({ html: initialHtml, css: initialCss, js: initialJs });
  const [runNonce, setRunNonce] = useState(0);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [consoleOpen, setConsoleOpen] = useState(showConsole || Boolean(initialJs));

  const instanceIdRef = useRef(`pg-${Math.random().toString(36).slice(2, 9)}`);
  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  const [debouncedCode, setDebouncedCode] = useState(code);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLogs([]);
      setDebouncedCode(code);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === 'openlearn-console' && data.id === instanceIdRef.current) {
        setLogs((prev) => [...prev.slice(-24), { level: data.level, message: data.message }]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

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
        keymap.of([]),
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

    const view = new EditorView({
      state,
      parent: editorHostRef.current,
    });
    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [activeTab, height]);

  const handleReset = () => {
    const fresh = { html: initialHtml, css: initialCss, js: initialJs };
    setCode(fresh);
    setDebouncedCode(fresh);
    setLogs([]);
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

  const handleRun = () => {
    setLogs([]);
    setDebouncedCode(code);
    setRunNonce((n) => n + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code[activeTab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard errors
    }
  };

  const srcDoc = useMemo(
    () => buildSrcDoc(debouncedCode.html, debouncedCode.css, debouncedCode.js, instanceIdRef.current),
    [debouncedCode, runNonce]
  );

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl bg-[var(--bg-elevated)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-elevated)] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            {title}
          </span>
          <div className="flex items-center rounded-full bg-[var(--bg-muted)] p-0.5">
            {(['html', 'css', 'js'] as Tab[]).map((tab) => {
              const hasContent = Boolean(code[tab].trim());
              const isVisible = availableTabs.includes(tab) || hasContent;
              if (!isVisible) return null;
              return (
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
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setConsoleOpen((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
              consoleOpen
                ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Console{logs.length > 0 ? ` (${logs.length})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleRun}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run</span>
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
            Live Result
          </div>
          <iframe
            key={runNonce}
            title={`${title} live preview`}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            style={{ height: `${height - 29}px` }}
            className="w-full border-0 bg-white"
          />
        </div>
      </div>

      {/* Optional Console Output */}
      {consoleOpen && (
        <div className="border-t border-[var(--border)] bg-[#0f172a] px-4 py-2.5 font-mono text-xs text-slate-200">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400">
            <span>Console Output</span>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          {logs.length === 0 ? (
            <p className="text-slate-500">No console output yet. Try calling console.log(...) in JS.</p>
          ) : (
            <ul className="max-h-32 space-y-1 overflow-y-auto">
              {logs.map((entry, idx) => (
                <li
                  key={idx}
                  className={
                    entry.level === 'error'
                      ? 'text-red-400'
                      : entry.level === 'warn'
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                  }
                >
                  <span className="mr-2 opacity-60">&gt;</span>
                  {entry.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
