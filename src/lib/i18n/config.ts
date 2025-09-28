export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const namespaces = ['common', 'shop', 'custom'] as const;
