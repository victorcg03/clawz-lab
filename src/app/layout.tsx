import type { Metadata } from 'next';
import '../../next-intl.config';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import esCommon from '../../locales/es/common.json';

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
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider locale="es" messages={esCommon}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
