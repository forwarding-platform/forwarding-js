import { SupabaseClient } from "@supabase/supabase-js";

export const supabase = new SupabaseClient(
  "https://kirkgtkhcjuemrllhngq.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
