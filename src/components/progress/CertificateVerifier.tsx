import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Search, ShieldAlert } from 'lucide-react';
import { fetchVerifiedCertificate, type VerifiedCertificate } from '@/lib/cloudSync';

export default function CertificateVerifier() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedCertificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  const runLookup = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    const cert = await fetchVerifiedCertificate(trimmed);
    if (cert) {
      setResult(cert);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('id');
    if (initial) {
      setCertId(initial);
      void runLookup(initial);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && certId.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', certId.trim());
      window.history.replaceState({}, '', url.toString());
    }
    void runLookup(certId);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter Certificate ID (e.g. DP-JAVA-8K2P9Q)"
          className="min-h-12 flex-1 rounded-2xl bg-[var(--bg-elevated)] px-5 py-3 font-mono text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          <span>{loading ? 'Verifying...' : 'Verify Certificate'}</span>
        </button>
      </form>

      {result && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--success-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--success)]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Authentic DevPath Certificate</span>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                Awarded To
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--text)]">
                {result.learnerName}
              </h2>
              <p className="mt-2 text-base font-semibold text-[var(--accent)]">
                {result.courseTitle}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-[var(--bg-subtle)] p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                Exam Score
              </p>
              <p className="mt-1 text-lg font-extrabold text-[var(--text)]">{result.score}%</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                Issued Date
              </p>
              <p className="mt-1 text-lg font-extrabold text-[var(--text)]">{result.issuedAt}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                Certificate ID
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-[var(--text)]">{result.certId}</p>
            </div>
          </div>
        </div>
      )}

      {notFound && (
        <div className="flex items-start gap-3 rounded-3xl bg-rose-500/10 p-6 text-rose-700 dark:text-rose-300">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Certificate Not Found</p>
            <p className="mt-1 text-xs opacity-90">
              No DevPath certificate matches ID <code>{certId}</code>. Double-check the code printed on the certificate and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
