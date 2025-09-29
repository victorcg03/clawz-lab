'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/layout/ui/Button';
import { Input } from '@/components/layout/ui/Input';
import { Select } from '@/components/layout/ui/Select';
import { contactSchema, type ContactData, COMMUNICATION_PREFERENCES } from '../schema';

interface ContactStepProps {
  readonly data: Partial<ContactData>;
  readonly onUpdate: (data: Partial<ContactData>) => void;
  readonly onNext: () => void;
}

export function ContactStep({ data, onUpdate, onNext }: ContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: ContactData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Información de contacto</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Necesitamos tus datos para enviarte el presupuesto y mantenerte informada del
          progreso.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium mb-2">
            Nombre completo *
          </label>
          <Input
            {...register('contact_name')}
            id="contact_name"
            type="text"
            placeholder="María García"
            error={errors.contact_name?.message}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="maria@email.com"
            error={errors.email?.message}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Teléfono <span className="text-neutral-500">(opcional)</span>
          </label>
          <Input
            {...register('phone')}
            id="phone"
            type="tel"
            placeholder="600000000"
            error={errors.phone?.message}
            maxLength={9}
          />
        </div>

        <div>
          <label
            htmlFor="communication_preference"
            className="block text-sm font-medium mb-2"
          >
            Preferencia de comunicación
          </label>
          <Select
            {...register('communication_preference')}
            id="communication_preference"
            error={errors.communication_preference?.message}
          >
            {COMMUNICATION_PREFERENCES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary">
            Siguiente: Diseño
          </Button>
        </div>
      </form>
    </div>
  );
}
