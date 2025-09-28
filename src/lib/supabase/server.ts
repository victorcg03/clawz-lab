import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/** Writable: server actions y route handlers (puede escribir cookies). */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet)
            cookieStore.set(name, value, options);
        },
      },
    },
  );
}

/** Read-only: Server Components (layouts/pages). */
export async function supabaseServerReadonly() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          /* noop en RSC */
        },
      },
    },
  );
}
