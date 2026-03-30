import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/constants';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 });
  }

  const header = ['position', 'email', 'name', 'source', 'created_at'];
  const lines = (data ?? []).map((row) =>
    [row.position, row.email, row.name, row.source, row.created_at]
      .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );

  return new NextResponse([header.join(','), ...lines].join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="dobly-waitlist.csv"'
    }
  });
}
