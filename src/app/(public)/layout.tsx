import '../globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-6 text-sm">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          Clawz<span className="font-light">Lab</span>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          <NavLink href="/shop" label="Shop" />
          <NavLink href="/custom" label="Custom" />
          <NavLink href="/measure" label="Medir" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-xs font-medium rounded-full bg-black text-white px-4 py-1.5 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <Link
      href={href}
      className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 py-10 text-center text-xs text-neutral-500 dark:text-neutral-400">
      <p>© {new Date().getFullYear()} Clawz Lab · Todos los derechos reservados.</p>
    </footer>
  );
}
// (Eliminada segunda exportación duplicada de PublicLayout)
