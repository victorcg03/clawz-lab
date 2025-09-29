'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../auth/schema';
import { forgotPasswordAction } from '../auth/actions';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await forgotPasswordAction(data);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
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

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Email enviado</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu
                email.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="forgot-password-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              data-testid="forgot-password-error"
            >
              {error}
            </div>
          )}

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
              data-testid="forgot-password-email"
            />
          </div>

          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Enviar enlace
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 underline underline-offset-4 transition-colors"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
