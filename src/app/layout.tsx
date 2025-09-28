import type { Metadata } from 'next';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import esCommon from '../locales/es/common.json';
import enCommon from '../locales/en/common.json';

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
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
