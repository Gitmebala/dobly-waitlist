import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing public Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseServiceClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing server Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
