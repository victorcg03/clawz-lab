import { getRequestConfig } from 'next-intl/server';

// Configuración mínima para el plugin de next-intl.
// De momento trabajamos single-locale ('es'); cuando activemos detección dinámica
// podremos leer el locale desde headers/cookies y hacer fallback apropiado.
export default getRequestConfig(async () => {
  const locale = 'es';
  const messages = (await import(`../locales/${locale}/common.json`)).default;
  return { locale, messages };
});
