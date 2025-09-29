'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginInput } from '../auth/schema';
import { loginAction } from '../auth/actions';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(redirectPath);
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-medium underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="login-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              data-testid="login-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                data-testid="login-email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                data-testid="login-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 underline underline-offset-4 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" variant="primary" loading={isLoading} className="w-full">
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
