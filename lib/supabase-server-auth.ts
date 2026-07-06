import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// SERVER-SIDE ONLY. Reads/writes the Supabase Auth session via cookies
// (App Router server components, route handlers, middleware). Uses the
// anon key — this client is for AUTHENTICATION ONLY. It never touches
// church data tables directly; once we know who the signed-in user is,
// data reads go through supabaseAdmin in lib/supabase.ts.

export async function createSupabaseServerAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies —
            // middleware already refreshes the session, so this is safe
            // to ignore.
          }
        },
      },
    }
  );
}
