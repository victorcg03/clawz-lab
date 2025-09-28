import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(() => {
  return {
    locale: 'es',
    messages: {
      // Mensajes mínimos para satisfacer next-intl (cargamos real en provider manual)
      'app.title': 'Clawz Lab',
    },
  };
});
