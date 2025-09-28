import { NextRequest } from 'next/server';
import { defaultLocale, locales, type Locale } from './config';

export function detectLocale(req: NextRequest): Locale {
  const pathname = req.nextUrl.pathname;
  const segment = pathname.split('/')[1];
  if (locales.includes(segment as Locale)) return segment as Locale;
  return defaultLocale;
}
