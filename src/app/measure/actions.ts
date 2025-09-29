// Archivo exclusivo de server actions (sólo funciones async).
'use server';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabase/server';
import { sizeProfileSchema, type SizeProfileInput } from './schema';

async function getUserId() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('UNAUTHENTICATED');
  return data.user.id;
}

export async function createSizeProfile(input: SizeProfileInput) {
  const parsed = sizeProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };
  const userId = await getUserId();
  const supabase = await supabaseServer();
  const { error } = await supabase.from('size_profiles').insert({
    user_id: userId,
    ...parsed.data,
  });
  if (error) return { ok: false, error: { _db: [error.message] } };
  revalidatePath('/measure');
  return { ok: true };
}

export async function updateSizeProfile(id: string, input: SizeProfileInput) {
  const parsed = sizeProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.flatten().fieldErrors };
  const userId = await getUserId();
  const supabase = await supabaseServer();
  const { error } = await supabase
    .from('size_profiles')
    .update({ ...parsed.data })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) return { ok: false, error: { _db: [error.message] } };
  revalidatePath('/measure');
  return { ok: true };
}

export async function deleteSizeProfile(id: string) {
  const userId = await getUserId();
  const supabase = await supabaseServer();
  const { error } = await supabase
    .from('size_profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/measure');
  return { ok: true };
}
