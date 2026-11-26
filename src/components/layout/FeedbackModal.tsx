import { useState } from 'react';
import { CheckCircle2, MessageSquarePlus, Send, X } from 'lucide-react';
import { getApiBase } from '@/lib/cloudSync';

type FeedbackKind = 'suggestion' | 'track-request' | 'bug' | 'typo';

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>('track-request');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          message,
          contact,
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit feedback.');
      } else {
        setSent(true);
        setMessage('');
        setContact('');
      }
    } catch {
      setError('Could not reach DevPath API. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSent(false);
          setError(null);
        }}
        className="inline-flex items-center gap-1.5 text-sm text-white/75 transition hover:text-white"
      >
        <MessageSquarePlus className="h-4 w-4" />
        <span>Feedback</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-elevated)] p-6 text-[var(--text)] shadow-2xl sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="feedback-modal-title" className="text-lg font-extrabold text-[var(--text)]">
                  Feedback &amp; Track Requests
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  Report a typo/bug or vote on what course or challenge to build next.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close feedback modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-[var(--success-soft)] p-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--success)]" />
                <p className="mt-2 text-sm font-extrabold text-[var(--text)]">
                  Thank you! Your feedback has been received.
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  We read every submission to improve DevPath for all learners.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex min-h-10 items-center rounded-2xl bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-strong)]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ['track-request', 'Request a Track'],
                      ['bug', 'Report Bug'],
                      ['typo', 'Lesson Typo'],
                      ['suggestion', 'Suggestion'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setKind(id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        kind === id
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="fb-message" className="block text-xs font-bold text-[var(--text)]">
                    Details
                  </label>
                  <textarea
                    id="fb-message"
                    rows={4}
                    required
                    minLength={5}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Please add a Rust or Next.js track, or describe the bug you noticed..."
                    className="mt-1.5 w-full rounded-2xl bg-[var(--bg-muted)] p-3.5 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label htmlFor="fb-contact" className="block text-xs font-bold text-[var(--text)]">
                    Email or Handle (Optional)
                  </label>
                  <input
                    id="fb-contact"
                    type="text"
                    maxLength={120}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Optional, if you'd like a follow-up"
                    className="mt-1.5 min-h-11 w-full rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="min-h-11 rounded-2xl bg-[var(--bg-muted)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{busy ? 'Sending...' : 'Send Feedback'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
