import { useEffect, useState } from 'react';
import { Bookmark, Check, StickyNote } from 'lucide-react';
import {
  getProgress,
  saveLessonNote,
  subscribeProgress,
  toggleLessonBookmark,
  type ProgressState,
} from '@/lib/progress';

interface Props {
  lessonKey: string;
  lessonTitle: string;
  courseTitle: string;
  href: string;
}

export default function LessonStudyTools({ lessonKey, lessonTitle, courseTitle, href }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const syncFromState = (s: ProgressState) => {
    setBookmarked(Boolean(s.bookmarks?.[lessonKey]));
    const existing = s.notes?.[lessonKey]?.text ?? '';
    setNoteText((prev) => (prev === '' && existing ? existing : prev));
  };

  useEffect(() => {
    const initial = getProgress();
    setBookmarked(Boolean(initial.bookmarks?.[lessonKey]));
    setNoteText(initial.notes?.[lessonKey]?.text ?? '');
    return subscribeProgress(syncFromState);
  }, [lessonKey]);

  const handleToggleBookmark = () => {
    const next = toggleLessonBookmark(lessonKey, { title: lessonTitle, courseTitle, href });
    setBookmarked(next);
  };

  const handleSaveNote = () => {
    saveLessonNote(lessonKey, noteText, { title: lessonTitle, courseTitle, href });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1600);
  };

  return (
    <div className="rounded-3xl bg-[var(--bg-elevated)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          <StickyNote className="h-4 w-4 text-[var(--accent)]" />
          <span>Study Workspace</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
              bookmarked
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-[var(--bg-muted)] text-[var(--text)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Bookmarked' : 'Bookmark Lesson'}</span>
          </button>

          <button
            type="button"
            onClick={() => setNoteOpen((v) => !v)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>
              {noteOpen ? 'Hide Notes' : noteText.trim() ? 'Edit My Notes' : 'Add Study Note'}
            </span>
          </button>
        </div>
      </div>

      {noteOpen && (
        <div className="mt-4 space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            placeholder="Jot down key syntax, commands, or exam reminders for this lesson... (saved locally & synced with Cloud Sync)"
            className="w-full rounded-2xl bg-[var(--bg-muted)] p-4 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-subtle)]">
              Review all saved notes & bookmarks anytime in{' '}
              <a href="/progress" className="font-semibold text-[var(--accent)] hover:underline">
                My Progress
              </a>
              .
            </span>
            <button
              type="button"
              onClick={handleSaveNote}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              {savedNotice && <Check className="h-3.5 w-3.5" />}
              <span>{savedNotice ? 'Saved!' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
