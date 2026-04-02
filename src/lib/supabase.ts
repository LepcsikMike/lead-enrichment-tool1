import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL und SUPABASE_SERVICE_KEY müssen konfiguriert sein");
    }

    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}
