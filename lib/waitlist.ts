import { TOTAL_SPOTS } from '@/lib/constants';
import { getSupabaseServiceClient } from '@/lib/supabase';

export type WaitlistRow = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  position: number | null;
  created_at: string;
};

export async function getWaitlistCount() {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getSpotsSnapshot() {
  const count = await getWaitlistCount();
  return {
    count,
    spotsLeft: Math.max(TOTAL_SPOTS - count, 0),
    percentFull: Math.min(count, TOTAL_SPOTS)
  };
}
