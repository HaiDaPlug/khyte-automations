import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase-klient med service role.
 *
 * "server-only" högst upp gör att bygget havererar om den här filen någonsin
 * importeras från klientkod. Nyckeln får aldrig lämna servern.
 */

let klient: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (klient) return klient;

  const url = process.env.SUPABASE_URL;
  const nyckel = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !nyckel) {
    throw new Error(
      "SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY måste vara satta. Se .env.example.",
    );
  }

  klient = createClient(url, nyckel, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return klient;
}
