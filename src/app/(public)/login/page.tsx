'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../auth/schema';
import { loginAction } from '../auth/actions';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<LoginInput>({
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Inicia sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-pink-400 hover:text-pink-300 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="login-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-md"
              data-testid="login-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                error={formState.errors.email?.message}
                data-testid="login-email"
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
                autoComplete="current-password"
                placeholder="Contraseña"
                variant="glass"
                error={formState.errors.password?.message}
                data-testid="login-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
