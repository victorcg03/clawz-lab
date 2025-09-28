import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Configuración base Next.js
const config: NextConfig = {
  turbopack: {
    // Forzamos root para evitar inferencia hacia carpeta padre con lockfile diferente
    root: __dirname,
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(config);
