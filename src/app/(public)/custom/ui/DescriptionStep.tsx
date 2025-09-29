'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/layout/ui/Button';
import { Textarea } from '@/components/layout/ui/Textarea';
import { descriptionSchema, type DescriptionData } from '../schema';

interface DescriptionStepProps {
  readonly data: Partial<DescriptionData>;
  readonly onUpdate: (data: Partial<DescriptionData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export function DescriptionStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: DescriptionStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DescriptionData>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: data,
  });

  const briefValue = watch('brief') || '';
  const charactersLeft = 1000 - briefValue.length;

  const getCharacterCountColor = () => {
    if (charactersLeft < 0) return 'text-red-600';
    if (charactersLeft < 100) return 'text-yellow-600';
    return 'text-neutral-500';
  };

  const onSubmit = (formData: DescriptionData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Descripción detallada</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Describe con detalle tu visión. Cuanta más información nos proporciones, mejor
          podremos interpretar y materializar tu idea.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="brief" className="block text-sm font-medium mb-2">
            Descripción detallada *
          </label>
          <Textarea
            {...register('brief')}
            id="brief"
            rows={8}
            placeholder="Describe tu diseño ideal: estilo, elementos específicos, sensaciones que quieres transmitir, ocasión para la que las usarás, referencias de estilo, etc. Por ejemplo: 'Quiero uñas que transmitan elegancia minimalista para mi boda. Me gustan los tonos nude con detalles sutiles en dorado. He visto diseños con l��neas finas geométricas que me encantan...'"
            error={errors.brief?.message}
          />
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-neutral-500">Mínimo 10 caracteres</span>
            <span className={getCharacterCountColor()}>
              {charactersLeft} caracteres restantes
            </span>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">
            💡 Consejos para una mejor descripción:
          </h3>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
            <li>
              • Menciona la ocasión o propósito (trabajo, evento especial, uso diario)
            </li>
            <li>
              • Describe el estilo que buscas (elegante, atrevido, minimalista, llamativo)
            </li>
            <li>• Incluye colores específicos o paletas que te gusten</li>
            <li>• Menciona elementos o técnicas específicas si las conoces</li>
            <li>• Comparte sensaciones o emociones que quieres transmitir</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit" variant="primary">
            Siguiente: Inspiración
          </Button>
        </div>
      </form>
    </div>
  );
}
