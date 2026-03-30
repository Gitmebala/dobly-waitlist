import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { ADMIN_COOKIE } from '@/lib/constants';
import { getSupabaseServiceClient } from '@/lib/supabase';

const schema = z.object({
  message: z.string().min(1).max(10000)
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(ADMIN_COOKIE)?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing Resend configuration.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase.from('waitlist').select('email');
    if (error) throw error;

    const emails = (data ?? []).map((item) => item.email);
    await resend.emails.send({
      from: 'Dobly <onboarding@resend.dev>',
      to: 'onboarding@resend.dev',
      bcc: emails,
      subject: 'Message from Dobly',
      html: `<div style="background:#040706;padding:32px;color:#E2F0EA;font-family:DM Sans,Arial,sans-serif;white-space:pre-wrap">${parsed.data.message}</div>`
    });

    return NextResponse.json({ success: true, sent: emails.length });
  } catch {
    return NextResponse.json({ error: 'Unable to send broadcast.' }, { status: 500 });
  }
}
