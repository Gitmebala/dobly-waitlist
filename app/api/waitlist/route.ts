import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { TOTAL_SPOTS } from '@/lib/constants';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp, sanitizeEmail, sanitizeText } from '@/lib/sanitize';
import { getSupabaseServiceClient } from '@/lib/supabase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const schema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional()
});

function emailHtml(position: number) {
  return `
  <div style="background:#040706;padding:40px 24px;color:#E2F0EA;font-family:'DM Sans',Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;border:1px solid rgba(0,223,160,0.12);border-radius:20px;background:#080F0C;padding:32px">
      <p style="font-family:'DM Mono',monospace;color:#00DFA0;font-size:12px;letter-spacing:0.24em;text-transform:uppercase">Dobly founding member</p>
      <h1 style="font-family:'Syne',Arial,sans-serif;font-size:34px;line-height:1.02;margin:16px 0 0">Your founding spot #${position} is reserved.</h1>
      <p style="margin:18px 0 0;color:#4E7A65;line-height:1.7">$12/month is locked forever for you. Dobly launches on April 1st.</p>
      <div style="margin-top:24px;padding:18px;border-radius:16px;background:rgba(0,223,160,0.06);border:1px solid rgba(0,223,160,0.2)">
        <p style="margin:0 0 8px;font-weight:700">What happens next</p>
        <p style="margin:0;color:#4E7A65;line-height:1.7">We’ll email you before launch with onboarding details, your founding pricing, and first access instructions.</p>
      </div>
      <p style="margin-top:24px;color:#4E7A65;line-height:1.7">Michael Bala<br/>Founder, Dobly · Built in Mombasa 🇰🇪</p>
    </div>
  </div>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email.', code: 'INVALID' }, { status: 400 });
    }

    const email = sanitizeEmail(parsed.data.email);
    const name = parsed.data.name ? sanitizeText(parsed.data.name, 100) : null;
    const source = parsed.data.source ? sanitizeText(parsed.data.source, 50) : 'direct';
    const ip = getClientIp(request.headers.get('x-forwarded-for'), request.headers.get('x-real-ip'));
    const limit = consumeRateLimit('waitlist', ip, 3, 60 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many requests.', code: 'RATE_LIMIT' }, { status: 429 });
    }

    const supabase = getSupabaseServiceClient();
    const { data: existing } = await supabase.from('waitlist').select('id').eq('email', email).maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'This email is already on the list 🎉', code: 'DUPLICATE' }, { status: 409 });
    }

    const { count, error: countError } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    if (countError) throw countError;

    const currentCount = count ?? 0;
    if (currentCount >= TOTAL_SPOTS) {
      return NextResponse.json({ error: 'All founding spots claimed — join the regular waitlist', code: 'FULL' }, { status: 409 });
    }

    const position = currentCount + 1;
    const { error: insertError } = await supabase.from('waitlist').insert({ email, name, source, position });
    if (insertError) throw insertError;

    if (resend) {
      await resend.emails.send({
        from: 'Dobly <onboarding@resend.dev>',
        to: email,
        subject: `Your founding spot #${position} is reserved — $12/month locked forever`,
        html: emailHtml(position)
      });
    }

    return NextResponse.json({ success: true, position, spotsLeft: TOTAL_SPOTS - position });
  } catch {
    return NextResponse.json({ error: 'Unable to reserve your spot right now.' }, { status: 500 });
  }
}
