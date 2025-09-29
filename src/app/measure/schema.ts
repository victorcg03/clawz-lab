import { z } from 'zod';

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
