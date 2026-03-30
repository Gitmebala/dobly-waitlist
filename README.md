# Dobly Waitlist

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Dobly's pre-launch waitlist site built with Next.js 15 App Router, strict TypeScript, Tailwind CSS, Framer Motion, Supabase, Resend, and Zod.

## 1. Supabase Setup

Create a new Supabase project, open the SQL editor, and run this exact SQL:

```sql
CREATE TABLE waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  source text default 'direct',
  position integer,
  created_at timestamptz default now()
);
CREATE INDEX on waitlist(created_at);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert" ON waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_select" ON waitlist FOR SELECT TO authenticated USING (true);
```

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_TOTAL_SPOTS=100
```

Variable descriptions:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key for client-side insert access.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for server-side counting, admin views, and updates.
- `RESEND_API_KEY`: Resend API key for confirmation and admin broadcast emails.
- `ADMIN_PASSWORD`: Password used by `/admin/login`.
- `NEXT_PUBLIC_TOTAL_SPOTS`: Total founding member cap. Default is `100`.

## 3. Resend Setup

- Create a free [Resend](https://resend.com) account.
- Generate an API key.
- The app uses `Dobly <onboarding@resend.dev>` by default so it works quickly on the Resend free tier.
- For production, add and verify your own sending domain in Resend, then update the sender if needed.

## 4. Local Development

```bash
npm install
npm run dev
```

App URLs:

- Landing page: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## 5. Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example`.
4. Deploy.

`vercel.json` is already included:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## 6. What’s Included

- Waitlist landing page with animated hero, countdown, spot counter, custom cursor, particle fields, terminal demo, offer sections, use case tabs, comparison table, and final CTA.
- `POST /api/waitlist` for waitlist signup, duplicate/full checks, rate limiting, Supabase insert, and Resend confirmation email.
- `GET /api/spots` for live founding spot counts.
- `/admin/login` and `/admin` with cookie protection, metrics, charts, searchable table, CSV export, and broadcast email tool.

## 7. Production Notes

- Supabase service role access is server-side only.
- The countdown target is set to April 27, 2026 at `00:00` Nairobi time to match the current project date context and avoid an already-expired launch timer.
