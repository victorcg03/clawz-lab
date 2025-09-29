import { supabaseServerReadonly } from '@/lib/supabase/server';
import ClientMeasure from '@/app/measure/ui/ClientParts';
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('measure');
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Fondo con patrones tribales y efectos metálicos */}
      <div className="absolute inset-0 -z-10">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 via-neutral-100/30 to-neutral-200/50 dark:from-neutral-950/80 dark:via-neutral-900/60 dark:to-neutral-800/40" />

        {/* Patrones geométricos tribales */}
        <div className="absolute inset-0 pattern-dots opacity-20" />

        {/* Efectos de luz */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-radial from-blue-200/20 to-transparent blur-2xl animate-pulse" />
        <div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-radial from-purple-200/15 to-transparent blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-radial from-emerald-200/10 to-transparent blur-lg animate-pulse"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header Hero */}
        <header className="text-center mb-16 relative">
          <div className="glass-card inline-block mb-4 px-4 py-2 text-xs font-medium tracking-wide text-neutral-700 dark:text-neutral-300">
            Sistema de medidas personalizado
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
            {t('heading')}
          </h1>

          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-neutral-600 dark:text-neutral-300 mb-8">
            {t('intro')}
          </p>
        </header>

        <ClientMeasure userPresent={!!user} initialProfiles={profiles} />
      </div>
    </main>
  );
}
