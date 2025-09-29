'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const onSubmit = () => setSent(true);
  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Recuperar contraseña</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Email
          </label>
          <input
            id="email"
            className="border rounded w-full p-2"
            {...register('email')}
          />
          {formState.errors.email && (
            <p className="text-xs text-red-600">{formState.errors.email.message}</p>
          )}
        </div>
        <button className="w-full rounded-full bg-black text-white py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors">
          Enviar
        </button>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          <a href="/login" className="underline underline-offset-4">
            Volver a login
          </a>
        </p>
      </form>
      {sent && <p className="text-sm mt-4 text-green-600">Email enviado (mock).</p>}
    </div>
  );
}
