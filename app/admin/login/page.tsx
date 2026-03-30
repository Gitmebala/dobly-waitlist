export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <form action="/api/admin/login" method="post" className="w-full max-w-[420px] rounded-[24px] border border-[var(--border)] bg-[var(--bg-1)] px-6 py-8">
        <p className="font-display text-3xl font-extrabold text-[var(--text)]">Admin login</p>
        <p className="mt-3 font-body text-sm text-[var(--muted)]">Enter the admin password to open the waitlist dashboard.</p>
        <input type="password" name="password" placeholder="Password" className="mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4 font-body text-sm text-[var(--text)] outline-none" />
        <button type="submit" className="mt-5 w-full rounded-xl bg-[var(--accent)] px-5 py-4 font-display text-sm font-bold text-[var(--bg)]">Enter dashboard</button>
      </form>
    </main>
  );
}
