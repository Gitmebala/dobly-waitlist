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
  <div style="background:#080810;padding:40px 24px;color:#E6E4F8;font-family:'DM Sans',Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;background:linear-gradient(180deg,rgba(26,25,51,0.94),rgba(13,12,28,0.92));padding:32px">
      <p style="margin:0;font-family:'DM Mono',monospace;color:#6E6C90;font-size:12px;letter-spacing:0.24em;text-transform:uppercase">Dobly waitlist</p>
      <h1 style="margin:16px 0 0;font-family:'Syne',Arial,sans-serif;font-size:34px;line-height:1.02;color:#E6E4F8">You have successfully joined the Dobly waitlist.</h1>
      <p style="margin:18px 0 0;color:#A6A2C7;line-height:1.8;font-size:16px">Your founding member spot <strong style="color:#C49A2A">#${position}</strong> is now reserved. We are glad you got in early, because founding members will be the first people we bring into Dobly when access opens.</p>
      <div style="margin-top:24px;padding:18px;border-radius:18px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.24)">
        <p style="margin:0 0 8px;font-weight:700;color:#E6E4F8">What happens next</p>
        <p style="margin:0;color:#A6A2C7;line-height:1.8">Your <strong style="color:#E6E4F8">$12/month founding price</strong> is locked in. We will notify you before launch on April 27 with your access details, next steps, and everything you need to get started.</p>
      </div>
      <div style="margin-top:24px;padding:18px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
        <p style="margin:0;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#14A897">Founding members go first</p>
        <p style="margin:8px 0 0;color:#A6A2C7;line-height:1.7">You are part of the earliest group shaping what Dobly becomes from day one.</p>
      </div>
      <p style="margin-top:24px;color:#A6A2C7;line-height:1.7">Michael Bala<br/>Founder, Dobly · Built in Mombasa, Kenya</p>
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
      return NextResponse.json({ error: 'This email is already on the list.', code: 'DUPLICATE' }, { status: 409 });
    }

    const { count, error: countError } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    if (countError) throw countError;

    const currentCount = count ?? 0;
    if (currentCount >= TOTAL_SPOTS) {
      return NextResponse.json({ error: 'All founding spots claimed - join the regular waitlist.', code: 'FULL' }, { status: 409 });
    }

    const position = currentCount + 1;
    const { error: insertError } = await supabase.from('waitlist').insert({ email, name, source, position });
    if (insertError) throw insertError;

    if (resend) {
      await resend.emails.send({
        from: 'Dobly <onboarding@resend.dev>',
        to: email,
        subject: `You are officially on the Dobly waitlist - founding spot #${position}`,
        html: emailHtml(position)
      });
    }

    return NextResponse.json({ success: true, position, spotsLeft: TOTAL_SPOTS - position });
  } catch {
    return NextResponse.json({ error: 'Unable to reserve your spot right now.' }, { status: 500 });
  }
}
