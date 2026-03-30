import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from '@/lib/constants';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') || '');

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE
  });

  return NextResponse.redirect(new URL('/admin', request.url));
}
