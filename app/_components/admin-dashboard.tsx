'use client';

import { useMemo, useState, useTransition } from 'react';

type WaitlistRow = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  position: number | null;
  created_at: string;
};

type AdminDashboardProps = {
  rows: WaitlistRow[];
  total: number;
  spotsRemaining: number;
  todayCount: number;
  weekCount: number;
};

function SimpleAreaChart({ values }: { values: number[] }) {
  const width = 720;
  const height = 220;
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - (value / max) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(' ');
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
      <defs>
        <linearGradient id="adminChartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,223,160,0.4)" />
          <stop offset="100%" stopColor="rgba(0,223,160,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#adminChartFill)" />
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function SimplePieChart({ values }: { values: Array<{ label: string; value: number }> }) {
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
  let current = 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#00DFA0', '#00FFB3', '#1d7e5d', '#4E7A65', '#7ce4c4'];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <svg viewBox="0 0 220 220" className="h-[220px] w-[220px] shrink-0">
        <g transform="translate(110 110) rotate(-90)">
          {values.map((item, index) => {
            const segment = (item.value / total) * circumference;
            const dasharray = `${segment} ${circumference - segment}`;
            const dashoffset = -current;
            current += segment;
            return <circle key={item.label} r={radius} cx="0" cy="0" fill="transparent" stroke={colors[index % colors.length]} strokeWidth="28" strokeDasharray={dasharray} strokeDashoffset={dashoffset} />;
          })}
        </g>
      </svg>
      <div className="space-y-3 font-mono text-xs">
        {values.map((item, index) => (
          <div key={item.label} className="flex items-center gap-3 text-[var(--muted)]">
            <span className="h-3 w-3 rounded-full" style={{ background: colors[index % colors.length] }} />
            <span>{item.label}</span>
            <span className="text-[var(--text)]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard({ rows, total, spotsRemaining, todayCount, weekCount }: AdminDashboardProps) {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [pending, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredRows = useMemo(() => rows.filter((row) => row.email.toLowerCase().includes(query.toLowerCase())), [query, rows]);
  const totalPages = Math.max(Math.ceil(filteredRows.length / pageSize), 1);
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const cumulativeSeries = useMemo(() => {
    const sorted = [...rows].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    let running = 0;
    return sorted.map(() => ++running);
  }, [rows]);

  const sourceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row) => map.set(row.source || 'direct', (map.get(row.source || 'direct') || 0) + 1));
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [rows]);

  function sendBroadcast() {
    startTransition(async () => {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const payload = (await response.json()) as { success?: boolean; error?: string; sent?: number };
      setStatus(payload.success ? `Sent to ${payload.sent} people.` : payload.error || 'Request failed.');
    });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-10">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total signups', total],
          ['Spots remaining', spotsRemaining],
          ['Signups today', todayCount],
          ['Signups this week', weekCount]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-1)] px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">{label}</p>
            <p className="mt-3 font-display text-4xl font-extrabold text-[var(--accent)]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-1)] px-6 py-6">
          <p className="font-display text-xl font-bold">Cumulative signups</p>
          <div className="mt-5">{cumulativeSeries.length ? <SimpleAreaChart values={cumulativeSeries} /> : <p className="font-body text-sm text-[var(--muted)]">No signups yet.</p>}</div>
        </div>
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-1)] px-6 py-6">
          <p className="font-display text-xl font-bold">Sources</p>
          <div className="mt-5">{sourceBreakdown.length ? <SimplePieChart values={sourceBreakdown} /> : <p className="font-body text-sm text-[var(--muted)]">No source data yet.</p>}</div>
        </div>
      </div>
      <div className="mt-8 rounded-[20px] border border-[var(--border)] bg-[var(--bg-1)] px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-xl font-bold">Waitlist</p>
          <div className="flex flex-wrap gap-3">
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by email" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 font-body text-sm text-[var(--text)] outline-none" />
            <a href="/api/admin/export" className="rounded-xl border border-[var(--border)] px-4 py-3 font-mono text-xs text-[var(--text)]">Export CSV</a>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                <th className="py-3">Position</th>
                <th className="py-3">Email</th>
                <th className="py-3">Name</th>
                <th className="py-3">Source</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] align-top">
                  <td className="py-4 pr-4 font-mono text-xs text-[var(--accent)]">{row.position ?? '—'}</td>
                  <td className="py-4 pr-4 font-body text-sm">{row.email}</td>
                  <td className="py-4 pr-4 font-body text-sm text-[var(--muted)]">{row.name || '—'}</td>
                  <td className="py-4 pr-4 font-mono text-xs text-[var(--muted)]">{row.source || 'direct'}</td>
                  <td className="py-4 pr-4 font-mono text-xs text-[var(--muted)]">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--muted)]">Page {page} of {totalPages}</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text)]">Prev</button>
            <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text)]">Next</button>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[20px] border border-[var(--border)] bg-[var(--bg-1)] px-6 py-6">
        <p className="font-display text-xl font-bold">Send email to all</p>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-5 min-h-[160px] w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4 font-body text-sm text-[var(--text)] outline-none" placeholder="Write your email message..." />
        <div className="mt-4 flex items-center justify-between gap-4">
          <button type="button" onClick={sendBroadcast} disabled={pending || !message.trim()} className="rounded-xl bg-[var(--accent)] px-5 py-3 font-display text-sm font-bold text-[var(--bg)] disabled:opacity-60">Send to all</button>
          <p className="font-body text-sm text-[var(--muted)]">{status}</p>
        </div>
      </div>
    </div>
  );
}
