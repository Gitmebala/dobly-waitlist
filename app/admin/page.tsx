import { AdminDashboard } from '@/app/_components/admin-dashboard';
import { TOTAL_SPOTS } from '@/lib/constants';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to load waitlist data.');
  }

  const rows = data ?? [];
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const todayCount = rows.filter((row) => +new Date(row.created_at) >= +todayStart).length;
  const weekCount = rows.filter((row) => +new Date(row.created_at) >= +weekStart).length;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AdminDashboard rows={rows} total={rows.length} spotsRemaining={Math.max(TOTAL_SPOTS - rows.length, 0)} todayCount={todayCount} weekCount={weekCount} />
    </main>
  );
}
