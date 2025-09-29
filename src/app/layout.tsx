import type { Metadata } from 'next';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import esCommon from '../locales/es/common.json';
import enCommon from '../locales/en/common.json';
import { BackgroundEffects } from '@/components/effects/VisualEffects';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

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
