import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { cpp as cppLang } from '@codemirror/lang-cpp';
import { java as javaLang } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, Copy, Eye, RotateCcw, Terminal } from 'lucide-react';

type Lang = 'c' | 'cpp' | 'java' | 'csharp';

interface CodeLabProps {
  title?: string;
  language: Lang;
  code: string;
  expectedOutput: string;
  height?: number;
}

const LABELS: Record<Lang, { name: string; color: string }> = {
  c: { name: 'C', color: 'bg-slate-700' },
  cpp: { name: 'C++', color: 'bg-blue-600' },
  java: { name: 'Java', color: 'bg-amber-600' },
  csharp: { name: 'C#', color: 'bg-purple-600' },
};

export default function CodeLab({
  title = 'Interactive Code Lab',
  language,
  code: initialRaw,
  expectedOutput,
  height = 240,
}: CodeLabProps) {
  const initialCode = initialRaw.trim();
  const [source, setSource] = useState(initialCode);
  const [showOutput, setShowOutput] = useState(true);
  const [copied, setCopied] = useState(false);

  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorHostRef.current) return;
    const langExt = language === 'c' || language === 'cpp' ? cppLang() : javaLang();

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
  }, [height, initialCode, language]);

  const handleReset = () => {
    setSource(initialCode);
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

  const meta = LABELS[language];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl bg-[var(--bg-elevated)]">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase text-white ${meta.color}`}>
            {meta.name}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">{title}</span>
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
            onClick={() => setShowOutput((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{showOutput ? 'Hide Output' : 'Expected Output'}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#282c34]">
        <div ref={editorHostRef} />
      </div>

      {showOutput && (
        <div className="bg-[#0f172a] px-4 py-3 font-mono text-xs text-slate-200">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>Expected Program Output</span>
          </div>
          <pre className="whitespace-pre-wrap text-emerald-300">{expectedOutput.trim()}</pre>
        </div>
      )}
    </div>
  );
}
