'use client';
import { useState } from 'react';
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
    <section className="grid gap-12 md:grid-cols-2">
      <ProfileForm disabled={!userPresent} />
      <ProfilesList profiles={initialProfiles} canEdit={userPresent} />
    </section>
  );
}

function ProfilesList({
  profiles,
  canEdit,
}: Readonly<{ profiles: ProfileLite[]; canEdit: boolean }>) {
  const t = useTranslations('measure');
  if (!profiles.length) return <div className="text-sm opacity-70">{t('empty')}</div>;
  return (
    <ul className="space-y-3 max-h-[480px] overflow-auto pr-2">
      {profiles.map((p) => (
        <li
          key={p.id}
          className="border rounded p-3 text-sm flex items-start justify-between gap-4"
        >
          <EditableProfileItem profile={p} canEdit={canEdit} />
        </li>
      ))}
    </ul>
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
      <div className="flex-1 flex justify-between">
        <div>
          <p className="font-medium">{profile.name}</p>
          <ProfileDate created_at={profile.created_at} />
        </div>
      </div>
    );
  return (
    <div className="flex-1 flex flex-col gap-2">
      {!editing && (
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{profile.name}</p>
            <ProfileDate created_at={profile.created_at} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs underline"
            >
              {t('update')}
            </button>
            <DeleteButton id={profile.id} />
          </div>
        </div>
      )}
      {editing && (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1 text-xs flex-1"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending || !name}
            className="text-xs bg-black text-white px-2 py-1 rounded disabled:opacity-50"
          >
            {pending ? t('saving') : t('update')}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs underline"
            disabled={pending}
          >
            Cancelar
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
  const t = useTranslations('measure');
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
        className="text-red-600 text-xs hover:underline disabled:opacity-50"
      >
        {t('delete')}
      </button>
    </form>
  );
}

function ProfileForm({ disabled }: Readonly<{ disabled: boolean }>) {
  const [state, setState] = useState<null | { ok: boolean; error?: unknown }>(null);
  const [pending, setPending] = useState(false);
  const t = useTranslations('measure');
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
  return (
    <form action={onAction} className="space-y-4 border rounded p-4 bg-white/50">
      <h2 className="font-medium">{t('new')}</h2>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-xs font-medium">
          {t('nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          required
          disabled={disabled || pending}
          className="border rounded px-2 py-1 w-full text-sm"
          placeholder={t('namePlaceholder')}
        />
      </div>
      <fieldset className="grid grid-cols-2 gap-3">
        {numberFields.map((f) => (
          <div key={f} className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wide opacity-70">
              {f.replace('_', ' ')}
            </label>
            <input
              name={f}
              type="number"
              step="0.1"
              min={5}
              max={30}
              disabled={disabled || pending}
              className="border rounded px-2 py-1 w-full text-xs"
            />
          </div>
        ))}
      </fieldset>
      <button
        disabled={disabled || pending}
        className="bg-black text-white text-sm px-3 py-1.5 rounded disabled:opacity-50"
      >
        {pending ? t('saving') : t('save')}
      </button>
      {state && !state.ok && (
        <pre className="text-xs text-red-600 whitespace-pre-wrap">
          {JSON.stringify(state.error, null, 2)}
        </pre>
      )}
      {state?.ok && <p className="text-xs text-green-600">{t('createdOk')}</p>}
    </form>
  );
}
