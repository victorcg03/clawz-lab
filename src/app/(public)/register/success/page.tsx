import { supabaseServerReadonly } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RegisterSuccessPage() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const justRegistered = cookieStore.get('just_registered');

  // Si no vienes del flujo de registro reciente, no permitimos acceder.
  if (!justRegistered) {
    if (user) redirect('/dashboard');
    redirect('/register');
  }

  // Consumir la cookie (una sola vez)
  try {
    cookieStore.set('just_registered', '', { path: '/', expires: new Date(0) });
  } catch {
    // noop
  }

  const href = user ? '/dashboard' : '/login';
  const label = user ? 'Ir al dashboard' : 'Ir a iniciar sesión';

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-md bg-surface-card rounded-lg p-8 border border-metal-200/20 shadow-sm space-y-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-emerald-600 dark:text-emerald-300"
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
        <h1 className="text-2xl font-semibold tracking-tight">Cuenta creada</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {user
            ? 'Tu cuenta está activa y tu sesión está iniciada. Continúa al dashboard.'
            : 'Si la verificación por email está habilitada, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.'}
        </p>
        <a
          href={href}
          className="btn-base btn-primary inline-flex items-center justify-center h-10 px-5 text-sm"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
