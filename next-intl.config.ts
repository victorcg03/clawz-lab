import { createNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';

/**
 * @fileoverview Internationalization configuration for Clawz Lab
 * Supports Spanish (default) and English locales
 * @author Clawz Lab Team
 * @version 1.0.0
 */

export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es' as const;

export type Locale = (typeof locales)[number];

/**
 * Navigation helpers with locale support
 */
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});

/**
 * Request configuration for server-side i18n
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming locale parameter is valid
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  };
});
