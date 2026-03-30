'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { comparisonRows, terminalPrompts, useCaseCategories } from '@/app/_components/data';
import { Logo } from '@/app/_components/logo';
import { COUNTDOWN_TARGET, TOTAL_SPOTS } from '@/lib/constants';

type SpotsResponse = { count: number; spotsLeft: number; percentFull: number };
type WaitlistResponse = { success: true; position: number; spotsLeft: number } | { error: string; code?: string };

function cn(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function getCountdown() {
  const diff = new Date(COUNTDOWN_TARGET).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000)
  };
}

function createParticles(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 0.9 + 0.35,
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 4,
    color: Math.random() > 0.9 ? 'rgba(196,154,42,0.82)' : Math.random() > 0.78 ? 'rgba(20,168,151,0.62)' : 'rgba(236,234,255,0.92)',
    opacity: 0.45 + Math.random() * 0.5
  }));
}

function ParticleField({ count, className }: { count: number; className?: string }) {
  const particles = useMemo(() => createParticles(count), [count]);
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
}

function WaitlistForm({ id, source, cta }: { id: string; source: string; cta: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });
      const payload = (await response.json()) as WaitlistResponse;
      if ('success' in payload) {
        setStatus('success');
        setMessage(`Spot #${payload.position} reserved.`);
      } else {
        setStatus('error');
        setMessage(payload.error);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <div className="w-full">
      <form id={id} onSubmit={handleSubmit} className="grid gap-3">
        <input
          id={id === 'heroForm' ? 'heroEmail' : undefined}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-5 py-4 font-body text-[16px] text-[var(--text)] outline-none backdrop-blur-xl transition placeholder:text-[var(--muted)] focus:border-[var(--border-hi)]"
        />
        <button type="submit" disabled={status === 'loading'} className="primary-cta rounded-[16px] px-7 py-4 font-display text-sm font-bold text-[#F5F4FF]">
          {status === 'loading' ? 'Saving...' : cta}
        </button>
      </form>
      <p className="mt-3 font-mono text-[11px] text-[var(--dim)]">No credit card · $12/mo locked forever · Cancel anytime</p>
      {status !== 'idle' ? <p className="mt-4 font-body text-sm text-[var(--text)]">{message}</p> : null}
    </div>
  );
}

function CountdownBlock() {
  const [countdown, setCountdown] = useState(getCountdown());
  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  if (!countdown) return <p className="font-body text-base text-[var(--teal-hi)]">We&apos;re live. Sign up now.</p>;
  return (
    <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-[var(--muted)]">
      <span><strong className="font-display text-[var(--accent)]">{String(countdown.days).padStart(2, '0')}</strong> days</span>
      <span><strong className="font-display text-[var(--accent)]">{String(countdown.hours).padStart(2, '0')}</strong> hours</span>
      <span><strong className="font-display text-[var(--accent)]">{String(countdown.minutes).padStart(2, '0')}</strong> mins</span>
      <span><strong className="font-display text-[var(--accent)]">{String(countdown.seconds).padStart(2, '0')}</strong> secs</span>
    </div>
  );
}

function TerminalDemo() {
  const [index, setIndex] = useState(0);
  const prompt = terminalPrompts[index];
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % terminalPrompts.length), 10_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="noise-card rounded-[24px] border border-[var(--border)] bg-[rgba(19,18,40,0.88)] px-6 py-5">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <span className="font-mono text-xs text-[var(--muted)]">dobly / operator runtime</span>
        <span className="font-mono text-xs text-[var(--teal-hi)]">live</span>
      </div>
      <p className="mt-5 font-mono text-xs text-[var(--accent-2)]">recurring_problem</p>
      <p className="mt-4 min-h-[96px] font-mono text-sm leading-7 text-[var(--text)]">{prompt}</p>
      <div className="mt-6 space-y-3">
        {['Intent stabilized', 'Connectors resolved', 'Runtime scheduled'].map((item) => (
          <div key={item} className="rounded-[10px] border border-[rgba(79,70,229,0.22)] bg-[rgba(79,70,229,0.12)] px-4 py-3 font-mono text-[13px] text-[var(--text)]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WaitlistPage() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [source, setSource] = useState('direct');
  const [spots, setSpots] = useState<SpotsResponse>({ count: 0, spotsLeft: TOTAL_SPOTS, percentFull: 0 });
  const [activeTab, setActiveTab] = useState(useCaseCategories[0].id);
  const [typedTen, setTypedTen] = useState(0);
  const finalCounterRef = useRef<HTMLDivElement>(null);
  const finalCounterInView = useInView(finalCounterRef, { once: true, amount: 0.4 });
  const activeUseCases = useCaseCategories.find((category) => category.id === activeTab) ?? useCaseCategories[0];

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref') || 'direct';
    window.sessionStorage.setItem('dobly_source', ref);
    setSource(ref);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    async function loadSpots() {
      const response = await fetch('/api/spots');
      const payload = (await response.json()) as SpotsResponse;
      setSpots(payload);
    }
    void loadSpots();
    const interval = window.setInterval(loadSpots, 10_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!finalCounterInView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setTypedTen(Math.round(10 * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finalCounterInView]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTab((current) => {
        const index = useCaseCategories.findIndex((category) => category.id === current);
        const nextIndex = index >= 0 ? (index + 1) % useCaseCategories.length : 0;
        return useCaseCategories[nextIndex].id;
      });
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  function useCaseClick(solution: string) {
    const input = document.getElementById('heroEmail') as HTMLInputElement | null;
    if (!input) return;
    input.placeholder = solution.replace(/^(?:→|->)\s*/, '');
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <ParticleField count={500} className="fixed inset-0 z-0 opacity-95" />
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} className={cn('fixed left-0 top-0 z-[100] w-full border-b transition duration-300', scrolled ? 'border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,16,0.72)] backdrop-blur-[20px]' : 'border-transparent bg-transparent')}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3"><Logo className="h-9 w-9" animated /><span className="font-display text-[20px] font-extrabold lowercase tracking-[-0.04em]">dobly</span></Link>
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(79,70,229,0.22)] bg-[rgba(79,70,229,0.12)] px-4 py-[6px] md:flex"><span className="live-dot h-2 w-2 rounded-full bg-[var(--teal-hi)]" /><span className="font-mono text-[11px] text-[var(--text)]">{spots.spotsLeft} founding spots left</span></div>
        </div>
      </motion.nav>

      <section className="relative min-h-screen px-6 pb-20 pt-[132px] md:px-10">
        <ParticleField count={220} />
        <div className="relative mx-auto grid max-w-[1240px] gap-14 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-2 font-mono text-xs text-[var(--muted)] backdrop-blur-xl"><span className="h-2 w-2 rounded-full bg-[var(--teal-hi)]" />what needs to happen, happens.</div>
            <div className="mt-10">
              <div className="relative inline-flex items-center justify-center">
                <span className="absolute h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.22),rgba(79,70,229,0.08)_38%,transparent_72%)] blur-[28px]" />
                <span className="absolute h-[110px] w-[110px] rounded-full bg-[radial-gradient(circle,rgba(196,154,42,0.12),transparent_68%)] blur-[14px]" />
                <Logo className="relative h-[72px] w-[72px]" animated />
              </div>
            </div>
            <h1 className="mt-10 font-display text-[clamp(54px,10vw,118px)] font-extrabold leading-[0.92] tracking-[-0.05em]"><span className="block">Your business,</span><span className="block">running.</span></h1>
            <p className="mt-6 max-w-[620px] font-body text-[clamp(17px,2.4vw,22px)] font-light leading-[1.8] text-[var(--muted)]">Describe what needs doing. Connect your tools. Dobly handles the rest.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><button type="button" onClick={() => document.getElementById('heroForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="primary-cta rounded-[14px] px-7 py-4 font-display text-sm font-bold text-[#F5F4FF]">Reserve founding access →</button><div className="font-body text-base text-[var(--muted)]"><span className="block font-display text-[var(--text)]">handled.</span><span>so you don&apos;t have to.</span></div></div>
            <div className="mt-10"><CountdownBlock /></div>
            <div className="mt-10 grid max-w-[620px] grid-cols-1 gap-5 border-t border-[var(--border)] pt-6 md:grid-cols-3">
              {[['10s', 'to design the workflow'], ['live', 'activity where it matters'], ['0', 'extra manual upkeep']].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-extrabold text-[var(--accent)]">{value}</p>
                  <p className="mt-1 font-body text-xs text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="noise-card rounded-[26px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(26,25,51,0.76),rgba(13,12,28,0.5))] px-6 py-6 backdrop-blur-[20px]">
            <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">Founding access</p>
              <p className="mt-3 font-display text-[34px] font-extrabold text-[var(--text)]">Reserve your spot before launch.</p>
              <p className="mt-3 font-body text-sm leading-7 text-[var(--muted)]">Lock in $12/month before launch pricing shifts to $19.</p>
              <div className="mt-6 font-mono text-xs text-[var(--muted)]"><span className="font-bold text-[var(--accent)]">{spots.spotsLeft}</span> of {TOTAL_SPOTS} founding spots remaining</div>
              <div className="mt-3 h-[4px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(spots.count / TOTAL_SPOTS) * 100}%`, backgroundColor: spots.spotsLeft < 20 ? '#C49A2A' : '#4F46E5' }} transition={{ duration: 1.2 }} className="h-full rounded-full" />
              </div>
              <div className="mt-6"><WaitlistForm id="heroForm" source={source} cta="Claim my spot →" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1240px]">
          <TerminalDemo />
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1240px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[var(--muted)]">Every one of these can be handled</p>
          <h2 className="mt-5 font-display text-[clamp(34px,5vw,60px)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            <span className="block">The work you keep carrying around.</span>
            <span className="mt-2 block text-[var(--accent)]">Dobly makes it stop living in your head.</span>
          </h2>
          <div className="mt-10 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="flex gap-3 overflow-x-auto xl:flex-col">
              {useCaseCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={cn(
                    'rounded-full border px-4 py-3 text-left transition xl:rounded-[16px]',
                    activeTab === category.id
                      ? 'border-[rgba(79,70,229,0.28)] bg-[rgba(79,70,229,0.12)] text-[var(--text)]'
                      : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[var(--border-hi)] hover:text-[var(--text)]'
                  )}
                >
                  <span className="font-body text-sm">{category.emoji} {category.label}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeUseCases.items.map((item) => (
                <div key={item.problem} onClick={() => useCaseClick(item.solution)} className="group glass-clay-card float-card rounded-[18px] border border-[var(--border)] px-5 py-5">
                  <p className="font-body text-sm leading-6 text-[var(--text)]">{item.problem}</p>
                  <p className="mt-3 font-mono text-xs text-[var(--teal-hi)]">{item.solution}</p>
                  <span className="mt-5 inline-block font-body text-sm text-[var(--accent-2)] opacity-0 transition group-hover:opacity-100">Try this →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="font-display text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-0.04em]">Why not just use Zapier?</h2>
          <p className="mt-4 max-w-[720px] font-body text-lg leading-8 text-[var(--muted)]">Because most people do not need another builder. They need the work to be handled without living inside another tool.</p>
          <div className="mt-10 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)]">
            <div className="grid grid-cols-4 gap-4 border-b border-[var(--border)] px-5 py-4 font-mono text-[13px] text-[var(--muted)]">
              <span>Feature</span><span>Zapier</span><span>Make</span><span>Dobly</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row[0]} className="grid grid-cols-4 gap-4 border-b border-[var(--border)] px-5 py-4 font-mono text-[13px] last:border-b-0">
                <span className="text-[var(--text)]">{row[0]}</span>
                <span className="text-[var(--muted)]">{row[1]}</span>
                <span className="text-[var(--muted)]">{row[2]}</span>
                <span className="text-[var(--accent)]">{row[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 md:px-10">
        <ParticleField count={320} className="opacity-85" />
        <div className="relative mx-auto max-w-[1240px] text-center">
          <div ref={finalCounterRef}>
            <p className="font-body text-lg text-[var(--muted)]">Your first workflow is handled in</p>
            <div className="mt-4 font-display text-[clamp(80px,12vw,144px)] font-extrabold text-[var(--accent)]">
              {typedTen}{finalCounterInView ? <span className="type-tail"> seconds.</span> : null}
            </div>
          </div>
          <p className="mt-4 font-body text-lg font-light text-[var(--muted)]">handled. so you don&apos;t have to.</p>
          <div className="mx-auto mt-8 max-w-[640px]">
            <WaitlistForm id="finalForm" source={source} cta="Join the waitlist →" />
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3"><Logo className="h-[28px] w-[28px]" /><span className="font-display text-base font-bold lowercase">dobly</span></div>
            <p className="mt-4 font-body text-[13px] text-[var(--muted)]">Built in Mombasa, Kenya</p>
            <p className="mt-2 font-mono text-[11px] text-[var(--dim)]">what needs to happen, happens.</p>
          </div>
          <div className="flex flex-col gap-3 font-body text-[13px] text-[var(--muted)]">
            <a href="#heroForm" className="hover:text-[var(--text)]">Join</a>
            <a href="#finalForm" className="hover:text-[var(--text)]">Start</a>
            <Link href="/admin/login" className="hover:text-[var(--text)]">Sign in</Link>
          </div>
          <div className="md:text-right"><p className="font-mono text-xs text-[var(--dim)]">dobly.io</p></div>
        </div>
      </footer>
    </main>
  );
}
