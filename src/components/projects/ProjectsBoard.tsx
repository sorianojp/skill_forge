import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  FolderGit2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GUIDED_PROJECTS, type GuidedProject } from '@/data/projects';

const STORAGE_KEY = 'devpath_projects_v1';

type ChecksMap = Record<string, boolean[]>;

function loadChecks(): ChecksMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChecksMap) : {};
  } catch {
    return {};
  }
}

function saveChecks(map: ChecksMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export default function ProjectsBoard() {
  const [category, setCategory] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [activeId, setActiveId] = useState<string>(GUIDED_PROJECTS[0].id);
  const [checks, setChecks] = useState<ChecksMap>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setChecks(loadChecks());
  }, []);

  const filtered = useMemo(() => {
    return GUIDED_PROJECTS.filter((p) => {
      const matchCat = category === 'All' || p.category === category;
      const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
      return matchCat && matchDiff;
    });
  }, [category, difficulty]);

  const activeProject: GuidedProject =
    filtered.find((p) => p.id === activeId) ?? filtered[0] ?? GUIDED_PROJECTS[0];

  const getProjectChecks = (project: GuidedProject): boolean[] => {
    const existing = checks[project.id];
    if (existing && existing.length === project.milestones.length) return existing;
    return project.milestones.map(() => false);
  };

  const toggleMilestone = (project: GuidedProject, idx: number) => {
    const current = [...getProjectChecks(project)];
    current[idx] = !current[idx];
    const next = { ...checks, [project.id]: current };
    setChecks(next);
    saveChecks(next);
  };

  const handleCopySnippet = async (project: GuidedProject) => {
    try {
      await navigator.clipboard.writeText(project.starterSnippet);
      setCopiedId(project.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  const activeChecks = getProjectChecks(activeProject);
  const completedCount = activeChecks.filter(Boolean).length;
  const pct = Math.round((completedCount / activeProject.milestones.length) * 100);

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Frontend', 'Backend', 'Data', 'DevOps', 'Systems'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition ${
                category === cat
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-[var(--bg-muted)] p-1">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setDifficulty(lvl)}
              className={`min-h-9 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                difficulty === lvl
                  ? 'bg-[var(--bg-elevated)] text-[var(--text)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {lvl === 'All' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Project List */}
        <div className="space-y-3 lg:col-span-5">
          {filtered.map((proj) => {
            const pChecks = getProjectChecks(proj);
            const pDone = pChecks.filter(Boolean).length;
            const isSelected = proj.id === activeProject.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setActiveId(proj.id)}
                className={`w-full rounded-3xl p-5 text-left transition ${
                  isSelected
                    ? 'bg-[var(--bg-elevated)] ring-2 ring-[var(--accent)]'
                    : 'bg-[var(--bg-elevated)] opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text-muted)]">
                    {proj.category} · {proj.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-subtle)]">
                    <Clock className="h-3.5 w-3.5" />~{proj.estimatedHours}h
                  </span>
                </div>
                <h2 className="mt-2.5 text-base font-extrabold text-[var(--text)]">{proj.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">{proj.tagline}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-[var(--bg-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      pDone === proj.milestones.length ? 'text-[var(--success)]' : 'text-[var(--text-subtle)]'
                    }`}
                  >
                    {pDone}/{proj.milestones.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Project Brief & Interactive Milestones */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[var(--bg-elevated)] p-7 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <FolderGit2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    {activeProject.category} Capstone · {activeProject.difficulty}
                  </p>
                  <h2 className="text-2xl font-extrabold text-[var(--text)]">{activeProject.title}</h2>
                </div>
              </div>
              <a
                href={`/playground?lang=${activeProject.playgroundLang}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                <Code2 className="h-4 w-4" />
                <span>Open Playground</span>
              </a>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {activeProject.tagline}
            </p>

            {/* Architecture Blueprint */}
            <div className="mt-6 rounded-2xl bg-[var(--bg-muted)] p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                <Layers className="h-4 w-4 text-[var(--accent)]" />
                <span>Architecture Guidance</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                {activeProject.architectureSummary}
              </p>
            </div>

            {/* Interactive Milestone Checklist */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text)]">
                <span>Build Milestones ({completedCount}/{activeProject.milestones.length})</span>
                <span className="text-[var(--accent)]">{pct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <ul className="mt-4 space-y-2">
                {activeProject.milestones.map((ms, idx) => {
                  const done = activeChecks[idx];
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => toggleMilestone(activeProject, idx)}
                        className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                          done
                            ? 'bg-[var(--success-soft)] text-[var(--text)]'
                            : 'bg-[var(--bg-muted)] text-[var(--text)] hover:bg-[var(--accent-soft)]'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-subtle)]" />
                        )}
                        <span className={done ? 'line-through opacity-80' : ''}>{ms}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Starter Code Snippet */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-[#0f172a]">
              <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-300">
                <span className="font-mono font-semibold">Starter Blueprint</span>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(activeProject)}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
                >
                  {copiedId === activeProject.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedId === activeProject.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto px-4 pb-4 font-mono text-xs text-slate-200">
                <code>{activeProject.starterSnippet}</code>
              </pre>
            </div>

            {/* Stretch Goals */}
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Stretch Goals</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs text-[var(--text-muted)]">
                {activeProject.stretchGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-[var(--accent)]">+</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Prerequisite Courses */}
            <div className="mt-6 border-t border-[var(--border)] pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                Recommended Prep Tracks
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {activeProject.recommendedCourses.map((c) => (
                  <a
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-muted)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                  >
                    <span>{c.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
