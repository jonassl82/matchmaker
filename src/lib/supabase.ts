import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service-role key, which bypasses RLS.
// Never import this into a client component, and never expose the key.
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});
