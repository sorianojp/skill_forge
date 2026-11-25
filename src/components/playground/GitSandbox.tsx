import { useState } from 'react';
import { GitBranch, RotateCcw, Terminal } from 'lucide-react';

interface CommitNode {
  hash: string;
  message: string;
  branch: string;
}

interface GitSandboxProps {
  title?: string;
  starterHint?: string;
  suggestedCommands?: string[];
}

export default function GitSandbox({
  title = 'Interactive Git Terminal',
  starterHint = 'Try: git status, git add ., git commit -m "init", git checkout -b feature, git log --oneline',
  suggestedCommands = ['git status', 'git add .', 'git commit -m "first commit"', 'git checkout -b feature', 'git log --oneline'],
}: GitSandboxProps) {
  const [branch, setBranch] = useState('main');
  const [branches, setBranches] = useState<string[]>(['main']);
  const [unstaged, setUnstaged] = useState<string[]>(['index.html', 'styles.css']);
  const [staged, setStaged] = useState<string[]>([]);
  const [commits, setCommits] = useState<CommitNode[]>([
    { hash: 'a1b2c3d', message: 'Initial repository setup', branch: 'main' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: 'git status', out: 'On branch main\nUntracked files: index.html, styles.css' },
  ]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    let out = '';

    if (cmd === 'git status') {
      out = `On branch ${branch}`;
      if (staged.length > 0) out += `\nChanges to be committed: ${staged.join(', ')}`;
      if (unstaged.length > 0) out += `\nChanges not staged: ${unstaged.join(', ')}`;
      if (staged.length === 0 && unstaged.length === 0) out += '\nnothing to commit, working tree clean';
    } else if (cmd === 'git add .' || cmd === 'git add -A') {
      if (unstaged.length === 0) {
        out = 'No unstaged files to add.';
      } else {
        setStaged((prev) => [...prev, ...unstaged]);
        setUnstaged([]);
        out = `Staged ${unstaged.length} file(s). Ready to commit.`;
      }
    } else if (cmd.startsWith('git commit -m ')) {
      const msg = cmd.slice('git commit -m '.length).replace(/^["']|["']$/g, '').trim();
      if (staged.length === 0) {
        out = 'Nothing staged to commit. Run "git add ." first.';
      } else {
        const hash = Math.random().toString(16).slice(2, 9);
        setCommits((prev) => [{ hash, message: msg || 'update', branch }, ...prev]);
        setStaged([]);
        out = `[${branch} ${hash}] ${msg || 'update'}`;
      }
    } else if (cmd === 'git branch') {
      out = branches.map((b) => (b === branch ? `* ${b}` : `  ${b}`)).join('\n');
    } else if (cmd.startsWith('git checkout -b ') || cmd.startsWith('git switch -c ')) {
      const next = cmd.split(/\s+/).pop() ?? '';
      if (!next) {
        out = 'Provide a branch name.';
      } else {
        if (!branches.includes(next)) setBranches((prev) => [...prev, next]);
        setBranch(next);
        out = `Switched to a new branch '${next}'`;
      }
    } else if (cmd.startsWith('git checkout ') || cmd.startsWith('git switch ')) {
      const target = cmd.split(/\s+/).pop() ?? '';
      if (branches.includes(target)) {
        setBranch(target);
        out = `Switched to branch '${target}'`;
      } else {
        out = `error: branch '${target}' not found. Use "git checkout -b ${target}" to create it.`;
      }
    } else if (cmd.startsWith('git merge ')) {
      const target = cmd.split(/\s+/).pop() ?? '';
      if (!branches.includes(target)) {
        out = `merge: ${target} - not something we can merge`;
      } else if (target === branch) {
        out = 'Already up to date.';
      } else {
        const hash = Math.random().toString(16).slice(2, 9);
        setCommits((prev) => [{ hash, message: `Merge branch '${target}' into ${branch}`, branch }, ...prev]);
        out = `Merged '${target}' into '${branch}' (${hash})`;
      }
    } else if (cmd === 'git log --oneline' || cmd === 'git log') {
      out = commits.map((c) => `${c.hash} (${c.branch}) ${c.message}`).join('\n');
    } else if (cmd === 'touch app.js') {
      setUnstaged((prev) => (prev.includes('app.js') ? prev : [...prev, 'app.js']));
      out = 'Created untracked file: app.js';
    } else {
      out = `Simulated shell: try git status, git add ., git commit -m "msg", git branch, git checkout -b feature, git merge feature, git log --oneline`;
    }

    setHistory((prev) => [...prev.slice(-8), { cmd, out }]);
    setInput('');
  };

  const handleReset = () => {
    setBranch('main');
    setBranches(['main']);
    setUnstaged(['index.html', 'styles.css']);
    setStaged([]);
    setCommits([{ hash: 'a1b2c3d', message: 'Initial repository setup', branch: 'main' }]);
    setHistory([{ cmd: 'git status', out: 'On branch main\nUntracked files: index.html, styles.css' }]);
    setInput('');
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl bg-[var(--bg-elevated)]">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
            Git
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
            <GitBranch className="h-3.5 w-3.5 text-red-500" />
            {branch}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Quick command pills */}
      <div className="flex flex-wrap gap-1.5 bg-[var(--bg-subtle)] px-5 pb-3">
        {suggestedCommands.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => runCommand(c)}
            className="rounded-full bg-[var(--bg-muted)] px-3 py-1 font-mono text-[11px] font-medium text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Terminal Output */}
      <div className="bg-[#0f172a] p-4 font-mono text-xs text-slate-200">
        <div className="max-h-52 space-y-2.5 overflow-y-auto">
          {history.map((item, idx) => (
            <div key={idx}>
              <div className="text-sky-400">
                <span className="text-emerald-400">({branch}) $</span> {item.cmd}
              </div>
              <pre className="mt-0.5 whitespace-pre-wrap text-slate-300">{item.out}</pre>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
          }}
          className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3"
        >
          <Terminal className="h-4 w-4 shrink-0 text-emerald-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={starterHint}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-3.5 py-1 text-xs font-semibold text-white"
          >
            Run
          </button>
        </form>
      </div>
    </div>
  );
}
