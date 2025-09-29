import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Middleware actualizado: usa NextRequest, replica cookies establecidas por Supabase
// y aplica una protección mínima para rutas privadas y /admin.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => {
        // Propagar cookies que Supabase quiera establecer (refresh / access tokens)
        cookies.forEach((c) => {
          res.cookies.set(c.name, c.value, c.options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const protectedExact = ['/account', '/checkout'];
  const isProtected = protectedExact.includes(pathname);
  const isAdmin = pathname.startsWith('/admin');

  if (!user && (isProtected || isAdmin)) {
    const login = new URL('/login', req.url);
    login.searchParams.set('redirect', pathname);
    return NextResponse.redirect(login);
  }

  // Validar perfil admin para rutas /admin
  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      // Redirigir a dashboard normal si no es admin
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

// Nota: los nombres de grupos de rutas (p.ej. (private)) no forman parte de la URL final,
// por eso el matcher apunta a las rutas reales expuestas.
export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
};
