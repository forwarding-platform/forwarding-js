import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  "https://kirkgtkhcjuemrllhngq.supabase.co",
  process.env.SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
