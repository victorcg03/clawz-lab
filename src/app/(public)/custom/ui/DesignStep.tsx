'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/layout/ui/Button';
import { Input } from '@/components/layout/ui/Input';
import { Select } from '@/components/layout/ui/Select';
import { designSchema, type DesignData, SHAPES, LENGTHS, FINISHES } from '../schema';

interface DesignStepProps {
  readonly data: Partial<DesignData>;
  readonly onUpdate: (data: Partial<DesignData>) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export function DesignStep({ data, onUpdate, onNext, onBack }: DesignStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DesignData>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      colors: [''],
      extras: [],
      urgency: 'standard',
      ...data,
    },
  });

  const onSubmit = (formData: DesignData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Especificaciones del diseño</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Define los detalles técnicos y estéticos de tus uñas personalizadas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shape" className="block text-sm font-medium mb-2">
              Forma *
            </label>
            <Select {...register('shape')} id="shape" error={errors.shape?.message}>
              <option value="">Selecciona una forma</option>
              {SHAPES.map((shape) => (
                <option key={shape.value} value={shape.value}>
                  {shape.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium mb-2">
              Largo *
            </label>
            <Select {...register('length')} id="length" error={errors.length?.message}>
              <option value="">Selecciona un largo</option>
              {LENGTHS.map((length) => (
                <option key={length.value} value={length.value}>
                  {length.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="color1" className="block text-sm font-medium mb-2">
            Color principal *
          </label>
          <Input
            {...register('colors.0')}
            id="color1"
            placeholder="ej: rosa metalizado, negro mate"
            error={errors.colors?.message}
          />
        </div>

        <div>
          <label htmlFor="finish" className="block text-sm font-medium mb-2">
            Acabado *
          </label>
          <Select {...register('finish')} id="finish" error={errors.finish?.message}>
            <option value="">Selecciona un acabado</option>
            {FINISHES.map((finish) => (
              <option key={finish.value} value={finish.value}>
                {finish.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium mb-2">
            Temática <span className="text-neutral-500">(opcional)</span>
          </label>
          <Input
            {...register('theme')}
            id="theme"
            placeholder="ej: gótico, minimalista, vintage, naturaleza..."
            error={errors.theme?.message}
          />
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium mb-2">
            Fecha deseada <span className="text-neutral-500">(opcional)</span>
          </label>
          <Input
            {...register('target_date')}
            id="target_date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            error={errors.target_date?.message}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button type="submit" variant="primary">
            Siguiente: Descripción
          </Button>
        </div>
      </form>
    </div>
  );
}
