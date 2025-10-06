import Link from 'next/link';
import Image from 'next/image';
import { supabaseServerReadonly } from '@/lib/supabase/server';
import { Button } from '@/components/layout/ui/Button';
import { ThemeToggle } from '@/components/layout/ui/ThemeToggle';
import { LanguageSelector } from '@/components/layout/ui/LanguageSelector';
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
          aria-label="Clawz Lab Home"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Image
            src="/clawz-lab-logo.png"
            alt="Clawz Lab"
            width={28}
            height={28}
            className="rounded-md shadow-sm"
            priority
          />
          <span className="font-semibold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
            Clawz<span className="font-light">Lab</span>
          </span>
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
                className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {profile?.full_name || 'Mi Perfil'}
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
              <LanguageSelector />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
