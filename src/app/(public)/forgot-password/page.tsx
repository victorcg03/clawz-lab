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
      <h2 className="text-xl font-semibold mb-4">Recuperar contraseña</h2>
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
        <button className="bg-black text-white px-4 py-2 rounded">Enviar</button>
      </form>
      {sent && <p className="text-sm mt-4 text-green-600">Email enviado (mock).</p>}
    </div>
  );
}
