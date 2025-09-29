'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/layout/ui/Button';
import { Input, PasswordInput } from '@/components/layout/ui/Input';
import { registerSchema, type RegisterInput } from '../auth/schema';
import { registerAction } from '../auth/actions';

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerAction(data);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-sm bg-surface-card rounded-lg p-8 border border-metal-200/20 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="register-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              data-testid="register-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre completo
              </label>
              <Input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="María García"
                error={errors.name?.message}
                data-testid="register-name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                data-testid="register-email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <PasswordInput
                {...register('password')}
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                data-testid="register-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <PasswordInput
                {...register('confirmPassword')}
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                data-testid="register-confirm-password"
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
                autoComplete="tel"
                placeholder="+34 600 000 000"
                error={errors.phone?.message}
                data-testid="register-phone"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Crear cuenta
          </Button>

          <p className="text-xs text-neutral-500 text-center">
            Al crear tu cuenta, aceptas nuestros términos de servicio y política de
            privacidad.
          </p>
        </form>
      </div>
    </div>
  );
}
