import Link from 'next/link';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';
import { ThemeToggle } from '@/components/layout/ui/ThemeToggle';
import { CartIcon } from '@/components/cart/CartIcon';
import { logoutAction } from '@/app/(public)/auth/actions';

function NavLink({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <Link
      href={href}
      className="relative text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-all duration-300 font-medium group"
    >
      {label}
      {/* Línea de hover con efecto metalico */}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-400 dark:to-neutral-200 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
      >
        Salir
      </button>
    </form>
  );
}

export async function SiteHeader() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <header className="backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 bg-white/85 dark:bg-neutral-900/80 border-b border-neutral-200/60 dark:border-neutral-800/60 sticky top-0 z-40 transition-all duration-300">
      {/* Divisor metálico inferior */}
      <div className="divider-metal absolute bottom-0 left-0 right-0" />

      <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-6 text-sm relative">
        <Link
          href="/"
          className="font-semibold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 hover:scale-105 transition-transform duration-200"
        >
          Clawz<span className="font-light">Lab</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          <NavLink href="/shop" label="Shop" />
          <NavLink href="/custom" label="Custom" />
          <NavLink href="/measure" label="Medir" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />

          {user && <CartIcon />}

          {user ? (
            // Usuario logueado
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
              >
                Hola, {profile?.full_name || 'Usuario'}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            // Usuario no logueado
            <>
              <Link
                href="/login"
                className="text-xs font-medium underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
              >
                Login
              </Link>
              <Link href="/register" className="inline-flex">
                <Button size="sm" className="rounded-full h-8 px-4 text-xs">
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
