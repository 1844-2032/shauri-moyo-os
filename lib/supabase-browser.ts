import { createBrowserClient } from "@supabase/ssr";

// CLIENT-SIDE ONLY. Safe to import from "use client" components — uses
// the public anon key, never the service role key. Used solely for the
// staff sign-in form; all data reads/writes still go through our API
// routes with the service role client in lib/supabase.ts.

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
