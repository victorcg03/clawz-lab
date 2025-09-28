import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase browser client (no cookie write hooks needed).
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
