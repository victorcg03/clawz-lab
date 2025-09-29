import type { Metadata } from 'next';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import esCommon from '../locales/es/common.json';
import enCommon from '../locales/en/common.json';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BackgroundEffects } from '@/components/effects/VisualEffects';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: {
    default: 'Clawz Lab — Custom & Ready Nail Designs',
    template: '%s | Clawz Lab',
  },
  description:
    'E-commerce de diseños de uñas personalizados y catálogo de modelos prediseñados.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = 'es'; // single-locale estable por ahora
  const messages = locale === 'es' ? esCommon : enCommon;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme && theme !== 'system') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors relative overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Patrón de fondo sutil */}
          <div className="fixed inset-0 pattern-dots opacity-40 pointer-events-none" />

          {/* Gradientes tribales de fondo */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-neutral-200/20 via-transparent to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-radial from-neutral-300/15 via-transparent to-transparent blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-radial from-neutral-200/10 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <BackgroundEffects />
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className=" backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 bg-white/85 dark:bg-neutral-900/80 border-b border-neutral-200/60 dark:border-neutral-800/60 sticky top-0 z-40 transition-all duration-300">
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
        </div>
      </nav>
    </header>
  );
}

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

function SiteFooter() {
  return (
    <footer className="mt-20 relative">
      {/* Divisor metálico superior */}
      <div className="divider-metal mb-10" />

      <div className="py-10 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p className="relative inline-block">
          © {new Date().getFullYear()} Clawz Lab · Todos los derechos reservados.
          {/* Pequeño acento tribal */}
          <span className="absolute -top-2 -right-3 w-1 h-1 bg-current rounded-full opacity-40" />
        </p>
      </div>
    </footer>
  );
}
