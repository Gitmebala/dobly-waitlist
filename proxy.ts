import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/constants';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
