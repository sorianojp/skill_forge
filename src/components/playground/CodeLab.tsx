import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { cpp as cppLang } from '@codemirror/lang-cpp';
import { java as javaLang } from '@codemirror/lang-java';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, Copy, Eye, Loader2, Play, RotateCcw, Terminal } from 'lucide-react';

type Lang = 'c' | 'cpp' | 'java' | 'csharp' | 'ts' | 'node' | 'bash';

interface CodeLabProps {
  title?: string;
  language: Lang;
  code: string;
  expectedOutput: string;
  height?: number;
}

const LABELS: Record<Lang, { name: string; color: string; runtime: string }> = {
  c: { name: 'C', color: 'bg-slate-700', runtime: 'GCC 13 (C11)' },
  cpp: { name: 'C++', color: 'bg-blue-600', runtime: 'GCC 13 (C++20)' },
  java: { name: 'Java', color: 'bg-amber-600', runtime: 'OpenJDK 21' },
  csharp: { name: 'C#', color: 'bg-purple-600', runtime: '.NET 8 (C# 12)' },
  ts: { name: 'TypeScript', color: 'bg-sky-600', runtime: 'TypeScript 5.6' },
  node: { name: 'Node.js', color: 'bg-emerald-600', runtime: 'Node.js 20' },
  bash: { name: 'Bash', color: 'bg-zinc-700', runtime: 'GNU Bash' },
};

function getApiBase(): string {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'https://devpath.mycampus.ph';
  }
  return '';
}

export default function CodeLab({
  title = 'Interactive Code Lab',
  language,
  code: initialRaw,
  expectedOutput,
  height = 240,
}: CodeLabProps) {
  const initialCode = initialRaw.trim();
  const [source, setSource] = useState(initialCode);
  const [showExpected, setShowExpected] = useState(true);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [liveStdout, setLiveStdout] = useState<string | null>(null);
  const [liveStderr, setLiveStderr] = useState<string | null>(null);
  const [runMeta, setRunMeta] = useState<string | null>(null);

  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorHostRef.current) return;
    const langExt =
      language === 'c' || language === 'cpp'
        ? cppLang()
        : language === 'ts' || language === 'node'
          ? jsLang({ typescript: language === 'ts' })
          : javaLang();

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setSource(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        basicSetup,
        langExt,
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
  }, [initialCode, language, height]);

  const handleReset = () => {
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: initialCode },
      });
    }
    setSource(initialCode);
    setLiveStdout(null);
    setLiveStderr(null);
    setRunMeta(null);
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

  const handleRunLive = async () => {
    setRunning(true);
    setLiveStderr(null);
    setRunMeta(null);
    try {
      const res = await fetch(`${getApiBase()}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code: source }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setLiveStdout(null);
        setLiveStderr(data.error || 'Execution failed. Please try again.');
      } else {
        setLiveStdout(data.stdout ?? '');
        setLiveStderr(data.stderr ? data.stderr : null);
        setRunMeta(`${LABELS[language].runtime} • ${data.durationMs ?? 0}ms • exit ${data.status ?? '0'}`);
      }
    } catch {
      setLiveStdout(null);
      setLiveStderr('Could not reach live compiler API. Check your network connection and try again.');
    } finally {
      setRunning(false);
    }
  };

  const meta = LABELS[language];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl bg-[var(--bg-elevated)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-subtle)] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${meta.color}`}>
            {meta.name}
          </span>
          <span className="text-sm font-semibold text-[var(--text)]">{title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleRunLive}
            disabled={running}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Compiling...' : 'Run Live'}
          </button>
          <button
            type="button"
            onClick={() => setShowExpected((v) => !v)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            <Eye className="h-3.5 w-3.5" />
            {showExpected ? 'Hide Expected' : 'Expected'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div ref={editorHostRef} />

      {(liveStdout !== null || liveStderr !== null) && (
        <div className="border-t border-slate-800 bg-[#0b0f14] px-4 py-3 font-mono text-xs">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Live Output
            </span>
            {runMeta && <span className="font-normal normal-case text-slate-400">{runMeta}</span>}
          </div>
          {liveStdout !== null && (
            <pre className="whitespace-pre-wrap text-slate-100">
              {liveStdout.trim() ? liveStdout : '(no stdout)'}
            </pre>
          )}
          {liveStderr && (
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-rose-950/60 p-2.5 text-rose-300">
              {liveStderr}
            </pre>
          )}
        </div>
      )}

      {showExpected && liveStdout === null && liveStderr === null && (
        <div className="border-t border-slate-800 bg-[#0f172a] px-4 py-3 font-mono text-xs text-slate-200">
          <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Expected Output
            </span>
            <span className="font-normal normal-case text-slate-400">
              Click &ldquo;Run Live&rdquo; to compile with {meta.runtime}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-emerald-300">{expectedOutput.trim()}</pre>
        </div>
      )}
    </div>
  );
}
