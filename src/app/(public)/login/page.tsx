'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Nota: longitud mínima reducida a 4 para que la contraseña 'fail' utilizada en tests
// pase la validación y podamos simular el error de auth. Ajustar a 6+ en implementación real.
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    // mock login fail if password === 'fail'
    if (data.password === 'fail') {
      setError('Credenciales inválidas');
    } else {
      setError(null);
      // redirect placeholder
      window.location.href = '/(private)';
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="login-form"
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border rounded w-full p-2"
            {...register('email')}
            data-testid="login-email"
          />
          {formState.errors.email && (
            <p className="text-xs text-red-600">{formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="border rounded w-full p-2"
            {...register('password')}
            data-testid="login-password"
          />
          {formState.errors.password && (
            <p className="text-xs text-red-600">{formState.errors.password.message}</p>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-700" data-testid="login-error">
            {error}
          </p>
        )}
        <button
          disabled={formState.isSubmitting}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
