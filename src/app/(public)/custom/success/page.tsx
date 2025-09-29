import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono de éxito */}
        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Título y mensaje */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            ¡Solicitud enviada con éxito!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Hemos recibido tu solicitud de encargo personalizado. Te enviaremos un
            presupuesto detallado a tu email en las próximas 24 horas.
          </p>
        </div>

        {/* Información adicional */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 text-left">
          <h2 className="text-sm font-medium mb-3">📋 Próximos pasos:</h2>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5">
                1
              </span>
              <span>Recibirás un email de confirmación en unos minutos</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5">
                2
              </span>
              <span>Te enviaremos un presupuesto personalizado en 24h</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5">
                3
              </span>
              <span>Una vez aceptes, comenzaremos la producción</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5">
                4
              </span>
              <span>Te mantendremos informada del progreso</span>
            </li>
          </ul>
        </div>

        {/* Nota importante */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-left">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Importante
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Si no recibes el email de confirmación en los próximos minutos, revisa tu
            carpeta de spam o contacta con nosotros directamente.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full">
              Volver al inicio
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full">
              Ver catálogo
            </Button>
          </Link>
        </div>

        <p className="text-xs text-neutral-500">
          ¿Necesitas ayuda?{' '}
          <Link
            href="/contact"
            className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Cargando...
            </p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
