import { supabaseServerReadonly } from '@/lib/supabase/server';
import ClientMeasure from './ui/ClientParts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getData() {
  const supabase = await supabaseServerReadonly();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user)
    return {
      user: null,
      profiles: [] as { id: string; name: string; created_at: string }[],
    };
  const { data: profiles } = await supabase
    .from('size_profiles')
    .select('id,name,created_at')
    .order('created_at', { ascending: false });
  return {
    user: auth.user,
    profiles: (profiles ?? []) as { id: string; name: string; created_at: string }[],
  };
}

export default async function MeasurePage() {
  const { user, profiles } = await getData();
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Mediciones</h1>
        <p className="text-sm opacity-80">
          Guarda perfiles de medidas (diámetros internos en mm) para reutilizarlos en
          pedidos personalizados o compras.
        </p>
        {!user && (
          <p className="text-sm text-red-600">
            Inicia sesión para crear y gestionar perfiles.{' '}
            <Link className="underline" href="/login">
              Login
            </Link>
          </p>
        )}
      </header>
      <ClientMeasure userPresent={!!user} initialProfiles={profiles} />
    </main>
  );
}
