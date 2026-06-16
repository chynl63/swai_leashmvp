import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase 클라이언트. anon key가 설정돼 있을 때만 생성.
 * 없으면 null → 감시자 승인은 BroadcastChannel 폴백으로 동작 (lib/approval.ts).
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const hasSupabase = supabase != null;
