import { NextIntlClientProvider } from 'next-intl';
import esCommon from '../../../locales/es/common.json';

interface Props {
  readonly children: React.ReactNode;
}
export default function PrivateLayout({ children }: Props) {
  return (
    <NextIntlClientProvider locale="es" messages={esCommon}>
      {children}
    </NextIntlClientProvider>
  );
}
