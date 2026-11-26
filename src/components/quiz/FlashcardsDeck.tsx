import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, RotateCw, Shuffle } from 'lucide-react';
import type { ExamQuestion } from '@/data/exams';

export interface FlashcardDeckTrack {
  slug: string;
  title: string;
  shortTitle: string;
  cards: ExamQuestion[];
}

interface Props {
  tracks: FlashcardDeckTrack[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlashcardsDeck({ tracks }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>(tracks[0]?.slug ?? '');
  const [cards, setCards] = useState<ExamQuestion[]>(tracks[0]?.cards ?? []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Record<number, boolean>>({});

  const activeTrack = useMemo(
    () => tracks.find((t) => t.slug === activeSlug) ?? tracks[0],
    [tracks, activeSlug]
  );

  useEffect(() => {
    if (!activeTrack) return;
    setCards(activeTrack.cards);
    setIndex(0);
    setFlipped(false);
    setMastered({});
  }, [activeTrack]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        setFlipped(false);
        setIndex((i) => (cards.length ? (i + 1) % cards.length : 0));
      } else if (e.code === 'ArrowLeft') {
        setFlipped(false);
        setIndex((i) => (cards.length ? (i - 1 + cards.length) % cards.length : 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cards.length]);

  const card = cards[index];
  const masteredCount = Object.values(mastered).filter(Boolean).length;

  const handleShuffle = () => {
    setCards((prev) => shuffle(prev));
    setIndex(0);
    setFlipped(false);
    setMastered({});
  };

  const handleNext = () => {
    setFlipped(false);
    setIndex((i) => (cards.length ? (i + 1) % cards.length : 0));
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((i) => (cards.length ? (i - 1 + cards.length) % cards.length : 0));
  };

  const handleMarkMastered = () => {
    setMastered((prev) => ({ ...prev, [index]: true }));
    handleNext();
  };

  return (
    <div className="space-y-6">
      {/* Track Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-[var(--bg-elevated)] p-3">
        {tracks.map((t) => {
          const isAct = t.slug === activeSlug;
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActiveSlug(t.slug)}
              className={`min-h-9 rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition ${
                isAct
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {t.shortTitle}
            </button>
          );
        })}
      </div>

      {card && (
        <div className="mx-auto max-w-3xl space-y-5">
          {/* Deck Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold text-[var(--text-muted)]">
              <span className="text-[var(--text)]">{activeTrack.title}</span> · Card {index + 1} of{' '}
              {cards.length} · <span className="text-[var(--success)]">{masteredCount} mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text)] hover:text-[var(--accent)]"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Shuffle</span>
              </button>
              <a
                href={`/courses/${activeTrack.slug}/exam`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[var(--accent-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--accent)] hover:opacity-90"
              >
                <span>Take Final Exam</span>
              </a>
            </div>
          </div>

          {/* Interactive Flashcard */}
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="flex min-h-[300px] w-full flex-col justify-between rounded-3xl bg-[var(--bg-elevated)] p-8 text-left shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  flipped
                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                    : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                }`}
              >
                {flipped ? 'Answer & Explanation' : 'Question'}
              </span>
              {mastered[index] && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--success)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Mastered
                </span>
              )}
            </div>

            {!flipped ? (
              <div className="my-6">
                <p className="text-xl font-extrabold leading-snug text-[var(--text)] sm:text-2xl">
                  {card.question}
                </p>
              </div>
            ) : (
              <div className="my-6 space-y-4">
                <div className="rounded-2xl bg-[var(--success-soft)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">
                    Correct Answer
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[var(--text)]">
                    {card.options[card.answer]}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{card.explanation}</p>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)]">
              {flipped ? <RotateCw className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{flipped ? 'Click or press Space to see question' : 'Click or press Space to reveal answer'}</span>
            </div>
          </button>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleMarkMastered}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[var(--success)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Got It (Next)</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--bg-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
