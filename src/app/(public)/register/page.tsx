'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, type RegisterInput } from '../auth/schema';
import { registerAction } from '../auth/actions';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setSuccess(null);

    try {
      const result = await registerAction(data);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.message || 'Cuenta creada exitosamente');
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-pink-400 hover:text-pink-300 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-200 bg-green-500/20 border border-green-500/30 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <Input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Nombre completo"
                variant="glass"
                error={errors.name?.message}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                variant="glass"
                error={errors.email?.message}
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Teléfono
              </label>
              <Input
                {...register('phone')}
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Teléfono (opcional)"
                variant="glass"
                error={errors.phone?.message}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Contraseña"
                variant="glass"
                error={errors.password?.message}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar contraseña
              </label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirmar contraseña"
                variant="glass"
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Crear cuenta
            </Button>
          </div>

          <p className="text-xs text-gray-300 text-center">
            Al crear una cuenta, aceptas nuestros{' '}
            <Link
              href="/terms"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              términos y condiciones
            </Link>{' '}
            y{' '}
            <Link
              href="/privacy"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              política de privacidad
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
