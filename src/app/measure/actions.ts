'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';

// Esquema Zod para validar un perfil de tallas (diámetros en mm opcionales, 5-30 rango razonable)
export const sizeProfileSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  left_thumb: z.number().min(5).max(30).nullable().optional(),
  left_index: z.number().min(5).max(30).nullable().optional(),
  left_middle: z.number().min(5).max(30).nullable().optional(),
  left_ring: z.number().min(5).max(30).nullable().optional(),
  left_pinky: z.number().min(5).max(30).nullable().optional(),
  right_thumb: z.number().min(5).max(30).nullable().optional(),
  right_index: z.number().min(5).max(30).nullable().optional(),
  right_middle: z.number().min(5).max(30).nullable().optional(),
  right_ring: z.number().min(5).max(30).nullable().optional(),
  right_pinky: z.number().min(5).max(30).nullable().optional(),
});

export type SizeProfileInput = z.infer<typeof sizeProfileSchema>;

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
