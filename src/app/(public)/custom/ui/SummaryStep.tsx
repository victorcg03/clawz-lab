'use client';

import { Button } from '@/components/layout/ui/Button';
import type { ContactData, DesignData, DescriptionData } from '../schema';

interface WizardData {
  readonly contact: Partial<ContactData>;
  readonly design: Partial<DesignData>;
  readonly description: Partial<DescriptionData>;
}

interface SummaryStepProps {
  readonly data: WizardData;
  readonly onBack: () => void;
  readonly onSubmit: () => void;
  readonly isSubmitting: boolean;
  readonly error: string | null;
}

export function SummaryStep({
  data,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: SummaryStepProps) {
  const formatExtras = (extras: string[] = []) => {
    if (extras.length === 0) return 'Ninguno';
    return extras.join(', ');
  };

  const formatColors = (colors: string[] = []) => {
    return colors.filter((c) => c.trim() !== '').join(', ') || 'No especificado';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Resumen de tu solicitud</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Revisa todos los detalles antes de enviar tu solicitud de encargo personalizado.
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Información de contacto */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <h3 className="font-medium mb-3">Información de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Nombre:</span>
              <div className="font-medium">
                {data.contact.contact_name || 'No especificado'}
              </div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Email:</span>
              <div className="font-medium">{data.contact.email || 'No especificado'}</div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Teléfono:</span>
              <div className="font-medium">
                {data.contact.phone || 'No proporcionado'}
              </div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">
                Preferencia de contacto:
              </span>
              <div className="font-medium">
                {data.contact.communication_preference === 'email' && 'Email'}
                {data.contact.communication_preference === 'phone' && 'Teléfono'}
                {data.contact.communication_preference === 'whatsapp' && 'WhatsApp'}
                {!data.contact.communication_preference && 'Email'}
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones del diseño */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <h3 className="font-medium mb-3">Especificaciones del diseño</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Forma:</span>
              <div className="font-medium">{data.design.shape || 'No especificada'}</div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Largo:</span>
              <div className="font-medium">{data.design.length || 'No especificado'}</div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Acabado:</span>
              <div className="font-medium">{data.design.finish || 'No especificado'}</div>
            </div>
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Urgencia:</span>
              <div className="font-medium">
                {data.design.urgency === 'standard' && 'Estándar (2-3 semanas)'}
                {data.design.urgency === 'express' && 'Express (1-2 semanas)'}
                {data.design.urgency === 'urgent' && 'Urgente (5-7 días)'}
                {!data.design.urgency && 'Estándar'}
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="text-neutral-600 dark:text-neutral-400">Colores:</span>
              <div className="font-medium">{formatColors(data.design.colors)}</div>
            </div>
            {(data.design.theme || data.design.extras?.length) && (
              <>
                {data.design.theme && (
                  <div className="md:col-span-2">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Temática:
                    </span>
                    <div className="font-medium">{data.design.theme}</div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <span className="text-neutral-600 dark:text-neutral-400">Extras:</span>
                  <div className="font-medium">{formatExtras(data.design.extras)}</div>
                </div>
              </>
            )}
            {data.design.target_date && (
              <div className="md:col-span-2">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Fecha deseada:
                </span>
                <div className="font-medium">{data.design.target_date}</div>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        {data.description.brief && (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
            <h3 className="font-medium mb-3">Descripción detallada</h3>
            <div className="text-sm">
              <p className="whitespace-pre-wrap">{data.description.brief}</p>
            </div>
          </div>
        )}

        {/* Nota importante */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">📋 Próximos pasos</h3>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Recibirás un email de confirmación de tu solicitud</li>
            <li>• Te enviaremos un presupuesto detallado en las próximas 24 horas</li>
            <li>• Una vez aceptes el presupuesto, comenzaremos la producción</li>
            <li>• Te mantendremos informada del progreso en todo momento</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Anterior
        </Button>
        <Button type="button" variant="primary" onClick={onSubmit} loading={isSubmitting}>
          Enviar solicitud
        </Button>
      </div>
    </div>
  );
}
