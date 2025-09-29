'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { inspirationSchema, type InspirationData } from '../schema';

interface InspirationStepProps {
  readonly data: Partial<InspirationData>;
  readonly onUpdate: (data: Partial<InspirationData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export function InspirationStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: InspirationStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InspirationData>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: {
      inspiration_urls: [''],
      ...data,
    },
  });

  const onSubmit = (formData: InspirationData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Inspiración visual</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Comparte enlaces de inspiración que representen tu visión. Esto nos ayudará a
          entender mejor el estilo que buscas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="inspiration_url1" className="block text-sm font-medium mb-2">
            Enlace de inspiración <span className="text-neutral-500">(opcional)</span>
          </label>
          <Input
            {...register('inspiration_urls.0')}
            id="inspiration_url1"
            placeholder="https://pinterest.com/pin/..."
            error={errors.inspiration_urls?.message}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">
            💡 Fuentes de inspiración recomendadas:
          </h3>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Pinterest (diseños de uñas)</li>
            <li>• Instagram (@nail_artists, #nailart)</li>
            <li>• YouTube (tutoriales de nail art)</li>
            <li>• Revistas de moda y belleza</li>
            <li>• Fotos de tus propias uñas anteriores que te gustaron</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit" variant="primary">
            Siguiente: Medidas
          </Button>
        </div>
      </form>
    </div>
  );
}
