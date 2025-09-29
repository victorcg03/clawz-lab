'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { measurementSchema, type MeasurementData } from '../schema';

interface MeasurementStepProps {
  readonly data: Partial<MeasurementData>;
  readonly onUpdate: (data: Partial<MeasurementData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export function MeasurementStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: MeasurementStepProps) {
  const [useCustomSizes, setUseCustomSizes] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<MeasurementData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: MeasurementData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Medidas de las uñas</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Para crear uñas que se ajusten perfectamente, necesitamos las medidas de cada
          dedo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Opciones de medidas */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="use-profile"
              name="measurement-type"
              checked={!useCustomSizes}
              onChange={() => setUseCustomSizes(false)}
              className="w-4 h-4"
            />
            <label htmlFor="use-profile" className="text-sm font-medium">
              Usar un perfil de medidas guardado
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="use-custom"
              name="measurement-type"
              checked={useCustomSizes}
              onChange={() => setUseCustomSizes(true)}
              className="w-4 h-4"
            />
            <label htmlFor="use-custom" className="text-sm font-medium">
              Introducir medidas personalizadas
            </label>
          </div>
        </div>

        {!useCustomSizes ? (
          /* Selección de perfil */
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
            <h3 className="text-sm font-medium mb-3">Perfiles guardados</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              No tienes perfiles de medidas guardados aún.
              <br />
              Puedes introducir medidas personalizadas o ir a la página de medidas para
              crear un perfil.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open('/measure', '_blank')}
            >
              Ir a la guía de medidas
            </Button>
          </div>
        ) : (
          /* Medidas personalizadas */
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
            <h3 className="text-sm font-medium mb-4">Medidas personalizadas</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Por simplicidad en esta demo, puedes continuar sin introducir medidas
              específicas. En una implementación completa, aquí habría campos para cada
              dedo.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-medium mb-2">Mano izquierda</h4>
                <div className="space-y-1 text-neutral-500">
                  <div>Pulgar: ___ mm</div>
                  <div>Índice: ___ mm</div>
                  <div>Medio: ___ mm</div>
                  <div>Anular: ___ mm</div>
                  <div>Meñique: ___ mm</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mano derecha</h4>
                <div className="space-y-1 text-neutral-500">
                  <div>Pulgar: ___ mm</div>
                  <div>Índice: ___ mm</div>
                  <div>Medio: ___ mm</div>
                  <div>Anular: ___ mm</div>
                  <div>Meñique: ___ mm</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.root && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.root.message}</p>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">
            💡 Consejos para medir correctamente:
          </h3>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Usa una regla o cinta métrica flexible</li>
            <li>• Mide el ancho del lecho ungueal en la parte más ancha</li>
            <li>• Toma las medidas en milímetros para mayor precisión</li>
            <li>• Es normal que cada dedo tenga un tamaño diferente</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit" variant="primary">
            Siguiente: Resumen
          </Button>
        </div>
      </form>
    </div>
  );
}
