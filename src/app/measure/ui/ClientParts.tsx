'use client';
import { useState } from 'react';
import { Button } from '@/components/layout/ui/Button';
import { createSizeProfile, deleteSizeProfile, updateSizeProfile } from '../actions';
import { useTranslations, useFormatter } from 'next-intl';

interface ProfileLite {
  readonly id: string;
  readonly name: string;
  readonly created_at: string;
}

const numberFields = [
  'left_thumb',
  'left_index',
  'left_middle',
  'left_ring',
  'left_pinky',
  'right_thumb',
  'right_index',
  'right_middle',
  'right_ring',
  'right_pinky',
] as const;

export default function ClientMeasure({
  userPresent,
  initialProfiles,
}: Readonly<{ userPresent: boolean; initialProfiles: ProfileLite[] }>) {
  return (
    <section
      className={`grid gap-8 ${userPresent ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}
    >
      {/* Formulario principal */}
      <div className={userPresent ? 'lg:col-span-2' : 'lg:col-span-1'}>
        <ProfileForm disabled={!userPresent} />
      </div>

      {/* Lista de perfiles - solo mostrar si hay usuario */}
      {userPresent && (
        <div className="lg:col-span-1">
          <ProfilesList profiles={initialProfiles} canEdit={userPresent} />
        </div>
      )}
    </section>
  );
}

function ProfilesList({
  profiles,
  canEdit,
}: Readonly<{ profiles: ProfileLite[]; canEdit: boolean }>) {
  const getColorGradient = (index: number) => {
    if (index % 3 === 0) return 'from-blue-500 to-blue-600';
    if (index % 3 === 1) return 'from-emerald-500 to-emerald-600';
    return 'from-purple-500 to-purple-600';
  };

  return (
    <div className="glass-card p-6 h-fit sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Perfiles guardados
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {profiles.length} {profiles.length === 1 ? 'perfil' : 'perfiles'}
          </p>
        </div>
      </div>

      {!profiles.length ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            No hay perfiles guardados
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Crea tu primer perfil usando el formulario
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-auto">
          {profiles.map((p, index) => (
            <div
              key={p.id}
              className="surface-card p-4 hover-lift group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Indicador de color por índice */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getColorGradient(index)}`}
              />

              <EditableProfileItem profile={p} canEdit={canEdit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditableProfileItem({
  profile,
  canEdit,
}: Readonly<{ profile: ProfileLite; canEdit: boolean }>) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [pending, setPending] = useState(false);
  const t = useTranslations('measure');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    await updateSizeProfile(profile.id, { name });
    setPending(false);
    setEditing(false);
  };

  if (!canEdit)
    return (
      <div className="flex-1 pl-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {profile.name}
          </p>
        </div>
        <ProfileDate created_at={profile.created_at} />
      </div>
    );

  return (
    <div className="flex-1 pl-4">
      {!editing ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {profile.name}
              </p>
            </div>
            <ProfileDate created_at={profile.created_at} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Editar perfil"
            >
              <svg
                className="w-3 h-3 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <DeleteButton id={profile.id} />
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 text-xs flex-1 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
            disabled={pending}
          />
          <Button
            type="submit"
            disabled={pending || !name}
            size="sm"
            className="h-7 px-3 text-[11px]"
            variant="primary"
            loading={pending}
          >
            {t('update')}
          </Button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            disabled={pending}
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}

function ProfileDate({ created_at }: Readonly<{ created_at: string }>) {
  const format = useFormatter();
  const date = new Date(created_at);
  // Usamos zona UTC explícita para evitar divergencias server/client en hidración
  const label = format.dateTime(date, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
  return (
    <time className="text-xs opacity-60" dateTime={created_at} suppressHydrationWarning>
      {label}
    </time>
  );
}

function DeleteButton({ id }: Readonly<{ id: string }>) {
  const [loading, setLoading] = useState(false);
  return (
    <form
      action={async () => {
        setLoading(true);
        await deleteSizeProfile(id);
        setLoading(false);
      }}
    >
      <button
        type="submit"
        disabled={loading}
        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
        title="Eliminar perfil"
      >
        {loading ? (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
    </form>
  );
}

function ProfileForm({ disabled }: Readonly<{ disabled: boolean }>) {
  const [state, setState] = useState<null | { ok: boolean; error?: unknown }>(null);
  const [pending, setPending] = useState(false);
  const [activeHand, setActiveHand] = useState<'left' | 'right'>('left');
  const t = useTranslations('measure');

  // Si está deshabilitado, mostrar mensaje de login
  if (disabled) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600">
          <svg
            className="w-12 h-12 text-neutral-400 dark:text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          Inicia sesión para crear perfiles
        </h3>

        <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          Para crear y guardar perfiles de medidas personalizados necesitas tener una
          cuenta. Es rápido y gratuito.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="btn-base btn-primary px-6 py-3 text-sm font-medium">
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="btn-base btn-outline px-6 py-3 text-sm font-medium"
          >
            Crear cuenta
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            🔒 Tus medidas se guardan de forma segura y privada
          </p>
        </div>
      </div>
    );
  }

  const onAction = async (formData: FormData) => {
    setPending(true);
    const input: Record<string, unknown> = { name: formData.get('name') as string };
    numberFields.forEach((f) => {
      const raw = formData.get(f) as string;
      if (raw) {
        const num = Number(raw);
        if (!Number.isNaN(num)) input[f] = num;
      }
    });
    const result = await createSizeProfile({
      name: String(input.name),
      ...('left_thumb' in input
        ? { left_thumb: input.left_thumb as number | undefined }
        : {}),
      ...('left_index' in input
        ? { left_index: input.left_index as number | undefined }
        : {}),
      ...('left_middle' in input
        ? { left_middle: input.left_middle as number | undefined }
        : {}),
      ...('left_ring' in input
        ? { left_ring: input.left_ring as number | undefined }
        : {}),
      ...('left_pinky' in input
        ? { left_pinky: input.left_pinky as number | undefined }
        : {}),
      ...('right_thumb' in input
        ? { right_thumb: input.right_thumb as number | undefined }
        : {}),
      ...('right_index' in input
        ? { right_index: input.right_index as number | undefined }
        : {}),
      ...('right_middle' in input
        ? { right_middle: input.right_middle as number | undefined }
        : {}),
      ...('right_ring' in input
        ? { right_ring: input.right_ring as number | undefined }
        : {}),
      ...('right_pinky' in input
        ? { right_pinky: input.right_pinky as number | undefined }
        : {}),
    });
    setState(result);
    setPending(false);
  };

  const leftFields = numberFields.filter((f) => f.startsWith('left_'));
  const rightFields = numberFields.filter((f) => f.startsWith('right_'));

  const getFingerName = (finger: string) => {
    const fingerName = finger.split('_')[1];
    const names: Record<string, string> = {
      thumb: 'Pulgar',
      index: 'Índice',
      middle: 'Medio',
      ring: 'Anular',
      pinky: 'Meñique',
    };
    return names[fingerName] || fingerName;
  };

  const getFingerNumber = (finger: string) => {
    const fingerName = finger.split('_')[1];
    const numbers: Record<string, string> = {
      thumb: '01',
      index: '02',
      middle: '03',
      ring: '04',
      pinky: '05',
    };
    return numbers[fingerName] || '00';
  };

  return (
    <div className="glass-card p-8 space-y-8 relative overflow-hidden">
      {/* Patrones geométricos minimalistas */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute top-12 right-12 w-px h-16 bg-current" />
        <div className="absolute top-12 right-12 w-16 h-px bg-current" />
        <div className="absolute bottom-12 left-12 w-px h-12 bg-current" />
        <div className="absolute bottom-12 left-12 w-12 h-px bg-current" />
      </div>

      {/* Header minimalista */}
      <div className="relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600">
            <svg
              className="w-8 h-8 text-neutral-600 dark:text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75V18a2.25 2.25 0 01-2.25 2.25h-3A2.25 2.25 0 018.25 18v-2.25m8.5-6.5V9a2.25 2.25 0 00-2.25-2.25h-3A2.25 2.25 0 009.25 9v2.25m8.5 0a2.625 2.625 0 11-5.25 0m5.25 0H11.25m4.5 0V12a2.25 2.25 0 00-2.25-2.25H9a2.25 2.25 0 00-2.25 2.25v2.25"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Nuevo perfil de medidas
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sistema de medición precisa para uñas personalizadas
          </p>
        </div>
      </div>

      <form action={onAction} className="space-y-8">
        {/* Nombre del perfil */}
        <div className="space-y-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-900 dark:text-neutral-100"
          >
            {t('nameLabel')}
          </label>
          <input
            id="name"
            name="name"
            required
            disabled={disabled || pending}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all"
            placeholder={t('namePlaceholder')}
          />
        </div>

        {/* Selector de mano minimalista */}
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="flex gap-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-xl p-1 border border-neutral-200/50 dark:border-neutral-600/50">
              <button
                type="button"
                onClick={() => setActiveHand('left')}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeHand === 'left'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-700/50'
                }`}
              >
                Mano Izquierda
              </button>
              <button
                type="button"
                onClick={() => setActiveHand('right')}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeHand === 'right'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-700/50'
                }`}
              >
                Mano Derecha
              </button>
            </div>
          </div>

          {/* Grid de medidas minimalista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeHand === 'left' ? leftFields : rightFields).map((field, index) => (
              <div
                key={field}
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="surface-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center">
                        <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400">
                          {getFingerNumber(field)}
                        </span>
                      </div>
                      <div>
                        <label
                          htmlFor={field}
                          className="block text-sm font-medium text-neutral-900 dark:text-neutral-100"
                        >
                          {getFingerName(field)}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id={field}
                      name={field}
                      type="number"
                      step="0.1"
                      min={5}
                      max={30}
                      disabled={disabled || pending}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all text-center font-mono text-lg backdrop-blur-sm"
                      placeholder="0.0"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-md">
                        mm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de guardar */}
        <div className="flex flex-col gap-4">
          <Button
            disabled={disabled || pending}
            loading={pending}
            size="lg"
            className="w-full"
            variant="primary"
          >
            {t('save')}
          </Button>

          {/* Estados */}
          {state && !state.ok && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600 dark:text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    Error al guardar el perfil
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Por favor, revisa los datos e inténtalo de nuevo
                  </p>
                </div>
              </div>
            </div>
          )}

          {state?.ok && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                    Perfil creado correctamente
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    Tus medidas han sido guardadas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
