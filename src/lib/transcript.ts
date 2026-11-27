export interface TranscriptCertificate {
  certId: string;
  courseTitle: string;
  score: number;
  issuedAt?: string;
}

export interface TranscriptTrackRow {
  title: string;
  completedLessons: number;
  totalLessons?: number;
}

export interface OfficialTranscriptPayload {
  learnerName: string;
  handle?: string;
  bio?: string;
  completedLessons: number;
  solvedChallenges: number;
  activeDays: number;
  certificates: TranscriptCertificate[];
  tracks: TranscriptTrackRow[];
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function printOfficialTranscript(data: OfficialTranscriptPayload): void {
  if (typeof window === 'undefined') return;
  const issuedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certRows =
    data.certificates.length === 0
      ? `<tr><td colspan="4" style="color:#64748b;text-align:center;padding:16px;">No certification exams passed yet.</td></tr>`
      : data.certificates
          .map(
            (c) => `<tr>
              <td style="font-weight:700;color:#0f172a;">${esc(c.courseTitle)}</td>
              <td>${c.score}%</td>
              <td style="font-family:monospace;font-size:12px;">${esc(c.certId)}</td>
              <td style="font-size:12px;color:#2563eb;">devpath.mycampus.ph/verify?id=${esc(c.certId)}</td>
            </tr>`
          )
          .join('');

  const trackRows =
    data.tracks.length === 0
      ? `<p style="color:#64748b;font-size:13px;">No lessons completed yet.</p>`
      : `<div class="tracks">${data.tracks
          .map(
            (t) =>
              `<div class="track-pill"><strong>${esc(t.title)}</strong> <span>${t.completedLessons}${
                t.totalLessons ? ` / ${t.totalLessons}` : ''
              } lessons</span></div>`
          )
          .join('')}</div>`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DevPath Official Transcript - ${esc(data.learnerName)}</title>
  <style>
    @page { margin: 14mm; size: A4 portrait; }
    * { box-sizing: border-box; }
    body { font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; margin: 0; padding: 24px; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 16px; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 18px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo { width: 44px; height: 44px; border-radius: 10px; background: #2563eb; color: #fff; font-weight: 900; font-size: 18px; display: flex; align-items: center; justify-content: center; }
    .eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #2563eb; text-transform: uppercase; }
    h1 { margin: 2px 0 0; font-size: 22px; }
    .meta { text-align: right; font-size: 12px; color: #475569; }
    .learner { margin-top: 22px; }
    .learner h2 { margin: 0; font-size: 24px; }
    .learner p { margin: 4px 0 0; font-size: 13px; color: #475569; }
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 20px; }
    .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; font-weight: 700; }
    .kpi-val { font-size: 22px; font-weight: 800; margin-top: 4px; }
    h3 { margin: 26px 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #334155; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 10px 10px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; }
    .tracks { display: flex; flex-wrap: wrap; gap: 8px; }
    .track-pill { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 10px; font-size: 12px; }
    .track-pill span { color: #64748b; margin-left: 4px; }
    .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
    .no-print { text-align: right; margin-bottom: 12px; }
    .no-print button { background: #2563eb; color: #fff; border: 0; border-radius: 8px; padding: 10px 18px; font-weight: 700; cursor: pointer; }
    @media print { body { padding: 0; } .sheet { border: 0; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div class="brand">
        <div class="logo">DP</div>
        <div>
          <div class="eyebrow">DevPath Official Transcript</div>
          <h1>Software Engineering Record</h1>
        </div>
      </div>
      <div class="meta">
        <div><strong>Generated:</strong> ${esc(issuedOn)}</div>
        <div>devpath.mycampus.ph</div>
        ${data.handle ? `<div>Profile: /profile?u=${esc(data.handle)}</div>` : ''}
      </div>
    </div>

    <div class="learner">
      <h2>${esc(data.learnerName)}</h2>
      ${data.handle ? `<p>@${esc(data.handle)}${data.bio ? ` · ${esc(data.bio)}` : ''}</p>` : ''}
    </div>

    <div class="kpis">
      <div class="kpi"><div class="kpi-label">Certificates</div><div class="kpi-val">${data.certificates.length}</div></div>
      <div class="kpi"><div class="kpi-label">Lessons Done</div><div class="kpi-val">${data.completedLessons}</div></div>
      <div class="kpi"><div class="kpi-label">Challenges</div><div class="kpi-val">${data.solvedChallenges}</div></div>
      <div class="kpi"><div class="kpi-label">Active Days</div><div class="kpi-val">${data.activeDays}</div></div>
    </div>

    <h3>Verified Certification Exams</h3>
    <table>
      <thead>
        <tr><th>Course Track</th><th>Score</th><th>Certificate ID</th><th>Public Verification</th></tr>
      </thead>
      <tbody>${certRows}</tbody>
    </table>

    <h3>Course Progress Summary</h3>
    ${trackRows}

    <div class="footer">
      <span>DevPath Open Software Engineering Curriculum</span>
      <span>Verify any Certificate ID at https://devpath.mycampus.ph/verify</span>
    </div>
  </div>
  <script>window.addEventListener('load', () => { setTimeout(() => window.print(), 250); });</script>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=920,height=780');
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
  } else {
    // Fallback if popup blocked: download standalone printable HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devpath-official-transcript.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
