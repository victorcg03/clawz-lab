import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Server helper para usar en RSC (read-only) o en server actions / route handlers.
 * La API nueva de @supabase/ssr admite cookies.getAll()/setAll().
 * Aquí sólo leemos; para escritura real (signIn/out) se recomienda usar acciones/handlers.
 */
interface CookieStoreLike {
  getAll?: () => { name: string; value: string }[];
}
export function supabaseServer() {
  const cookieStore = cookies() as unknown as CookieStoreLike;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          typeof cookieStore.getAll === 'function' ? cookieStore.getAll() : [],
        setAll: () => {
          // No escribimos en RSC; en acciones del servidor utilizar un helper que propague las cookies.
        },
      },
    },
  );
}
