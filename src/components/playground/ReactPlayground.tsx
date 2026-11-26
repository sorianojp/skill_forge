import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, Copy, Play, RotateCcw } from 'lucide-react';

interface ReactPlaygroundProps {
  title?: string;
  code: string;
  height?: number;
}

function buildReactSrcDoc(jsxCode: string): string {
  const safeCode = JSON.stringify(jsxCode);
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
    button {
      font-family: inherit;
      cursor: pointer;
    }
    .err {
      padding: 12px;
      border-radius: 12px;
      background: #fef2f2;
      color: #b91c1c;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      white-space: pre-wrap;
    }
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"><p style="color:#64748b;font-size:13px">Loading React JSX runtime...</p></div>
  <script>
    (function() {
      const rootEl = document.getElementById('root');
      function showError(err) {
        rootEl.innerHTML = '<div class="err">' + String(err && err.message ? err.message : err) + '</div>';
      }
      try {
        const rawCode = ${safeCode};
        const userCode = rawCode.replace(/^\\s*import\\s+[^;\\n]+from\\s+['"]react(?:-dom)?['"];?\\s*$/gm, '');
        const wrapped = [
          'const { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } = React;',
          userCode,
          'if (typeof App !== "undefined") { ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App)); }'
        ].join('\\n');
        const compiled = Babel.transform(wrapped, {
          presets: [['react', { runtime: 'classic' }]],
        }).code;
        new Function('React', 'ReactDOM', compiled)(React, ReactDOM);
      } catch (err) {
        showError(err);
      }
    })();
  </script>
</body>
</html>`;
}

export default function ReactPlayground({
  title = 'Live React JSX Playground',
  code: initialRaw,
  height = 260,
}: ReactPlaygroundProps) {
  const initialCode = initialRaw.trim();
  const [source, setSource] = useState(initialCode);
  const [runCode, setRunCode] = useState(initialCode);
  const [runKey, setRunKey] = useState(0);
  const [copied, setCopied] = useState(false);

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
        jsLang({ jsx: true }),
        oneDark,
        EditorView.lineWrapping,
        updateListener,
        EditorView.theme({
          '&': { height: `${height}px`, fontSize: '13.5px' },
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
  }, [initialCode, height]);

  const srcDoc = useMemo(() => buildReactSrcDoc(runCode), [runCode]);

  const handleRun = () => {
    setRunCode(source);
    setRunKey((k) => k + 1);
  };

  const handleReset = () => {
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: initialCode },
      });
    }
    setSource(initialCode);
    setRunCode(initialCode);
    setRunKey((k) => k + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl bg-[var(--bg-elevated)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-subtle)] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md bg-cyan-600 px-2 py-0.5 text-[11px] font-bold text-white">
            JSX
          </span>
          <span className="text-sm font-semibold text-[var(--text)]">{title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleRun}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
          >
            <Play className="h-3.5 w-3.5" />
            Run JSX
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--bg-muted)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--bg-muted)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div ref={editorHostRef} />
        <div className="border-t border-[var(--border)] bg-white lg:border-t-0 lg:border-l">
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Live React Preview
          </div>
          <iframe
            key={runKey}
            title={title}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            style={{ height: `${height - 28}px` }}
            className="w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
