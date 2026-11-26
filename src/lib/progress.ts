import { pushProgressToCloud } from './cloudSync';

const STORAGE_KEY = 'openlearn_progress_v1';
const CHANGE_EVENT = 'openlearn:progress-change';

export interface ExamResultRecord {
  bestScore: number; // percentage 0-100
  passed: boolean;
  passedAt?: string;
  certificateId?: string;
  learnerName?: string;
}

export interface ProgressState {
  completed: Record<string, string>; // key: "course/lesson" -> ISO timestamp
  exams?: Record<string, ExamResultRecord>; // key: courseSlug
  solvedChallenges?: Record<string, string>; // key: challengeId -> ISO timestamp
  activityDays?: string[]; // sorted YYYY-MM-DD local dates
  lastVisited?: {
    courseSlug: string;
    lessonSlug: string;
    lessonTitle: string;
    courseTitle: string;
    href: string;
    updatedAt: string;
  };
}

function getLocalDay(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addTodayActivity(days?: string[]): string[] {
  const today = getLocalDay();
  const set = new Set(days ?? []);
  set.add(today);
  return Array.from(set).sort();
}

function readState(): ProgressState {
  if (typeof window === 'undefined') return { completed: {}, exams: {}, solvedChallenges: {}, activityDays: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, exams: {}, solvedChallenges: {}, activityDays: [] };
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      completed: parsed.completed ?? {},
      exams: parsed.exams ?? {},
      solvedChallenges: parsed.solvedChallenges ?? {},
      activityDays: parsed.activityDays ?? [],
      lastVisited: parsed.lastVisited,
    };
  } catch {
    return { completed: {}, exams: {}, solvedChallenges: {}, activityDays: [] };
  }
}

function writeState(state: ProgressState, syncToCloud = true): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or privacy-mode errors
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: state }));
  if (syncToCloud) {
    void pushProgressToCloud(state);
  }
}

export function mergeProgressState(remote: ProgressState): ProgressState {
  const local = readState();
  const mergedCompleted = { ...(remote.completed ?? {}), ...(local.completed ?? {}) };
  const mergedExams: Record<string, ExamResultRecord> = { ...(remote.exams ?? {}) };
  for (const [slug, localRec] of Object.entries(local.exams ?? {})) {
    const remoteRec = mergedExams[slug];
    if (!remoteRec) {
      mergedExams[slug] = localRec;
    } else {
      mergedExams[slug] = {
        bestScore: Math.max(remoteRec.bestScore ?? 0, localRec.bestScore ?? 0),
        passed: Boolean(remoteRec.passed || localRec.passed),
        passedAt: remoteRec.passedAt ?? localRec.passedAt,
        certificateId: remoteRec.certificateId ?? localRec.certificateId,
        learnerName: localRec.learnerName ?? remoteRec.learnerName,
      };
    }
  }
  const mergedSolved = { ...(remote.solvedChallenges ?? {}), ...(local.solvedChallenges ?? {}) };
  const mergedDays = Array.from(
    new Set([...(remote.activityDays ?? []), ...(local.activityDays ?? [])])
  ).sort();
  const merged: ProgressState = {
    completed: mergedCompleted,
    exams: mergedExams,
    solvedChallenges: mergedSolved,
    activityDays: mergedDays,
    lastVisited: local.lastVisited ?? remote.lastVisited,
  };
  writeState(merged, false);
  return merged;
}

export function getProgress(): ProgressState {
  return readState();
}

export function isLessonCompleted(lessonKey: string): boolean {
  return Boolean(readState().completed[lessonKey]);
}

export function setLessonCompleted(lessonKey: string, completed: boolean): ProgressState {
  const state = readState();
  if (completed) {
    state.completed[lessonKey] = new Date().toISOString();
    state.activityDays = addTodayActivity(state.activityDays);
  } else {
    delete state.completed[lessonKey];
  }
  writeState(state);
  return state;
}

export function markChallengeSolved(challengeId: string): ProgressState {
  const state = readState();
  state.solvedChallenges = {
    ...(state.solvedChallenges ?? {}),
    [challengeId]: new Date().toISOString(),
  };
  state.activityDays = addTodayActivity(state.activityDays);
  writeState(state);
  return state;
}

export function getDailyStreak(): { current: number; longest: number; activeToday: boolean } {
  const days = new Set(readState().activityDays ?? []);
  const todayStr = getLocalDay();
  const activeToday = days.has(todayStr);

  // Compute current streak ending today or yesterday
  let current = 0;
  const cursor = new Date();
  if (!activeToday) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(getLocalDay(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, longest: Math.max(current, days.size > 0 ? 1 : 0), activeToday };
}

export function toggleLessonCompleted(lessonKey: string): boolean {
  const next = !isLessonCompleted(lessonKey);
  setLessonCompleted(lessonKey, next);
  return next;
}

export function recordLastVisited(info: Omit<NonNullable<ProgressState['lastVisited']>, 'updatedAt'>): void {
  const state = readState();
  state.lastVisited = {
    ...info,
    updatedAt: new Date().toISOString(),
  };
  writeState(state);
}

export function getExamResult(courseSlug: string): ExamResultRecord | undefined {
  return readState().exams?.[courseSlug];
}

export function saveExamResult(
  courseSlug: string,
  scorePercent: number,
  passed: boolean,
  learnerName?: string
): ExamResultRecord {
  const state = readState();
  const prev = state.exams?.[courseSlug];
  const nowPassed = Boolean(passed || prev?.passed);
  const record: ExamResultRecord = {
    bestScore: Math.max(prev?.bestScore ?? 0, scorePercent),
    passed: nowPassed,
    passedAt: prev?.passedAt ?? (nowPassed ? new Date().toISOString() : undefined),
    certificateId:
      prev?.certificateId ??
      (nowPassed
        ? `DP-${courseSlug.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        : undefined),
    learnerName: learnerName ?? prev?.learnerName,
  };
  state.exams = { ...(state.exams ?? {}), [courseSlug]: record };
  writeState(state);
  return record;
}

export function getCourseCompletion(courseSlug: string, totalLessons: number): {
  completedCount: number;
  percent: number;
} {
  const state = readState();
  const prefix = `${courseSlug}/`;
  const completedCount = Object.keys(state.completed).filter((k) => k.startsWith(prefix)).length;
  const percent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
  return { completedCount, percent };
}

export function clearAllProgress(): void {
  writeState({ completed: {}, exams: {} });
}

export function subscribeProgress(callback: (state: ProgressState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onCustom = (e: Event) => {
    const custom = e as CustomEvent<ProgressState>;
    callback(custom.detail ?? readState());
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback(readState());
  };
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener('storage', onStorage);
  };
}
