import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
