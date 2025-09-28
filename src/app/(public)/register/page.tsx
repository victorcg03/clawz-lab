'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
type Values = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  const onSubmit = () => {
    window.location.href = '/(private)';
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-1">
            Nombre
          </label>
          <input id="name" className="border rounded w-full p-2" {...register('name')} />
          {formState.errors.name && (
            <p className="text-xs text-red-600">{formState.errors.name.message}</p>
          )}
        </div>
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
        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="border rounded w-full p-2"
            {...register('password')}
          />
          {formState.errors.password && (
            <p className="text-xs text-red-600">{formState.errors.password.message}</p>
          )}
        </div>
        <button className="bg-black text-white px-4 py-2 rounded">Registrarme</button>
      </form>
    </div>
  );
}
