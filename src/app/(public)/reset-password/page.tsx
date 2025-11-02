'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '../auth/schema';
import { resetPasswordAction } from '../auth/actions';
import { Button } from '@/components/layout/ui/Button';
import { PasswordInput } from '@/components/layout/ui/Input';

function ResetPasswordPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [status, setStatus] = useState<
    'checking' | 'ready' | 'error' | 'submitting' | 'done'
  >('checking');
  const [error, setError] = useState<string | null>(null);

  // Try to get code from query (?code=)
  const queryCode = search.get('code');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // If already have a session, allow resetting without code
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (active) setStatus('ready');
          return;
        }

        // fallback: read from URL hash (#code=...)
        let code = queryCode || undefined;
        if (!code && typeof globalThis !== 'undefined' && globalThis.location) {
          const hash = (globalThis.location.hash || '').replace(/^#/, '');
          if (hash) {
            const sp = new URLSearchParams(hash);
            code = sp.get('code') || undefined;
          }
        }
        if (!code) {
          setError('Enlace inválido o expirado. Solicita uno nuevo.');
          setStatus('error');
          return;
        }

        const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exErr) {
          setError('No se pudo validar el enlace. Solicita uno nuevo.');
          setStatus('error');
          return;
        }
        if (active) setStatus('ready');
      } catch (err) {
        console.error('[reset-password] exchange error', err);
        setError('Error inesperado al validar el enlace.');
        setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [queryCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  type ResetResult =
    | { success: true }
    | { error: string; fieldErrors?: Record<string, string[]> };
  const onSubmit = async (data: ResetPasswordInput) => {
    setStatus('submitting');
    setError(null);
    try {
      const result = (await resetPasswordAction({
        password: data.password,
        confirmPassword: data.confirmPassword,
      })) as ResetResult;
      if ('error' in result) {
        setError(result.error);
        setStatus('ready');
        return;
      }
      setStatus('done');
      // Give a brief success state then go to login
      setTimeout(() => router.push('/login'), 800);
    } catch (err) {
      console.error('[reset-password] submit error', err);
      setError('No se pudo actualizar la contraseña.');
      setStatus('ready');
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Validando enlace...
        </div>
      </div>
    );
  }

  let description: string;
  if (status === 'done') {
    description = 'Tu contraseña ha sido actualizada correctamente.';
  } else if (status === 'error') {
    description = error || 'Enlace inválido o expirado.';
  } else {
    description = 'Introduce tu nueva contraseña.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-sm bg-surface-card rounded-lg p-8 border border-metal-200/20 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {status === 'done' ? 'Contraseña actualizada' : 'Establecer nueva contraseña'}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>

        {status !== 'done' && (
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="reset-password-form"
          >
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Nueva contraseña
              </label>
              <PasswordInput
                {...register('password')}
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                data-testid="reset-password-password"
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
                data-testid="reset-password-confirm-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={status === 'submitting'}
              disabled={status === 'error'}
            >
              Guardar nueva contraseña
            </Button>
          </form>
        )}

        {status === 'done' && (
          <button
            className="btn-base btn-primary h-10 px-5 text-sm w-full"
            onClick={() => router.push('/login')}
          >
            Ir a iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Cargando...
          </div>
        </div>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  );
}
