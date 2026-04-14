import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

/**
 * Server-side Supabase client for public data operations.
 * No auth/cookie handling needed since all tables use public RLS policies.
 */
export function getSupabase() {
  return createSupabaseClient(supabaseUrl, supabaseKey)
}
